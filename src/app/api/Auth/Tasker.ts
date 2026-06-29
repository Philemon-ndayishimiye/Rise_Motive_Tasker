import { apiSlice } from "../../api/EntryApi";

export type TaskerRole =
  | "RM_STAFF_MEMBER"
  | "SENIOR_RMT_STORE"
  | "SENIOR_RMT_STORE_AND_CYBER"
  | "SENIOR_RMT_CYBER"
  | "RM_TASKER_JUNIOR";

export interface Tasker {
  id: number;
  name: string;
  title: string;
  image?: string;
  phone: string;
  email?: string;
  province?: string;
  district?: string;
  sector?: string;
  specialties: string;
  shortNotesService?: string;
  shortNotePapeterie?: string;
  shortNote?: string;
  isActive: boolean;
  role?: TaskerRole;
  papeterieName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskerRequest {
  name: string;
  title: string;
  image?: string;
  imageFile?: File | null;
  phone: string;
  email?: string;
  province?: string;
  district?: string;
  sector?: string;
  specialties: string;
  shortNotesService?: string;
  shortNotePapeterie?: string;
  isActive: boolean;
  role?: TaskerRole;
  papeterieName?: string;
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
        console.log("TASKER DATA:", data);
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

        // ── Location fields — only append if a value was selected ──
        if (data.province) {
          formData.append("province", data.province);
        }
        if (data.district) {
          formData.append("district", data.district);
        }

        if (data.shortNotesService) {
          formData.append("shortNotesService", data.shortNotesService);
        }

        if (data.shortNotePapeterie) {
          formData.append("shortNotePapeterie", data.shortNotePapeterie);
        }
        if (data.sector) {
          formData.append("sector", data.sector);
        }

        if (data.role) {
          formData.append("role", data.role);
        }
        if (data.papeterieName) {
          formData.append("papeterieName", data.papeterieName);
        }

        for (const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        return {
          url: "taskers",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Tasker"],
    }),

    updateTasker: builder.mutation<Tasker, UpdateTaskerRequest>({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        if (data.name !== undefined) formData.append("name", data.name);
        if (data.title !== undefined) formData.append("title", data.title);
        if (data.phone !== undefined) formData.append("phone", data.phone);
        if (data.specialties !== undefined)
          formData.append("specialties", data.specialties);
        if (data.isActive !== undefined)
          formData.append("isActive", String(data.isActive));
        if (data.email !== undefined) formData.append("email", data.email);
        if (data.imageFile) {
          formData.append("image", data.imageFile);
        } else if (data.image !== undefined) {
          formData.append("image", data.image);
        }

        if (data.shortNotesService !== undefined) {
          formData.append("shortNoteService", data.shortNotesService);
        }

        if (data.shortNotePapeterie !== undefined) {
          formData.append("shortNotePapeterie", data.shortNotePapeterie);
        }
        // ── Location fields — only append if a value was selected ──
        if (data.province !== undefined) {
          formData.append("province", data.province);
        }
        if (data.district !== undefined) {
          formData.append("district", data.district);
        }
        if (data.sector !== undefined) {
          formData.append("sector", data.sector);
        }
        if (data.role !== undefined) {
          formData.append("role", data.role);
        }
        if (data.papeterieName !== undefined) {
          formData.append("papeterieName", data.papeterieName);
        }
        return {
          url: `taskers/${id}`,
          method: "PUT",
          body: formData,
          formData: true,
        };
      },
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
  }),
});

export const {
  useGetAllTaskersQuery,
  useGetTaskerByIdQuery,
  useCreateTaskerMutation,
  useUpdateTaskerMutation,
  useDeleteTaskerMutation,
  useToggleActivateTaskerMutation,
} = taskerApi;
