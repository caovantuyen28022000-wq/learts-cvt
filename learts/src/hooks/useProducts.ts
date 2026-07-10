import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: any[];
}

export const useProductsQuery = (params: { page: number; limit: number; categoryId?: number | null }) => {
  return useQuery<ProductsResponse>({
    queryKey: ['products', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(params.page));
      queryParams.append('limit', String(params.limit));
      if (params.categoryId) {
        queryParams.append('categoryId', String(params.categoryId));
      }
      return api.get(`/products?${queryParams.toString()}`);
    },
    placeholderData: (previousData) => previousData, // smooth pagination transition
  });
};

export const useCategoriesQuery = () => {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: async () => api.get('/categories'),
  });
};

export const useProductDetailQuery = (productId: number) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => api.get(`/products/${productId}`),
    enabled: !isNaN(productId) && productId > 0,
  });
};
