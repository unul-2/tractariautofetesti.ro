import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const businessQuery = 'Tractari Auto, Strada Calarasi 1, Fetesti, Ialomita, Romania';
const businessName = 'tractari auto';
const placeIdKey = 'google-place-id';

type GoogleReview = {
  authorAttribution?: { displayName?: string; photoUri?: string; uri?: string };
  googleMapsUri?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
};

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'cache-control': 'private, no-store',
      vary: 'Origin',
    },
  });
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

async function resolvePlaceId(apiKey: string) {
  const store = getStore('tractari-site-settings');
  const configured = process.env.GOOGLE_PLACE_ID?.trim();
  if (configured) return configured;

  const cached = (await store.get(placeIdKey, { type: 'text' })) as string | null;
  if (cached) return cached;

  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': apiKey,
      'x-goog-fieldmask': 'places.id,places.displayName,places.formattedAddress',
    },
    body: JSON.stringify({ languageCode: 'ro', regionCode: 'RO', textQuery: businessQuery }),
  });
  if (!response.ok) throw new Error('Unable to resolve Google place');

  const payload = (await response.json()) as {
    places?: { id?: string; displayName?: { text?: string }; formattedAddress?: string }[];
  };
  const match = payload.places?.find((place) => {
    const name = normalize(place.displayName?.text ?? '');
    const address = normalize(place.formattedAddress ?? '');
    return name.includes(businessName) && address.includes('fetesti');
  });
  if (!match?.id) throw new Error('Google place was not verified');

  // Google permits persisting a Place ID; no rating, review, author, or text is cached.
  await store.set(placeIdKey, match.id);
  return match.id;
}

export const config: Config = {
  method: 'GET',
  path: '/api/google-reviews',
  rateLimit: { aggregateBy: 'ip', windowLimit: 10, windowSize: 60 },
};

const handler = async (_request: Request, _context: Context) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  if (!apiKey) return json({ error: 'Google reviews are not configured' }, 503);

  try {
    const placeId = await resolvePlaceId(apiKey);
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=ro&regionCode=RO`,
      {
        headers: {
          'x-goog-api-key': apiKey,
          'x-goog-fieldmask': 'rating,userRatingCount,googleMapsUri,reviews',
        },
      },
    );
    if (!response.ok) throw new Error('Google place details unavailable');

    const place = (await response.json()) as {
      googleMapsUri?: string;
      rating?: number;
      reviews?: GoogleReview[];
      userRatingCount?: number;
    };
    const reviews = (place.reviews ?? [])
      .filter((review) => review.text?.text && review.googleMapsUri && review.authorAttribution?.displayName)
      .map((review) => ({
        author: {
          name: review.authorAttribution?.displayName ?? 'Utilizator Google',
          photoUrl: review.authorAttribution?.photoUri,
          profileUrl: review.authorAttribution?.uri,
        },
        published: review.relativePublishTimeDescription ?? 'Recenzie Google',
        rating: review.rating ?? 0,
        sourceUrl: review.googleMapsUri ?? place.googleMapsUri ?? '',
        text: review.text?.text ?? '',
      }));

    return json({
      rating: place.rating ?? 0,
      reviewCount: place.userRatingCount ?? 0,
      reviews,
      sourceUrl: place.googleMapsUri ?? 'https://www.google.com/maps/search/?api=1&query=Tractari%20Auto%20Fetesti',
    });
  } catch {
    return json({ error: 'Google reviews unavailable' }, 502);
  }
};

export default handler;
