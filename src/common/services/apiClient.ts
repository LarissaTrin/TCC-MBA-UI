import { getAuthToken } from "@/common/utils/tokenStore";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`API Error ${status}: ${body}`);
    this.name = "ApiError";
  }
}

/** Synchronous — reads token from in-memory store set by BaseLayout. */
function authHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/** Synchronous variant for form submissions. */
function formHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, body);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, { headers: authHeaders() });
    return handleResponse<T>(res);
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: authHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async postForm<T>(path: string, formData: URLSearchParams): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: formHeaders(),
      body: formData,
    });
    return handleResponse<T>(res);
  },

  async put<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: authHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete(path: string): Promise<void> {
    const res = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new ApiError(res.status, body);
    }
  },
};
