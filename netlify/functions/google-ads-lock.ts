import type { Config, Context } from '@netlify/functions';
import { getUser } from '@netlify/identity';
import {
  clearEditSessionCookie,
  writeAdminAudit,
} from '../lib/admin-ads-security';

export const config: Config = {
  method: 'POST',
  path: '/api/admin/google-ads/lock',
};

const handler = async (_request: Request, _context: Context) => {
  const user = await getUser();
  if (!user) return new Response('Authentication required', { status: 401 });
  if (!user.roles?.includes('admin')) {
    return new Response('Administrator access required', { status: 403 });
  }

  await writeAdminAudit(user, 'ads_edit_locked_manually');

  return Response.json(
    { ok: true },
    {
      headers: {
        'cache-control': 'no-store',
        'set-cookie': clearEditSessionCookie(),
      },
    },
  );
};

export default handler;
