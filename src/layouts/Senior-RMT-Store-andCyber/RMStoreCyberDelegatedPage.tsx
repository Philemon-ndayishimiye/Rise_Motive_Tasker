//

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  User,
  Search,
  CheckCheck,
  X,
  Check,
  SendHorizontal,
  ClipboardList,
  Inbox,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Tag,
} from "lucide-react";
import {
  useAssignTaskMutation,
  useAcceptAssignmentMutation,
  useRejectAssignmentMutation,
  useGetIncomingAssignmentsQuery,
  useGetOutgoingAssignmentsQuery,
  useMarkAssignmentCompleteMutation,
} from "../../app/api/Taskspot/deligated";
import { useGetAllNewServiceRequestsQuery } from "../../app/api/Taskspot/newservice";
import { useGetProfileQuery } from "../../app/api/Auth/auth";
import type { NewServiceRequest } from "../../app/api/Taskspot/newservice";
import type { TaskAssignment } from "../../app/api/Taskspot/deligated";
import type { Tasker } from "../../app/api/Auth/Tasker";

// ── helpers ───────────────────────────────────────────────

function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: "#FEF9C3", color: "#92400E" },
  IN_PROGRESS: { bg: "#DBEAFE", color: "#1E3A8A" },
  COMPLETED: { bg: "#DCFCE7", color: "#14532D" },
  CANCELLED: { bg: "#FEE2E2", color: "#7F1D1D" },
  ACCEPTED: { bg: "#DCFCE7", color: "#14532D" },
  REJECTED: { bg: "#FEE2E2", color: "#7F1D1D" },
};

const StatusBadge = ({ status }: { status?: string }) => {
  const s = status ?? "PENDING";
  const style = STATUS_STYLE[s] ?? STATUS_STYLE["PENDING"];
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: style.bg, color: style.color }}
    >
      {s.replace("_", " ")}
    </span>
  );
};

// ── Delegate Modal ────────────────────────────────────────

interface DelegateModalProps {
  task: NewServiceRequest;
  onClose: () => void;
  currentTaskerId: number;
}

function DelegateModal({ task, onClose, currentTaskerId }: DelegateModalProps) {
  // Fetch all taskers to pick from
  const [taskers, setTaskers] = useState<Tasker[]>([]);
  const [selectedTaskerId, setSelectedTaskerId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [assignTask, { isLoading }] = useAssignTaskMutation();
  const [success, setSuccess] = useState(false);
  const [taskerSearch, setTaskerSearch] = useState("");

  useEffect(() => {
    // Fetch taskers from backend
    const token = localStorage.getItem("token");
    fetch(
      `${import.meta.env.VITE_API_BASE_URL || "https://api.risemotive.rw/"}taskers`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((r) => r.json())
      .then((data) => {
        // filter out self
        const all = Array.isArray(data) ? data : (data.items ?? []);
        setTaskers(all.filter((t: Tasker) => t.id !== currentTaskerId));
      })
      .catch(() => {});
  }, [currentTaskerId]);

  const handleSend = async () => {
    if (!selectedTaskerId) return;
    try {
      await assignTask({
        serviceRequestId: Number(task.id),
        assignedById: currentTaskerId,
        assignedToId: selectedTaskerId,
        amount: "To be confirmed", // Admin sets the real amount
        note: note || undefined,
      }).unwrap();
      setSuccess(true);
    } catch (err) {
      alert(err || "Failed to assign task");
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden border border-blue-100 shadow-2xl">
        {/* header */}
        <div className="px-5 py-4 flex items-center justify-between bg-blue-50 border-b border-blue-100">
          <span className="font-bold text-[15px] text-blue-900 font-family-playfair">
            Delegate Task
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-blue-100 bg-white flex items-center justify-center"
          >
            <X size={13} className="text-gray-500" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-green-600" />
            </div>
            <h3 className="font-bold text-blue-900 text-[15px] font-family-playfair mb-1">
              Task Delegated!
            </h3>
            <p className="text-gray-500 text-[13px] font-family-playfair mb-5">
              The tasker has been notified and will accept or decline shortly.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-[10px] bg-blue-900 text-white text-[13px] font-bold font-family-playfair"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* task summary */}
            <div className="bg-blue-50 rounded-xl px-4 py-3">
              <p className="text-[11px] text-gray-400 font-family-playfair mb-0.5">
                Task
              </p>
              <p className="text-[13px] font-bold text-blue-900 font-family-playfair">
                {task.service || task.description.slice(0, 60)}
              </p>
              <p className="text-[11px] text-gray-500 font-family-playfair">
                {task.trackingCode} · {task.customerName}
              </p>
            </div>

            {/* pick tasker */}
            <div>
              <label className="text-[13px] font-bold text-gray-700 font-family-playfair">
                Assign To
              </label>
              <div className="relative mt-1.5 mb-2">
                <Search
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={taskerSearch}
                  onChange={(e) => setTaskerSearch(e.target.value)}
                  placeholder="Search tasker by name or sector..."
                  className="w-full pl-8 pr-3 py-2 rounded-[10px] border border-blue-100 text-[12px] text-gray-700 outline-none font-family-playfair focus:border-blue-300"
                />
                {taskerSearch && (
                  <button
                    onClick={() => setTaskerSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  >
                    <X size={11} className="text-gray-400" />
                  </button>
                )}
              </div>

              <div className="mt-1.5 space-y-2 max-h-15 overflow-y-auto">
                {taskers.length === 0 && (
                  <p className="text-[12px] text-gray-400 font-family-playfair py-2">
                    Loading taskers...
                  </p>
                )}
                {taskers
                  .filter(
                    (t) =>
                      !taskerSearch ||
                      t.name
                        ?.toLowerCase()
                        .includes(taskerSearch.toLowerCase()) ||
                      t.sector
                        ?.toLowerCase()
                        .includes(taskerSearch.toLowerCase()) ||
                      t.title
                        ?.toLowerCase()
                        .includes(taskerSearch.toLowerCase()),
                  )
                  .map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTaskerId(t.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors text-left ${
                        selectedTaskerId === t.id
                          ? "border-blue-900 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center shrink-0">
                        {t.image ? (
                          <img
                            src={t.image}
                            alt={t.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-white text-[11px] font-bold">
                            {t.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800 font-family-playfair">
                          {t.name}
                        </p>
                        <p className="text-[11px] text-gray-400 font-family-playfair truncate">
                          {t.title} · {t.sector}
                        </p>
                      </div>
                      {selectedTaskerId === t.id && (
                        <Check size={14} className="text-blue-900 shrink-0" />
                      )}
                    </button>
                  ))}
              </div>
            </div>

            {/* note */}
            <div>
              <label className="text-[13px] font-bold text-gray-700 font-family-playfair">
                Note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any instruction for the tasker..."
                rows={2}
                className="w-full mt-1.5 px-3 py-2 rounded-[10px] border border-blue-200 text-[13px] text-gray-700 outline-none font-family-playfair resize-none"
              />
            </div>

            {/* split info */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-blue-50 rounded-xl px-3 py-2 text-center">
                <p className="text-[10px] text-gray-400 font-family-playfair">
                  Your share
                </p>
                <p className="text-[15px] font-bold text-blue-900 font-family-playfair">
                  15%
                </p>
              </div>
              <div className="flex-1 bg-green-50 rounded-xl px-3 py-2 text-center">
                <p className="text-[10px] text-gray-400 font-family-playfair">
                  Tasker's share
                </p>
                <p className="text-[15px] font-bold text-green-700 font-family-playfair">
                  85%
                </p>
              </div>
            </div>

            {/* actions */}
            <div className="flex gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-[10px] border border-gray-200 text-[13px] font-bold text-gray-500 font-family-playfair"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isLoading || !selectedTaskerId}
                className="flex-1 py-2.5 rounded-[10px] bg-blue-900 text-[13px] font-bold text-white font-family-playfair disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <SendHorizontal size={13} />
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── My Task Card ──────────────────────────────────────────

function MyTaskCard({
  task,
  currentTaskerId,
}: {
  task: NewServiceRequest;
  currentTaskerId: number;
}) {
  const [delegateOpen, setDelegateOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow">
        {/* top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-blue-900 font-family-playfair leading-snug truncate">
              {task.service || "—"}
            </p>
            <p className="text-[11px] text-gray-400 font-family-playfair mt-0.5">
              {task.trackingCode}
            </p>
          </div>
          <StatusBadge status={task.status} />
        </div>

        {/* divider */}
        <div className="border-t border-gray-50" />

        {/* info grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5">
            <User size={11} className="text-gray-400 shrink-0" />
            <span className="text-[11px] text-gray-600 font-family-playfair truncate">
              {task.customerName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone size={11} className="text-gray-400 shrink-0" />
            <span className="text-[11px] text-gray-600 font-family-playfair truncate">
              {task.customerPhone}
            </span>
          </div>
          {task.customerEmail && (
            <div className="flex items-center gap-1.5 col-span-2">
              <Mail size={11} className="text-gray-400 shrink-0" />
              <span className="text-[11px] text-gray-600 font-family-playfair truncate">
                {task.customerEmail}
              </span>
            </div>
          )}
          {task.province && (
            <div className="flex items-center gap-1.5 col-span-2">
              <MapPin size={11} className="text-gray-400 shrink-0" />
              <span className="text-[11px] text-gray-600 font-family-playfair truncate">
                {[task.cell, task.sector, task.district, task.province]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
          {task.preferredDate && (
            <div className="flex items-center gap-1.5">
              <Calendar size={11} className="text-gray-400 shrink-0" />
              <span className="text-[11px] text-gray-600 font-family-playfair">
                {task.preferredDate}
              </span>
            </div>
          )}
          {task.identificationNumber && (
            <div className="flex items-center gap-1.5">
              <Tag size={11} className="text-gray-400 shrink-0" />
              <span className="text-[11px] text-gray-600 font-family-playfair truncate">
                ID: {task.identificationNumber}
              </span>
            </div>
          )}
        </div>

        {/* description */}
        <div className="bg-gray-50 rounded-xl px-3 py-2">
          <p className="text-[11px] text-gray-500 font-family-playfair leading-snug line-clamp-2">
            {task.description}
          </p>
        </div>

        {/* delegate btn */}
        {/* delegate btn — only show when task is not completed */}
        {task.status !== "COMPLETED" && (
          <button
            onClick={() => setDelegateOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] bg-blue-900 hover:bg-blue-800 text-white text-[13px] font-bold font-family-playfair transition-colors"
          >
            <SendHorizontal size={13} />
            Delegate Task
          </button>
        )}
      </div>

      {delegateOpen && (
        <DelegateModal
          task={task}
          onClose={() => setDelegateOpen(false)}
          currentTaskerId={currentTaskerId}
        />
      )}
    </>
  );
}

// ── Incoming Assignment Card (Tasker B view) ──────────────

function IncomingCard({ assignment }: { assignment: TaskAssignment }) {
  const [accept, { isLoading: accepting }] = useAcceptAssignmentMutation();
  const [reject, { isLoading: rejecting }] = useRejectAssignmentMutation();
  const [complete, { isLoading: completing }] =
    useMarkAssignmentCompleteMutation();

  const handleAccept = async () => {
    try {
      await accept(assignment.id).unwrap();
    } catch (err) {
      console.log(err || "Failed to accept");
    }
  };

  const handleReject = async () => {
    try {
      await reject(assignment.id).unwrap();
    } catch (err) {
      console.log(err || "Failed to reject");
    }
  };

  const handleComplete = async () => {
    try {
      await complete(assignment.id).unwrap();
    } catch (err) {
      console.log(err || "Failed to complete");
    }
  };

  const isPending = assignment.status === "PENDING";
  const isAccepted = assignment.status === "ACCEPTED";
  const task = assignment.serviceRequest;

  // calculate tasker B's actual money
  const rawAmount = parseFloat(assignment.amount.replace(/[^0-9.]/g, ""));
  const myMoney = isNaN(rawAmount)
    ? null
    : ((rawAmount * assignment.splitPercentB) / 100).toLocaleString();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow">
      {/* ── Sent by ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center shrink-0">
            {assignment.assignedBy?.image ? (
              <img
                src={assignment.assignedBy.image}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-[12px] font-bold">
                {assignment.assignedBy?.name?.charAt(0).toUpperCase() ?? "T"}
              </span>
            )}
          </div>
          <div>
            <p className="text-[12px] font-bold text-blue-900 font-family-playfair">
              From: {assignment.assignedBy?.name ?? "—"}
            </p>
            <p className="text-[11px] text-gray-400 font-family-playfair">
              {assignment.assignedBy?.phone}
            </p>
          </div>
        </div>
        <StatusBadge status={assignment.status} />
      </div>

      <div className="border-t border-gray-50" />

      {/* ── Task details ── */}
      {task ? (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide font-family-playfair">
            Task Details
          </p>

          {/* service name + tracking */}
          <div>
            <p className="text-[13px] font-bold text-blue-900 font-family-playfair leading-snug">
              {task.service || "—"}
            </p>
            {task.trackingCode && (
              <p className="text-[10px] text-gray-400 font-family-playfair">
                {task.trackingCode}
              </p>
            )}
          </div>

          {/* info grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <User size={11} className="text-gray-400 shrink-0" />
              <span className="text-[11px] text-gray-600 font-family-playfair truncate">
                {task.customerName}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone size={11} className="text-gray-400 shrink-0" />
              <span className="text-[11px] text-gray-600 font-family-playfair truncate">
                {task.customerPhone}
              </span>
            </div>
            {task.customerEmail && (
              <div className="flex items-center gap-1.5 col-span-2">
                <Mail size={11} className="text-gray-400 shrink-0" />
                <span className="text-[11px] text-gray-600 font-family-playfair truncate">
                  {task.customerEmail}
                </span>
              </div>
            )}
            {task.province && (
              <div className="flex items-center gap-1.5 col-span-2">
                <MapPin size={11} className="text-gray-400 shrink-0" />
                <span className="text-[11px] text-gray-600 font-family-playfair truncate">
                  {[task.cell, task.sector, task.district, task.province]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
            {task.preferredDate && (
              <div className="flex items-center gap-1.5">
                <Calendar size={11} className="text-gray-400 shrink-0" />
                <span className="text-[11px] text-gray-600 font-family-playfair">
                  {task.preferredDate}
                </span>
              </div>
            )}
            {task.identificationNumber && (
              <div className="flex items-center gap-1.5">
                <Tag size={11} className="text-gray-400 shrink-0" />
                <span className="text-[11px] text-gray-600 font-family-playfair truncate">
                  ID: {task.identificationNumber}
                </span>
              </div>
            )}
          </div>

          {/* description */}
          {task.description && (
            <div className="bg-gray-50 rounded-xl px-3 py-2">
              <p className="text-[11px] text-gray-500 font-family-playfair leading-snug line-clamp-2">
                {task.description}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[11px] text-gray-400 font-family-playfair italic">
          Task details not available
        </p>
      )}

      <div className="border-t border-gray-50" />

      {/* ── Split + your actual money ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-green-50 rounded-xl px-3 py-2 text-center">
          <p className="text-[10px] text-gray-400 font-family-playfair">
            Your share
          </p>
          <p className="text-[15px] font-bold text-green-700 font-family-playfair">
            {assignment.splitPercentB}%
          </p>
          {myMoney && (
            <p className="text-[10px] font-bold text-green-600 font-family-playfair mt-0.5">
              ≈ {myMoney} RWF
            </p>
          )}
        </div>
        <div className="flex-1 bg-blue-50 rounded-xl px-3 py-2 text-center">
          <p className="text-[10px] text-gray-400 font-family-playfair">
            Total
          </p>
          <p className="text-[13px] font-bold text-blue-900 font-family-playfair">
            {assignment.amount}
          </p>
        </div>
        <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-center">
          <p className="text-[10px] text-gray-400 font-family-playfair">
            Their share
          </p>
          <p className="text-[15px] font-bold text-gray-500 font-family-playfair">
            {assignment.splitPercentA}%
          </p>
        </div>
      </div>

      {/* ── Note ── */}
      {assignment.note && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
          <p className="text-[11px] text-amber-700 font-family-playfair leading-snug">
            {assignment.note}
          </p>
        </div>
      )}

      <p className="text-[11px] text-gray-400 font-family-playfair">
        {timeAgo(assignment.createdAt)}
      </p>

      {/* ── Accept / Reject — only when PENDING ── */}
      {isPending && (
        <div className="flex gap-2.5">
          <button
            onClick={handleReject}
            disabled={rejecting}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-[10px] border border-red-200 text-red-500 text-[13px] font-bold font-family-playfair hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            <X size={13} />
            {rejecting ? "..." : "Decline"}
          </button>
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-[10px] bg-blue-900 text-white text-[13px] font-bold font-family-playfair hover:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            <Check size={13} />
            {accepting ? "..." : "Accept"}
          </button>
        </div>
      )}

      {/* ── Mark Complete — only when ACCEPTED ── */}
      {isAccepted && (
        <button
          onClick={handleComplete}
          disabled={completing}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] bg-green-600 hover:bg-green-700 text-white text-[13px] font-bold font-family-playfair disabled:opacity-50 transition-colors"
        >
          <CheckCheck size={13} />
          {completing ? "Completing..." : "Mark Complete"}
        </button>
      )}
    </div>
  );
}

// ── Outgoing Assignment Card (Tasker A view) ──────────────

function OutgoingCard({ assignment }: { assignment: TaskAssignment }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center shrink-0">
            {assignment.assignedTo?.image ? (
              <img
                src={assignment.assignedTo.image}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-[12px] font-bold">
                {assignment.assignedTo?.name?.charAt(0).toUpperCase() ?? "T"}
              </span>
            )}
          </div>
          <div>
            <p className="text-[12px] font-bold text-blue-900 font-family-playfair">
              To: {assignment.assignedTo?.name ?? "—"}
            </p>
            <p className="text-[11px] text-gray-400 font-family-playfair">
              {assignment.assignedTo?.phone}
            </p>
          </div>
        </div>
        <StatusBadge status={assignment.status} />
      </div>

      <div className="border-t border-gray-50" />

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-blue-50 rounded-xl px-3 py-2 text-center">
          <p className="text-[10px] text-gray-400 font-family-playfair">
            Amount
          </p>
          <p className="text-[13px] font-bold text-blue-900 font-family-playfair">
            {assignment.amount}
          </p>
        </div>
        <div className="flex-1 bg-green-50 rounded-xl px-3 py-2 text-center">
          <p className="text-[10px] text-gray-400 font-family-playfair">
            Your commission
          </p>
          <p className="text-[15px] font-bold text-green-700 font-family-playfair">
            {assignment.splitPercentA}%
          </p>
        </div>
      </div>

      {assignment.note && (
        <div className="bg-gray-50 rounded-xl px-3 py-2">
          <p className="text-[11px] text-gray-500 font-family-playfair">
            📝 {assignment.note}
          </p>
        </div>
      )}

      <p className="text-[11px] text-gray-400 font-family-playfair">
        {timeAgo(assignment.createdAt)}
      </p>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────

type Tab = "my-tasks" | "incoming" | "outgoing";

export default function RMStoreCyberDelegatedPage() {
  const [tab, setTab] = useState<Tab>("my-tasks");
  const [search, setSearch] = useState("");

  // Get current tasker id from profile/auth store
  // Adjust this based on how your auth slice exposes the tasker id
  const { data: profile } = useGetProfileQuery();
  const currentTaskerId = profile?.id ?? 0;

  // My tasks — filter by tasker name from auth
  const { data: myTasksData, isLoading: myTasksLoading } =
    useGetAllNewServiceRequestsQuery(undefined, { skip: tab !== "my-tasks" });

  // Incoming tasks assigned TO me
  const { data: incoming, isLoading: incomingLoading } =
    useGetIncomingAssignmentsQuery(currentTaskerId, {
      skip: tab !== "incoming" || !currentTaskerId,
    });

  // Outgoing tasks I assigned out
  const { data: outgoing, isLoading: outgoingLoading } =
    useGetOutgoingAssignmentsQuery(currentTaskerId, {
      skip: !currentTaskerId,
    });

  // Filter my tasks by tasker name
  // IDs of tasks already pending delegation by ME to someone else
  const pendingOutgoingIds = new Set(
    (outgoing ?? [])
      .filter((a) => a.status === "PENDING")
      .map((a) => String(a.serviceRequestId)),
  );

  const myTasks = (myTasksData?.items ?? []).filter((t) => {
    const nameMatch =
      t.tasker?.toLowerCase() === profile?.fullName?.toLowerCase() ||
      t.tasker
        ?.toLowerCase()
        .includes((profile?.fullName ?? "").toLowerCase().split(" ")[0]);

    // hide tasks I've already delegated and are waiting for a response
    const notAlreadyDelegated = !pendingOutgoingIds.has(String(t.id));

    return nameMatch && notAlreadyDelegated;
  });
  // Apply search filter
  const filteredMyTasks = myTasks.filter(
    (t) =>
      !search ||
      t.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      t.service?.toLowerCase().includes(search.toLowerCase()) ||
      t.trackingCode?.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredIncoming = (incoming ?? []).filter(
    (a) =>
      !search ||
      a.assignedBy?.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(a.serviceRequestId).includes(search),
  );

  const filteredOutgoing = (outgoing ?? []).filter(
    (a) =>
      !search ||
      a.assignedTo?.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(a.serviceRequestId).includes(search),
  );

  const TABS: { key: Tab; label: string; icon: LucideIcon; count?: number }[] =
    [
      {
        key: "my-tasks",
        label: "My Tasks",
        icon: ClipboardList,
        count: myTasks.length,
      },
      {
        key: "incoming",
        label: "Assigned to Me",
        icon: Inbox,
        count: incoming?.filter((a) => a.status === "PENDING").length,
      },
      {
        key: "outgoing",
        label: "My Outgoing",
        icon: ExternalLink,
        count: outgoing?.length,
      },
    ];

  const isLoading =
    (tab === "my-tasks" && myTasksLoading) ||
    (tab === "incoming" && incomingLoading) ||
    (tab === "outgoing" && outgoingLoading);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-5 pb-10 max-w-5xl mx-auto">
        {/* ── Tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => {
                setTab(key);
                setSearch("");
              }}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-[13px] font-bold transition-colors font-family-playfair ${
                tab === key
                  ? "bg-blue-900 text-white"
                  : "bg-white text-blue-900 border border-blue-100 hover:bg-blue-50"
              }`}
            >
              <Icon size={14} />
              {label}
              {count !== undefined && count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    tab === key
                      ? "bg-white text-blue-900"
                      : "bg-blue-900 text-white"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="relative mb-5">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              tab === "my-tasks"
                ? "Search by customer name, service or tracking code..."
                : "Search by tasker name or task ID..."
            }
            className="w-full pl-9 pr-4 py-2.5 rounded-[10px] border border-gray-200 bg-white text-[13px] text-gray-700 outline-none font-family-playfair focus:border-blue-300"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={13} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* ── Content ── */}
        {isLoading && (
          <div className="text-center py-16 text-gray-400 text-sm font-family-playfair">
            Loading...
          </div>
        )}

        {!isLoading && (
          <>
            {/* My Tasks Tab */}
            {tab === "my-tasks" && (
              <>
                {filteredMyTasks.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 text-sm font-family-playfair">
                    {search
                      ? "No tasks match your search"
                      : "No tasks assigned to you yet"}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMyTasks.map((task) => (
                      <MyTaskCard
                        key={task.id}
                        task={task}
                        currentTaskerId={currentTaskerId}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Incoming Tab */}
            {tab === "incoming" && (
              <>
                {filteredIncoming.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 text-sm font-family-playfair">
                    {search
                      ? "No assignments match your search"
                      : "No tasks assigned to you yet"}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIncoming.map((a) => (
                      <IncomingCard key={a.id} assignment={a} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Outgoing Tab */}
            {tab === "outgoing" && (
              <>
                {filteredOutgoing.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 text-sm font-family-playfair">
                    {search
                      ? "No assignments match your search"
                      : "You haven't delegated any tasks yet"}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOutgoing.map((a) => (
                      <OutgoingCard key={a.id} assignment={a} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
