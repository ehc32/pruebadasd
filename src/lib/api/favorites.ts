const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

export interface FavoriteProduct {
  id: string;
  name: string;
  price: string;
  currency: string;
  stock: number;
}

export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: FavoriteProduct;
}

export interface FavoritesResponse {
  data: Favorite[];
}

export interface AddFavoriteRequest {
  productId: string;
}

export interface AddFavoriteResponse {
  data: {
    id: string;
    userId: string;
    productId: string;
    createdAt: string;
  };
}

class FavoritesAPI {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
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
          errorData = { message: await response.text() || "" };
        }

        throw new Error(errorData.message || "Error en la petición");
      }

      // Para DELETE que retorna 204 sin cuerpo
      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (error: any) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Ocurrió un error inesperado. Por favor, intenta nuevamente.");
    }
  }

  async getFavorites(): Promise<Favorite[]> {
    const response = await this.request<FavoritesResponse>("/favorites");
    return response.data;
  }

  async addFavorite(productId: string): Promise<AddFavoriteResponse["data"]> {
    const response = await this.request<AddFavoriteResponse>("/favorites", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    return response.data;
  }

  async removeFavorite(productId: string): Promise<void> {
    await this.request(`/favorites/${productId}`, {
      method: "DELETE",
    });
  }
}

export const favoritesAPI = new FavoritesAPI(API_BASE_URL);

