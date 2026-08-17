export const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

console.log("API_URL:", API_URL);

async function request(endpoint, options = {}) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Terjadi kesalahan."
    );
  }

  return data;
}


export async function getEvents() {
  return request("/events");
}


export async function getEvent(id) {
  return request(`/events/${id}`);
}


export async function getAnnouncements() {
  return request("/announcements");
}


export async function getResults() {
  return request("/results");
}


export async function registerEvent(eventId) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("LOGIN_REQUIRED");
  }

  return request(
    `/registrations/${eventId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}