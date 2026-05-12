/**
 * Type definitions for Manhwa library API
 * Based on the MongoDB Mongoose schema
 */

export interface Link {
  _id: string;
  idioma: string;
  url: string;
  cap_atual: number;
  cap_total: number;
}

export interface Manhwa {
  _id: string;
  titulos: string[];
  slug: string;
  capa: string;
  status: 'ativo' | 'concluído' | 'pausado' | 'dropped';
  capitulos: number;
  tags: string[];
  links: Link[];
  createdAt: string;
  updatedAt: string;
}

export interface ListManhwasResponse {
  success: boolean;
  data: Manhwa[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetManhwaResponse {
  success: boolean;
  data: Manhwa;
}

export interface CreateManhwaPayload {
  titulos: string[];
  capa?: File;
  status: string;
  capitulos: number;
  tags?: string[];
}

export interface UpdateManhwaPayload {
  titulos?: string[];
  capa?: File;
  status?: string;
  capitulos?: number;
  tags?: string[];
}

export interface CreateLinkPayload {
  idioma: string;
  url: string;
  cap_atual: number;
  cap_total: number;
}

export interface UpdateLinkPayload {
  idioma?: string;
  url?: string;
  cap_atual?: number;
  cap_total?: number;
}

export interface UpdateChapterPayload {
  cap_atual: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  status?: number;
}
