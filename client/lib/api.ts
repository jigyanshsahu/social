const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/**
 * Fetch wrapper that automatically adds Authorization token to headers
 * @param endpoint - API endpoint (e.g., "/api/users" or "/api/posts")
 * @param options - Fetch options
 * @returns Response from API
 */
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle token expiration
  if (response.status === 401) {
    // Token expired or invalid
    clearToken();
    // Optionally redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
  }

  return response;
}

/**
 * Get token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null; // SSR compatibility
  }
  return localStorage.getItem("authToken");
}

/**
 * Store token in localStorage
 */
export function setToken(token: string): void {
  if (typeof window === "undefined") {
    return; // SSR compatibility
  }
  localStorage.setItem("authToken", token);
}

/**
 * Remove token from localStorage
 */
export function clearToken(): void {
  if (typeof window === "undefined") {
    return; // SSR compatibility
  }
  localStorage.removeItem("authToken");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
