const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ProductImage {
  url: string;
}

export interface ProductCompany {
  id: string;
  ownerUserId: string;
  displayName: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export interface ProductUnit {
  id: string;
  name: string;
  code: string;
}

export interface ProductSpecs {
  [key: string]: string;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  price: string;
  currency: string;
  stock: number;
  unitId: string;
  categoryId: string;
  shortFeatures: string[];
  description: string;
  specs: ProductSpecs;
  images: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  company: ProductCompany;
  category: ProductCategory;
  unit: ProductUnit;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface ProductResponse {
  data: Product;
}

class ProductsAPI {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        cache: options.cache ?? "no-store",
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

  async getProducts(page: number = 1, pageSize: number = 12): Promise<ProductsResponse> {
    return this.request<ProductsResponse>(`/products?page=${page}&pageSize=${pageSize}`);
  }

  async getProductById(id: string): Promise<Product> {
    const response = await this.request<ProductResponse>(`/products/${id}`);
    return response.data;
  }
}

export const productsAPI = new ProductsAPI(API_BASE_URL);

