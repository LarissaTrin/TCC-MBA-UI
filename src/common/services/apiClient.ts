import { getSession } from "next-auth/react";

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

async function authHeaders(): Promise<HeadersInit> {
  const session = await getSession();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (session?.user?.accessToken) {
    headers["Authorization"] = `Bearer ${session.user.accessToken}`;
  }
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
    const headers = await authHeaders();
    const res = await fetch(`${API_URL}${path}`, { headers });
    return handleResponse<T>(res);
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const headers = await authHeaders();
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async postForm<T>(path: string, formData: URLSearchParams): Promise<T> {
    const session = await getSession();
    const headers: HeadersInit = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    if (session?.user?.accessToken) {
      headers["Authorization"] = `Bearer ${session.user.accessToken}`;
    }
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers,
      body: formData,
    });
    return handleResponse<T>(res);
  },

  async put<T>(path: string, body?: unknown): Promise<T> {
    const headers = await authHeaders();
    const res = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete(path: string): Promise<void> {
    const headers = await authHeaders();
    const res = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) {
      const body = await res.text();
      throw new ApiError(res.status, body);
    }
  },
};
