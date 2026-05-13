import { apiSlice } from "../../api/EntryApi";

// ── Types ──────────────────────────────────────────────────────────────────

export type InfoPostCategory =
  | "JOB"
  | "SCHOLARSHIP"
  | "COMPETITION"
  | "GRANTS_AND_FUNDING"
  | "RISE_MOTIVE"
  | "TENDERS"
  | "INTERNSHIPS"
  | "TRAINING_AND_COURSES"
  | string;

export interface InfoPost {
  id: number;
  title: string;
  slug?: string;
  description: string;
  category: InfoPostCategory;
  deadline?: string;
  location?: string;
  applyLink?: string;
  contactInfo?: string;
  image?: string; // Cloudinary URL stored by the server
  qualificationCriteria: string[];
  stepsToApply: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface InfoPostsResponse {
  items: InfoPost[];
  total: number;
}

// Used in the modal form state
export interface CreateInfoPostRequest {
  title: string;
  slug?: string;
  description: string;
  category: InfoPostCategory;
  deadline?: string;
  location?: string;
  applyLink?: string;
  image?: string;
  contactInfo?: string;
  qualificationCriteria: string[];
  stepsToApply: string[];
  isActive: boolean;
}

// UPDATE uses JSON body (tsoa controller) — image is a URL string
export interface UpdateInfoPostRequest {
  id: number;
  title?: string;
  description?: string;
  category?: InfoPostCategory;
  deadline?: string;
  location?: string;
  applyLink?: string;
  contactInfo?: string;
  image?: string;
  qualificationCriteria?: string[];
  stepsToApply: string[];
  isActive?: boolean;
}

export interface MessageResponse {
  message: string;
}

// ── API Slice ──────────────────────────────────────────────────────────────

export const infoPostApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllInfoPosts: builder.query<InfoPostsResponse, void>({
      query: () => "info-posts",
      providesTags: ["InfoPost"],
    }),

    getInfoPostById: builder.query<InfoPost, number>({
      query: (id) => `info-posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "InfoPost", id }],
    }),

    // POST /info-posts — multipart FormData, server uploads image to Cloudinary

    createInfoPost: builder.mutation<
      InfoPost,
      CreateInfoPostRequest & { imageFile?: File | null }
    >({
      query: ({ imageFile, ...body }) => {
        if (imageFile) {
          const formData = new FormData();
          formData.append("image", imageFile);

          Object.entries(body).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            if (key === "qualificationCriteria") {
              formData.append("qualificationCriteria", JSON.stringify(value));
            } else if (typeof value === "boolean") {
              formData.append(key, value ? "true" : "false");
            } else {
              formData.append(key, String(value));
            }
          });

          return { url: "info-posts", method: "POST", body: formData };
        }

        return { url: "info-posts", method: "POST", body };
      },
      invalidatesTags: ["InfoPost"],
    }),

    // PUT /info-posts/:id — plain JSON body (tsoa controller)
    updateInfoPost: builder.mutation<InfoPost, UpdateInfoPostRequest>({
      query: ({ id, ...body }) => ({
        url: `info-posts/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "InfoPost", id },
        "InfoPost",
      ],
    }),

    deleteInfoPost: builder.mutation<MessageResponse, number>({
      query: (id) => ({
        url: `info-posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InfoPost"],
    }),

    // PATCH /info-posts/:id/toggle-active  ← correct endpoint name
    toggleActivateInfoPost: builder.mutation<InfoPost, number>({
      query: (id) => ({
        url: `info-posts/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "InfoPost", id },
        "InfoPost",
      ],
    }),
  }),
});

export const {
  useGetAllInfoPostsQuery,
  useGetInfoPostByIdQuery,
  useCreateInfoPostMutation,
  useUpdateInfoPostMutation,
  useDeleteInfoPostMutation,
  useToggleActivateInfoPostMutation,
} = infoPostApi;
