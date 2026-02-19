const store = globalThis.__ASCENTRA_DEMO_STORE || {
  sessions: new Map(),
  tickets: new Map(),
};

globalThis.__ASCENTRA_DEMO_STORE = store;

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

export function parseCookie(cookieHeader = '') {
  const out = {};
  cookieHeader.split(';').forEach((part) => {
    const [key, ...value] = part.trim().split('=');
    if (!key) return;
    out[key] = decodeURIComponent(value.join('='));
  });
  return out;
}

export function createSession(email) {
  const token = crypto.randomUUID();
  store.sessions.set(token, { email, createdAt: new Date().toISOString() });
  return token;
}

export function getSession(request) {
  const cookies = parseCookie(request.headers.get('Cookie') || '');
  const token = cookies.ascentra_session;
  if (!token) return null;
  return { token, user: store.sessions.get(token) || null };
}

export function clearSession(token) {
  if (token) store.sessions.delete(token);
}

export function listTickets(email) {
  return store.tickets.get(email) || [];
}

export function addTicket(email, ticket) {
  const current = store.tickets.get(email) || [];
  current.unshift(ticket);
  store.tickets.set(email, current.slice(0, 20));
}
