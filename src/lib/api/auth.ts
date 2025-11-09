const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "CLIENTE";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string | null;
}

class AuthAPI {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getErrorMessage(status: number, errorData: any, endpoint: string): string {
    // Intentar obtener mensaje específico del servidor
    if (errorData?.message) {
      // Si el mensaje viene en inglés, intentar traducirlo
      const serverMessage = errorData.message.toLowerCase();
      
      // Mensajes comunes del servidor
      if (serverMessage.includes("unauthorized") || serverMessage.includes("invalid credentials")) {
        return "Credenciales incorrectas. Verifica tu email y contraseña.";
      }
      if (serverMessage.includes("user not found") || serverMessage.includes("usuario no encontrado")) {
        return "No existe una cuenta con este email.";
      }
      if (serverMessage.includes("email already exists") || serverMessage.includes("email ya existe")) {
        return "Este email ya está registrado. Intenta iniciar sesión.";
      }
      if (serverMessage.includes("password") && serverMessage.includes("weak")) {
        return "La contraseña es muy débil. Debe tener al menos 8 caracteres.";
      }
      if (serverMessage.includes("invalid email")) {
        return "El formato del email no es válido.";
      }
      
      // Si el mensaje es descriptivo, usarlo directamente
      return errorData.message;
    }

    // Mensajes basados en código HTTP
    switch (status) {
      case 400:
        if (endpoint.includes("register")) {
          return "Datos inválidos. Por favor, verifica la información ingresada.";
        }
        if (endpoint.includes("login")) {
          return "Email o contraseña incorrectos. Intenta nuevamente.";
        }
        return "Solicitud incorrecta. Por favor, verifica los datos.";
      
      case 401:
        if (endpoint.includes("me")) {
          return "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
        }
        return "Credenciales incorrectas. Verifica tu email y contraseña.";
      
      case 403:
        return "No tienes permisos para realizar esta acción.";
      
      case 404:
        return "El servicio no está disponible en este momento.";
      
      case 409:
        return "Este email ya está registrado. Intenta iniciar sesión.";
      
      case 422:
        return "Los datos ingresados no son válidos. Por favor, verifica la información.";
      
      case 500:
        return "Error del servidor. Por favor, intenta más tarde.";
      
      case 503:
        return "El servicio no está disponible temporalmente. Intenta más tarde.";
      
      default:
        return `Error inesperado (${status}). Por favor, intenta nuevamente.`;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // Si no se puede parsear el JSON, usar el texto de respuesta
          errorData = { message: await response.text() || "" };
        }

        const errorMessage = this.getErrorMessage(response.status, errorData, endpoint);
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error: any) {
      // Si es un error de red
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
      }
      // Si ya es un Error con mensaje, re-lanzarlo
      if (error instanceof Error) {
        throw error;
      }
      // Error desconocido
      throw new Error("Ocurrió un error inesperado. Por favor, intenta nuevamente.");
    }
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<User> {
    const response = await this.request<{ data: User }>("/auth/me");
    return response.data;
  }

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }
}

export const authAPI = new AuthAPI(API_BASE_URL);

