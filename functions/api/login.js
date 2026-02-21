import { createSession, json } from './_store';

export async function onRequestPost({ request }) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) {
    return json({ error: 'Email and password are required.' }, 400);
  }

  const token = createSession(email);
  return json(
    { ok: true, email },
    200,
    {
      'Set-Cookie': `ascentra_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`,
    }
  );
}
