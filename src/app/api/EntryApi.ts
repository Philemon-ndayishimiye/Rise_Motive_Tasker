import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers) => {
    // If you have authentication tokens, you can set them here
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    "User",
    "Gallery",
    "ServiceRequest",
    "Product",
    "Order",
    "Auth",
    "Tasker",
    "Report",
    "Admin",
    "InfoPost",
    "EGovernmentService",
    "WebService",
    "AppDocService",
    "LegalService",
    "CreativeMediaService",
    "Course",
  ],
  endpoints: () => ({}),
});
