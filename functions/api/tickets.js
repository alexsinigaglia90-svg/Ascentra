import { addTicket, getSession, json, listTickets } from './_store';

export async function onRequestGet({ request }) {
  const session = getSession(request);
  if (!session?.user) return json({ error: 'Unauthorized' }, 401);
  return json({ tickets: listTickets(session.user.email) });
}

export async function onRequestPost({ request }) {
  const session = getSession(request);
  if (!session?.user) return json({ error: 'Unauthorized' }, 401);

  const { title, description, priority } = await request.json().catch(() => ({}));
  if (!title || !description) return json({ error: 'Title and description are required.' }, 400);

  const ticket = {
    id: crypto.randomUUID().slice(0, 8).toUpperCase(),
    title,
    description,
    priority: priority || 'Medium',
    createdAt: new Date().toLocaleString(),
  };

  addTicket(session.user.email, ticket);
  return json({ ok: true, ticket }, 201);
}
