import { apiSlice } from "../../api/EntryApi";

export interface Course {
  id: number;
  title: string;
  teacher: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseRequest {
  title: string;
  teacher: string;
  image?: string;
  imageFile?: File | null;
  isActive: boolean;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  id: number;
}

export interface MessageResponse {
  message: string;
}

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourses: builder.query<Course[], void>({
      query: () => "courses",
      transformResponse: (response: Course[] | { items: Course[] }) => {
        if (Array.isArray(response)) return response;
        return response.items ?? [];
      },
      providesTags: ["Course"],
    }),

    getCourseById: builder.query<Course, number>({
      query: (id) => `courses/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Course", id }],
    }),

    createCourse: builder.mutation<Course, CreateCourseRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("teacher", data.teacher);
        formData.append("isActive", String(data.isActive));

        if (data.imageFile) {
          formData.append("image", data.imageFile);
        } else if (data.image) {
          formData.append("image", data.image);
        }

        return {
          url: "courses",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Course"],
    }),

    updateCourse: builder.mutation<Course, UpdateCourseRequest>({
      query: ({ id, imageFile, ...data }) => {
        // If there's a new image file, use FormData
        if (imageFile) {
          const formData = new FormData();
          if (data.title) formData.append("title", data.title);
          if (data.teacher) formData.append("teacher", data.teacher);
          if (data.isActive !== undefined)
            formData.append("isActive", String(data.isActive));
          formData.append("image", imageFile);
          return {
            url: `courses/${id}`,
            method: "PUT",
            body: formData,
            formData: true,
          };
        }
        // No new image — send as JSON
        return {
          url: `courses/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Course", id },
        "Course",
      ],
    }),

    deleteCourse: builder.mutation<MessageResponse, number>({
      query: (id) => ({
        url: `courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    toggleActivateCourse: builder.mutation<Course, number>({
      query: (id) => ({
        url: `courses/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useToggleActivateCourseMutation,
} = courseApi;