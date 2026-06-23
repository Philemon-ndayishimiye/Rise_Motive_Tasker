import { apiSlice } from "../../api/EntryApi";

export type ServiceCategory =
  | "IREMBO_CIVIL_STATUS"
  | "RDB_BUSINESS_REGISTRATION"
  | "WEB_DEVELOPMENT_HOSTING"
  | "GRAPHIC_DESIGN_BRANDING"
  | "SOFTWARE_DIGITAL_SOLUTIONS"
  | "MEDIA_PRODUCTION_MARKETING"
  | "RDB_LICENSING_INVESTMENT"
  | "RRA_TAX_REGISTRATION_DEREGISTRATION"
  | "RRA_TAX_DECLARATION"
  | "RRA_CERTIFICATES_COMPLIANCE"
  | "IREMBO_NIDA_IMMIGRATION"
  | "WRITING_DOCUMENTATION"
  | "PRINTING_PUBLISHING"
  | "GOVERNMENT_CERTIFICATES_PERMITS"
  | "NLA_LAND_PROPERTY"
  | "RURA_TRANSPORT_LICENSING"
  | "IECMS_LEGAL_COURT"
  | "OPPORTUNITIES_APPLICATION_SUPPORT"
  | "INSURANCE_SUPPORT"
  | "OTHER_SERVICES";

export interface NewServiceRequest {
  id: number | string;
  category: ServiceCategory;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: string;
  description: string;
  documentUrl: string;
  preferredDate: string;
  tasker: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  identificationNumber: string;
  status?: string;
  trackingCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewServiceRequestsResponse {
  items: NewServiceRequest[];
  total: number;
}

export interface CreateNewServiceRequestRequest {
  category: ServiceCategory;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  identificationNumber: string;
  description: string;
  documentUrl: string;
  preferredDate: string;
  tasker: string;
}

export interface UpdateNewServiceStatusRequest {
  id: number | string;
  status: string;
}

export interface MessageResponse {
  message: string;
}

export const newServiceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL — optional category filter for admin dashboard
    getAllNewServiceRequests: builder.query<
      NewServiceRequestsResponse,
      { category?: ServiceCategory } | void
    >({
      query: (params) => {
        const category = params?.category;
        return category ? `new-service?category=${category}` : "new-service";
      },
      providesTags: ["NewServiceRequest"],
    }),

    // GET BY ID
    getNewServiceRequestById: builder.query<NewServiceRequest, number | string>(
      {
        query: (id) => `new-service/${id}`,
        providesTags: (_result, _error, id) => [
          { type: "NewServiceRequest", id },
        ],
      },
    ),

    // CREATE — multipart, includes file
    createNewServiceRequest: builder.mutation<NewServiceRequest, FormData>({
      query: (data) => ({
        url: "new-service",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NewServiceRequest"],
    }),

    // UPDATE STATUS ONLY
    updateNewServiceStatus: builder.mutation<
      NewServiceRequest,
      UpdateNewServiceStatusRequest
    >({
      query: ({ id, status }) => ({
        url: `new-service/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "NewServiceRequest", id },
        "NewServiceRequest",
      ],
    }),

    // DELETE
    deleteNewServiceRequest: builder.mutation<MessageResponse, number | string>(
      {
        query: (id) => ({
          url: `new-service/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["NewServiceRequest"],
      },
    ),
  }),
});

export const {
  useGetAllNewServiceRequestsQuery,
  useGetNewServiceRequestByIdQuery,
  useCreateNewServiceRequestMutation,
  useUpdateNewServiceStatusMutation,
  useDeleteNewServiceRequestMutation,
} = newServiceApi;
