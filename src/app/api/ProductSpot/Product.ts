import { apiSlice } from "../../api/EntryApi";

export interface Product {
  id: number;
  name: string;
  description: string;
  pricePerUnit?: string;
  priceWholesale?: string;
  deliveryRetail?: string;
  deliveryWholesale?: string;
  category: string;
  imageUrl: string;
  inStock: boolean;
  taskerId?: number;
  tasker?: {
    id: number;
    name: string;
    papeterieName?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  items: Product[];
  total: number;
}

export interface UpdateProductRequest {
  id: number;
  name?: string;
  description?: string;
  pricePerUnit?: string;
  priceWholesale?: string;
  deliveryRetail?: string;
  deliveryWholesale?: string;
  category?: string;
  imageUrl?: string;
  inStock?: boolean;
  taskerId?: number;
}

export interface MessageResponse {
  message: string;
}

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<ProductsResponse, void>({
      query: () => {
        const user = JSON.parse(localStorage.getItem("user") ?? "{}");
        const taskerId = user?.id;
        return taskerId ? `products?taskerId=${taskerId}` : "products";
      },
      providesTags: ["Product"],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    //  Accepts FormData — image goes to Cloudinary via server.ts POST /products
    createProduct: builder.mutation<Product, FormData>({
      query: (data) => ({
        url: "products",
        method: "POST",
        body: data,
        //  Do NOT set Content-Type — browser sets it with boundary automatically
        formData: true,
      }),
      invalidatesTags: ["Product"],
    }),

    //  JSON update (no file upload on edit)
    updateProduct: builder.mutation<
      Product,
      UpdateProductRequest | { id: number; formData: FormData }
    >({
      query: (arg) => {
        if ("formData" in arg) {
          return {
            url: `products/${arg.id}`,
            method: "PUT",
            body: arg.formData,
            formData: true,
          };
        }
        const { id, ...data } = arg as UpdateProductRequest;
        return {
          url: `products/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: "Product", id: arg.id },
        "Product",
      ],
    }),

    deleteProduct: builder.mutation<MessageResponse, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
