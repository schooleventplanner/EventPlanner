const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://eventplanner.fastapicloud.dev";

console.log("API_URL:", API_URL);

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `Request gagal (${response.status})`;

    throw new Error(
      Array.isArray(message)
        ? message.map((item) => item.msg).join(", ")
        : message
    );
  }

  return data;
}

// EVENTS
export async function getEvents() {
  return request("/events");
}

export async function getEvent(id) {
  return request(`/events/${id}`);
}

// ANNOUNCEMENTS
export async function getAnnouncements() {
  return request("/announcements");
}

// RESULTS
export async function getResults() {
  return request("/results");
}

// AUTH
export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function register(userData) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// REGISTRATION
export async function registerEvent(eventId) {
  const token = localStorage.getItem("access_token");

  return request(`/registrations/${eventId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// USER
export async function getMe() {
  const token = localStorage.getItem("access_token");

  return request("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// DASHBOARD
export async function getAttendanceHistory() {
  const token = localStorage.getItem("access_token");

  return request("/student/attendance/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}