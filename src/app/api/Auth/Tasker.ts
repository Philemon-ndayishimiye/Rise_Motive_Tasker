import { apiSlice } from "../../api/EntryApi";

export interface ServiceRequest {
  id: number;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service?: string;
  description: string;
  documentUrl?: string;
  preferredDate?: string;
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  tasker?: string;
  createdAt: string;
  updatedAt: string;
}

// Add this interface at the top

export interface TaskerDashboardResponse {
  tasker: {
    id: number;
    name: string;
    email?: string;
    title: string;
    specialties: string;
    image?: string;
  };
  services: {
    egov: ServiceRequest[];
    applicationDocs: ServiceRequest[];
    creativeMedia: ServiceRequest[];
    webDigital: ServiceRequest[];
    legal: ServiceRequest[];
  };
  summary: {
    totalAssigned: number;
    egov: number;
    applicationDocs: number;
    creativeMedia: number;
    webDigital: number;
    legal: number;
  };
}

export interface Tasker {
  id: number;
  name: string;
  title: string;
  image?: string;
  phone: string;
  email?: string;
  specialties: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskerRequest {
  name: string;
  title: string;
  image?: string; // URL string (paste URL mode or returned from server)
  imageFile?: File | null; // actual File object for multipart upload
  phone: string;
  email?: string;
  specialties: string;
  isActive: boolean;
}

export interface UpdateTaskerRequest extends Partial<CreateTaskerRequest> {
  id: number;
}

export interface MessageResponse {
  message: string;
}

export const taskerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTaskers: builder.query<Tasker[], void>({
      query: () => "taskers",
      transformResponse: (response: { total: number; items: Tasker[] }) => {
        console.log("Raw taskers response:", response);
        return response.items ?? [];
      },
      providesTags: ["Tasker"],
    }),

    getTaskerById: builder.query<Tasker, number>({
      query: (id) => `taskers/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Tasker", id }],
    }),

    createTasker: builder.mutation<Tasker, CreateTaskerRequest>({
      query: (data) => {
        // Build multipart FormData — same pattern as InfoPost
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("title", data.title);
        formData.append("phone", data.phone);
        formData.append("specialties", data.specialties);
        formData.append("isActive", String(data.isActive));

        if (data.email) {
          formData.append("email", data.email);
        }

        // Real File picked → multipart file upload
        if (data.imageFile) {
          formData.append("image", data.imageFile);
        } else if (data.image) {
          // URL string pasted → send as plain field
          formData.append("image", data.image);
        }

        return {
          url: "taskers",
          method: "POST",
          body: formData,
          // formData: true tells RTK Query NOT to set Content-Type manually
          // so browser sets it with the correct multipart boundary
          formData: true,
        };
      },
      invalidatesTags: ["Tasker"],
    }),

    updateTasker: builder.mutation<Tasker, UpdateTaskerRequest>({
      query: ({ id, ...data }) => ({
        url: `taskers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tasker", id },
        "Tasker",
      ],
    }),

    deleteTasker: builder.mutation<MessageResponse, number>({
      query: (id) => ({
        url: `taskers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasker"],
    }),

    toggleActivateTasker: builder.mutation<MessageResponse, number>({
      query: (id) => ({
        url: `taskers/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: ["Tasker"],
    }),

    getMyServices: builder.query<TaskerDashboardResponse, void>({
      query: () => ({
        url: "tasker/my-services",
        method: "GET",
      }),
      providesTags: ["Tasker"],
    }),
  }),
});

export const {
  useGetAllTaskersQuery,
  useGetTaskerByIdQuery,
  useCreateTaskerMutation,
  useUpdateTaskerMutation,
  useDeleteTaskerMutation,
  useToggleActivateTaskerMutation,
  useGetMyServicesQuery,
} = taskerApi;
