import { useEffect } from "react";
import {
  FaFire,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaProjectDiagram,
  FaTimes,
  FaEdit,
  FaTrash,
  FaUserPlus,
} from "react-icons/fa";

const TaskDetailModal = ({ task, onClose, openModal }) => {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!task) return null;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const priorityStyles = {
    high: "bg-red-50 text-red-600 ring-red-200",
    medium: "bg-amber-50 text-amber-700 ring-amber-200",
    low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  const statusStyles = {
    "To Do": { color: "text-slate-500", bg: "bg-slate-50 ring-slate-200" },
    "In Progress": { color: "text-blue-600", bg: "bg-blue-50 ring-blue-200" },
    Done: { color: "text-emerald-600", bg: "bg-emerald-50 ring-emerald-200" },
  };
  const s = statusStyles[task.status] ?? statusStyles["To Do"];

  const infoRows = [
    {
      icon: <FaUser className="text-[11px]" />,
      label: "Assigned To",
      value: task.assignedTo?.name || task.assignedTo || "Unassigned",
    },
    {
      icon: <FaUser className="text-[11px]" />,
      label: "Created By",
      value: task.createdBy?.name || task.createdBy || "—",
    },
    {
      icon: <FaProjectDiagram className="text-[11px]" />,
      label: "Project",
      value: task.Project?.name || task.Project || "—",
    },
    {
      icon: <FaClock className="text-[11px]" />,
      label: "Created",
      value: `${formatDate(task.createdAt)} · ${formatTime(task.createdAt)}`,
    },
    {
      icon: <FaClock className="text-[11px]" />,
      label: "Updated",
      value: `${formatDate(task.updatedAt)} · ${formatTime(task.updatedAt)}`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fadeIn" />

      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
      >
        {/* Top gradient accent */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />

        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 pb-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
              {task.name}
            </h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ring-1 ${
                  priorityStyles[task.priority] ??
                  "bg-slate-50 text-slate-500 ring-slate-200"
                }`}
              >
                <FaFire className="inline mr-1 -mt-0.5 text-[9px]" />
                {task.priority}
              </span>
              <span
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ring-1 ${s.bg} ${s.color}`}
              >
                {task.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -m-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 pt-4 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          {task.description && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Description
              </p>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3.5 ring-1 ring-slate-100">
                {task.description}
              </p>
            </div>
          )}

          {/* Deadline */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Deadline
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
              <FaCalendarAlt className="text-indigo-400 text-xs" />
              {formatDate(task.deadline)}
            </div>
          </div>

          {/* Info grid */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {infoRows.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5 ring-1 ring-slate-100"
                >
                  <span className="text-indigo-400 shrink-0">{row.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium truncate">
                      {row.label}
                    </p>
                    <p className="text-xs text-slate-700 font-semibold truncate">
                      {row.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 p-5 sm:p-6 pt-0">
          <button
            onClick={() => openModal("update", task)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-3 py-2.5 rounded-xl hover:bg-amber-100 active:scale-[0.97] transition-all"
          >
            <FaEdit className="text-[10px]" /> Update
          </button>
          <button
            onClick={() => openModal("delete", task)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-rose-50 text-rose-600 ring-1 ring-rose-200 px-3 py-2.5 rounded-xl hover:bg-rose-100 active:scale-[0.97] transition-all"
          >
            <FaTrash className="text-[10px]" /> Delete
          </button>
          <button
            onClick={() => openModal("assign", task)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-2.5 rounded-xl hover:bg-emerald-100 active:scale-[0.97] transition-all"
          >
            <FaUserPlus className="text-[10px]" /> Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
