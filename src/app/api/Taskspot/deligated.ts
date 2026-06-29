import { apiSlice } from "../../api/EntryApi";

/* ───────────────────────────────
   TYPES
────────────────────────────── */

export type AssignmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export interface TaskerSummary {
  id: number | string;
  name: string;
  phone: string;
  image?: string;
}

export interface TaskAssignment {
  id: number | string;
  serviceRequestId: number | string;
  assignedById: number | string;
  assignedToId: number | string;
  status: AssignmentStatus;
  amount: string;
  splitPercentA: number; // always 15
  splitPercentB: number; // always 85
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  assignedBy?: TaskerSummary; // present on incoming list
  assignedTo?: TaskerSummary; // present on outgoing list
  serviceRequest?: {
    // service request
    id: number | string;
    service?: string;
    description: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    trackingCode?: string;
    province?: string;
    district?: string;
    sector?: string;
    cell?: string;
    preferredDate?: string;
    identificationNumber?: string;
    status?: string;
  };
}

export interface TaskerNotification {
  id: number | string;
  taskerId: number | string;
  assignmentId?: number | string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

export interface NotificationsResponse {
  items: TaskerNotification[];
  unreadCount: number;
}

export interface CreateTaskAssignmentRequest {
  serviceRequestId: number;
  assignedById: number;
  assignedToId: number;
  amount: string;
  note?: string;
}

export interface MessageResponse {
  message: string;
}

/* ───────────────────────────────
   API SLICE
────────────────────────────── */

export const delegatedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ── ASSIGN: Tasker A passes a task to Tasker B ── */
    assignTask: builder.mutation<TaskAssignment, CreateTaskAssignmentRequest>({
      query: (body) => ({
        url: "task-assignments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TaskAssignment", "TaskerNotification"],
    }),

    /* ── ACCEPT: Tasker B accepts (JWT handles taskerBId) ── */
    acceptAssignment: builder.mutation<TaskAssignment, number | string>({
      query: (assignmentId) => ({
        url: `task-assignments/${assignmentId}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, assignmentId) => [
        { type: "TaskAssignment", id: assignmentId },
        "TaskAssignment",
        "TaskerNotification",
      ],
    }),

    /* ── REJECT: Tasker B rejects (JWT handles taskerBId) ── */
    rejectAssignment: builder.mutation<TaskAssignment, number | string>({
      query: (assignmentId) => ({
        url: `task-assignments/${assignmentId}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, assignmentId) => [
        { type: "TaskAssignment", id: assignmentId },
        "TaskAssignment",
        "TaskerNotification",
      ],
    }),

    /* ── COMPLETE: Tasker B marks assignment done (JWT handles taskerBId) ── */
    markAssignmentComplete: builder.mutation<TaskAssignment, number | string>({
      query: (assignmentId) => ({
        url: `task-assignments/${assignmentId}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, assignmentId) => [
        { type: "TaskAssignment", id: assignmentId },
        "TaskAssignment",
        "TaskerNotification",
      ],
    }),

    /* ── INCOMING: Tasks assigned TO this tasker (Tasker B view) ── */
    getIncomingAssignments: builder.query<TaskAssignment[], number | string>({
      query: (taskerBId) => `task-assignments/incoming/${taskerBId}`,
      providesTags: ["TaskAssignment"],
    }),

    /* ── OUTGOING: Tasks assigned BY this tasker (Tasker A view) ── */
    getOutgoingAssignments: builder.query<TaskAssignment[], number | string>({
      query: (taskerAId) => `task-assignments/outgoing/${taskerAId}`,
      providesTags: ["TaskAssignment"],
    }),

    /* ── NOTIFICATIONS: Get my notifications (JWT handles taskerId) ── */
    getMyNotifications: builder.query<NotificationsResponse, void>({
      query: () => "task-assignments/my-notifications",
      providesTags: ["TaskerNotification"],
    }),

    /* ── MARK ONE NOTIFICATION READ ── */
    markNotificationRead: builder.mutation<
      TaskerNotification,
      { notificationId: number | string; taskerId: number | string }
    >({
      query: ({ notificationId, taskerId }) => ({
        url: `task-assignments/notifications/${notificationId}/read`,
        method: "PATCH",
        body: { taskerId },
      }),
      invalidatesTags: ["TaskerNotification"],
    }),

    /* ── MARK ALL NOTIFICATIONS READ ── */
    markAllNotificationsRead: builder.mutation<
      MessageResponse,
      number | string
    >({
      query: (taskerId) => ({
        url: `task-assignments/notifications/${taskerId}/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["TaskerNotification"],
    }),
  }),
});

/* ───────────────────────────────
   EXPORT HOOKS
────────────────────────────── */

export const {
  useAssignTaskMutation,
  useAcceptAssignmentMutation,
  useRejectAssignmentMutation,
  useGetIncomingAssignmentsQuery,
  useGetOutgoingAssignmentsQuery,
  useMarkAssignmentCompleteMutation,
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = delegatedApi;
