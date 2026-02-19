async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function setStatus(message, isError) {
  const node = document.getElementById('portal-status');
  if (!node) return;
  node.textContent = message;
  node.style.color = isError ? '#922' : 'var(--muted)';
}

function renderTickets(tickets) {
  const list = document.getElementById('ticket-list');
  if (!list) return;
  list.innerHTML = '';
  if (!tickets.length) {
    list.innerHTML = '<li class="ticket-item">No tickets yet. Create your first request.</li>';
    return;
  }

  tickets.forEach((ticket) => {
    const li = document.createElement('li');
    li.className = 'ticket-item';
    li.innerHTML = `<strong>${ticket.title}</strong><div class="ticket-meta">#${ticket.id} · ${ticket.priority} · ${ticket.createdAt}</div><p>${ticket.description}</p>`;
    list.appendChild(li);
  });
}

async function loadSessionAndTickets() {
  try {
    const session = await request('/api/session');
    document.getElementById('session-user').textContent = session.user?.email || 'Not signed in';
    document.getElementById('ticket-form').style.display = session.authenticated ? 'block' : 'none';
    document.getElementById('logout-btn').style.display = session.authenticated ? 'inline-block' : 'none';
    const ticketsData = await request('/api/tickets');
    renderTickets(ticketsData.tickets || []);
    setStatus(session.authenticated ? 'Authenticated. You may submit and review requests.' : 'Please sign in to use the portal.');
  } catch (error) {
    setStatus(error.message, true);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
      };
      try {
        await request('/api/login', { method: 'POST', body: JSON.stringify(payload) });
        setStatus('Login successful. Loading your portal…');
        loginForm.reset();
        await loadSessionAndTickets();
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  const ticketForm = document.getElementById('ticket-form');
  if (ticketForm) {
    ticketForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = {
        title: document.getElementById('ticket-title').value,
        description: document.getElementById('ticket-description').value,
        priority: document.getElementById('ticket-priority').value,
      };
      try {
        await request('/api/tickets', { method: 'POST', body: JSON.stringify(payload) });
        ticketForm.reset();
        setStatus('Ticket submitted.');
        await loadSessionAndTickets();
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  const logoutButton = document.getElementById('logout-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        await request('/api/logout', { method: 'POST' });
        setStatus('Signed out.');
        await loadSessionAndTickets();
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  loadSessionAndTickets();
});
