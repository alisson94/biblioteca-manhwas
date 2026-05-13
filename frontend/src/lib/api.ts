/**
 * API Client for Biblioteca Manhwas backend
 * Handles all CRUD operations with proper error handling and typing
 */

import { 
  Manhwa, 
  ListManhwasResponse, 
  GetManhwaResponse, 
  CreateManhwaPayload, 
  UpdateManhwaPayload,
  CreateLinkPayload,
  UpdateLinkPayload,
  UpdateChapterPayload,
  ApiResponse,

} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const API_V1_URL = `${API_BASE_URL}/api/v1`;

/**
 * Helper function to handle API responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      success: false,
      message: 'Unknown error occurred'
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Manhwa CRUD operations
 */
export const manhwaApi = {
  /**
   * List all manhwas with pagination, search, and filtering
   */
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    tags?: string;
  }): Promise<ListManhwasResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.tags) searchParams.append('tags', params.tags);

    const url = `${API_V1_URL}/manhwas${searchParams.size > 0 ? `?${searchParams}` : ''}`;
    const response = await fetch(url);
    return handleResponse<ListManhwasResponse>(response);
  },

  /**
   * Get a single manhwa by slug
   */
  async getBySlug(slug: string): Promise<GetManhwaResponse> {
    const response = await fetch(`${API_V1_URL}/manhwas/${slug}`);
    return handleResponse<GetManhwaResponse>(response);
  },

  /**
   * Create a new manhwa
   */
  async create(payload: CreateManhwaPayload): Promise<ApiResponse<Manhwa>> {
    const formData = new FormData();
    
    // Add array of titles
    payload.titulos.forEach((titulo, index) => {
      formData.append(`titulos[${index}]`, titulo);
    });
    
    if (payload.capa) {
      formData.append('capa', payload.capa);
    }
    
    formData.append('status', payload.status);
    formData.append('capitulos', payload.capitulos.toString());
    
    if (payload.tags?.length) {
      payload.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
    }

    const response = await fetch(`${API_V1_URL}/manhwas`, {
      method: 'POST',
      body: formData,
    });
    
    return handleResponse<ApiResponse<Manhwa>>(response);
  },

  /**
   * Update an existing manhwa
   */
  async update(slug: string, payload: UpdateManhwaPayload): Promise<ApiResponse<Manhwa>> {
    const formData = new FormData();
    
    if (payload.titulos?.length) {
      payload.titulos.forEach((titulo, index) => {
        formData.append(`titulos[${index}]`, titulo);
      });
    }
    
    if (payload.capa) {
      formData.append('capa', payload.capa);
    }
    
    if (payload.status) {
      formData.append('status', payload.status);
    }
    
    if (payload.capitulos !== undefined) {
      formData.append('capitulos', payload.capitulos.toString());
    }
    
    if (payload.tags?.length) {
      payload.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
    }

    const response = await fetch(`${API_V1_URL}/manhwas/${slug}`, {
      method: 'PUT',
      body: formData,
    });
    
    return handleResponse<ApiResponse<Manhwa>>(response);
  },

  /**
   * Delete a manhwa
   */
  async delete(slug: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_V1_URL}/manhwas/${slug}`, {
      method: 'DELETE',
    });
    
    return handleResponse<ApiResponse<void>>(response);
  },
};

/**
 * Link operations (nested under manhwas)
 */
export const linkApi = {
  /**
   * Add a new link to a manhwa
   */
  async add(manhwaSlug: string, payload: CreateLinkPayload): Promise<ApiResponse<Manhwa>> {
    const response = await fetch(`${API_V1_URL}/manhwas/${manhwaSlug}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    return handleResponse<ApiResponse<Manhwa>>(response);
  },

  /**
   * Update an existing link
   */
  async update(
    manhwaSlug: string,
    linkId: string,
    payload: UpdateLinkPayload
  ): Promise<ApiResponse<Manhwa>> {
    const response = await fetch(`${API_V1_URL}/manhwas/${manhwaSlug}/links/${linkId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    return handleResponse<ApiResponse<Manhwa>>(response);
  },

  /**
   * Delete a link
   */
  async delete(manhwaSlug: string, linkId: string): Promise<ApiResponse<Manhwa>> {
    const response = await fetch(`${API_V1_URL}/manhwas/${manhwaSlug}/links/${linkId}`, {
      method: 'DELETE',
    });
    
    return handleResponse<ApiResponse<Manhwa>>(response);
  },

  /**
   * Update chapter information for a link
   */
  async updateChapter(
    manhwaSlug: string,
    linkId: string,
    payload: UpdateChapterPayload
  ): Promise<ApiResponse<Manhwa>> {
    const response = await fetch(`${API_V1_URL}/manhwas/${manhwaSlug}/links/${linkId}/chapter`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    return handleResponse<ApiResponse<Manhwa>>(response);
  },
};
