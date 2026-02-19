import { getSession, json } from './_store';

export async function onRequestGet({ request }) {
  const session = getSession(request);
  return json({
    authenticated: Boolean(session?.user),
    user: session?.user || null,
  });
}
