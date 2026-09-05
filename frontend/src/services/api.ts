const TOKEN_KEY = 'auth_token';

class ApiClient {
  private getHeaders(contentType: string | null = 'application/json'): HeadersInit {
    const headers: Record<string, string> = {};
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  setToken(token: string, rememberMe: boolean = true) {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }

  private async formatError(response: Response): Promise<Error> {
    const errorText = await response.text().catch(() => 'Unknown error');
    let message = errorText;
    let code: string | undefined;
    try {
      const json = JSON.parse(errorText);
      code = json.code;
      if (json.message) {
        message = json.message;
      } else if (Array.isArray(json) && json.length > 0) {
        code = json[0].code || code;
        message = json.map((e: any) => e.description || e.message).join(', ');
      } else if (json.title) {
        message = json.title;
      }
    } catch {
      // Not JSON
    }
    const err: any = new Error(message || `HTTP error! status: ${response.status}`);
    err.code = code;
    err.status = response.status;
    return err;
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw await this.formatError(response);
    }
    
    return response.json() as Promise<T>;
  }

  async post<T, U = any>(url: string, body: U): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw await this.formatError(response);
    }

    // Handle empty response bodies or simple JSON
    const text = await response.text();
    return (text ? JSON.parse(text) : {}) as T;
  }

  async delete(url: string): Promise<void> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw await this.formatError(response);
    }
  }

  async put<T, U = any>(url: string, body: U): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw await this.formatError(response);
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : {}) as T;
  }
}

export const api = new ApiClient();
