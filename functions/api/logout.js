import { clearSession, getSession, json } from './_store';

export async function onRequestPost({ request }) {
  const session = getSession(request);
  clearSession(session?.token);
  return json(
    { ok: true },
    200,
    {
      'Set-Cookie': 'ascentra_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0',
    }
  );
}
