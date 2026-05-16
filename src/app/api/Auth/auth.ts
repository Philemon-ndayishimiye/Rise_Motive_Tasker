import { apiSlice } from "../../api/EntryApi";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
  admin: AdminProfile;
}

export interface AdminProfile {
  id: number;
  fullName: string;
  email: string;
  profilePicture?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
}

export interface MessageResponse {
  message: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
    }),

    getProfile: builder.query<AdminProfile, void>({
      query: () => "auth/profile",
      providesTags: ["Auth"],
    }),

    updateProfile: builder.mutation<AdminProfile, UpdateProfileRequest>({
      query: (data) => ({
        url: "auth/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),

    // update profile picture

    updateProfilePicture: builder.mutation<
      { id: number; profilePicture: string },
      FormData
    >({
      query: (formData) => ({
        url: "auth/profile-picture",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),

    changePassword: builder.mutation<MessageResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: "auth/change-password",
        method: "PATCH", // or PUT depending on backend
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useUpdateProfilePictureMutation,
} = authApi;
