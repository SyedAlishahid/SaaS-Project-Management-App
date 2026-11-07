import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import TaskDetailModal from "./TaskDetailModal.jsx";

import {
  FaCalendarAlt,
  FaFire,
  FaCheckCircle,
  FaClock,
  FaTasks,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaTimes,
} from "react-icons/fa";
import api from "../api/axios.js";
import { useParams } from "react-router-dom";

const priorityStyles = {
  Low: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-600 ring-amber-200",
  High: "bg-rose-50 text-rose-600 ring-rose-200",
};

const statusStyles = {
  "To Do": { icon: <FaTasks />, color: "text-slate-400" },
  "In Progress": { icon: <FaClock />, color: "text-blue-500" },
  Done: { icon: <FaCheckCircle />, color: "text-emerald-500" },
};

const modalConfig = {
  create: {
    title: "Create Task",
    icon: <FaPlus />,
    accent: "from-indigo-500 to-purple-500",
  },
  update: {
    title: "Update Task",
    icon: <FaEdit />,
    accent: "from-amber-500 to-orange-500",
  },
  delete: {
    title: "Delete Task",
    icon: <FaTrash />,
    accent: "from-rose-500 to-red-500",
  },
  assign: {
    title: "Assign Task",
    icon: <FaUserPlus />,
    accent: "from-emerald-500 to-teal-500",
  },
};

/* ---------- small reusable pieces ---------- */

const inputCls =
  "w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:bg-white transition-all";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const Modal = ({ type, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[scaleIn_0.2s_ease-out]"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`bg-gradient-to-r ${modalConfig[type].accent} px-5 py-4 flex items-center justify-between`}
      >
        <span className="flex items-center gap-2 text-white font-semibold text-sm">
          {modalConfig[type].icon} {modalConfig[type].title}
        </span>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          <FaTimes />
        </button>
      </div>
      <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
);

const SubmitBtn = ({ onClick, color, children }) => (
  <button
    onClick={onClick}
    className={`w-full text-sm font-bold text-white bg-gradient-to-r ${color} py-3 rounded-xl active:scale-[0.98] transition-all shadow-lg`}
  >
    {children}
  </button>
);

/* ---------- main component ---------- */

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const { projectId } = useParams();

  const [error, setError] = useState(null);
  const [selectTask, setSelectTask] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [Project, setProject] = useState("");
  const [deadline, setDate] = useState("");

  const [newname, setNewname] = useState("");
  const [newdescription, setNewdescription] = useState("");
  const [newpriority, setNewpriority] = useState("");
  const [newdeadline, setNewdeadline] = useState("");

  const [taskInfos, setTaskInfo] = useState([]);
  useEffect(() => {
    if (projectId) {
      api
        .get(`/task/projects/${projectId}/tasks`)
        .then((res) => setTasks(res.data.tasks))
        .then(console.log(tasks))
        .catch((err) => console.error(err.response?.data))
        .finally(() => setLoading(false));
    }
  }, [projectId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-400 font-medium tracking-wide">
            Loading tasks…
          </span>
        </div>
      </div>
    );

  const updateTask = (id, field, value) =>
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, [field]: value } : t)),
    );

  const filteredTasks = tasks.filter(
    (t) =>
      (!filterPriority || t.priority === filterPriority) &&
      (!filterStatus || t.status === filterStatus),
  );

  const openModal = (action, task) => {
    setSelectedTask(task ?? null);

    if (action === "create") {
      setName("");
      setDescription("");
      setTaskInfo(selectedTask._id);
      setStatus("");
      setPriority("");
      setAssignedTo("");
      setProject("");
      setDate("");
    }
    if (action === "update") {
      setName(task.name);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setDate(task.deadline?.slice(0, 10) ?? "");
    }
    if (action === "assign") {
      setAssignedTo(task.assignedTo?._id ?? task.assignedTo ?? "");
    }

    setActiveModal(action);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectTask(null);
  };

  /* CREATE (unchanged) */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !assignedTo || !Project) {
      toast.warning(
        "Name, description, assignedTo and project are all required.",
      );
      return;
    }

    const taskData = {
      name,
      description,
      Project,
      assignedTo,
      status,
      priority,
      deadline,
    };

    try {
      const res = await api.post("/task/create", taskData);
      console.log(res);
      if (res.data.success) {
        toast.success("Task created successfully!");

        closeModal();
        setName("");
        setDescription("");
        setAssignedTo("");
        setProject("");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data);
    }
  };

  /* UPDATE */
  const handleUpdate = async () => {
    if (!newname || !newdescription || !newpriority || !newdeadline)
      return toast.warning("Name and description required.");

    const data = { newname, newdescription, newpriority, newdeadline };
    try {
      await api.patch(`/task/update/${selectedTask._id}`, data); // change to your route
      setTasks((prev) =>
        prev.map((t) => (t._id === selectedTask._id ? { ...t, ...data } : t)),
      );
      toast.success("Task updated!");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  /* DELETE */
  const handleDelete = async () => {
    try {
      await api.delete(`/task/delete/${selectedTask._id}`); // change to your route
      setTasks((prev) => prev.filter((t) => t._id !== selectedTask._id));
      toast.success("Task deleted!");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  /* ASSIGN */
  const handleAssign = async () => {
    if (!assignedTo) return toast.warning("Enter who to assign.");
    try {
      const meow = await api.patch(`/task/${selectedTask._id}/assign`, {
        assignedTo,
      }); // change to your route
      setTasks((prev) =>
        prev.map((t) =>
          t._id === selectedTask._id ? { ...t, assignedTo } : t,
        ),
      );
      console.log(meow);
      toast.success("Task assigned!");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Assign failed");
    }
  };

  const taskInfo = async (taskId) => {
    try {
      const res = await api.get(`/task/${taskId}`);

      setSelectTask(res.data.Task);
      console.log(selectTask);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-[80vh] bg-slate-100 p-6 md:p-8 mt-9 rounded-2xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            All Tasks
          </h2>
          <button
            onClick={() => openModal("create")}
            className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
          >
            <FaPlus className="text-[10px]" /> Create Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-600 cursor-pointer hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-colors sm:w-44"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-600 cursor-pointer hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-colors sm:w-44"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Todo">Todo</option>
            <option value="Completed">Done</option>
          </select>
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => {
          const s = statusStyles[task.status] ?? statusStyles["To Do"];
          return (
            <div
              key={task._id}
              onClick={() => taskInfo(task._id)}
              className="group relative bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-[0_12px_30px_-6px_rgba(99,102,241,0.15)] hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Title + Priority */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-base text-slate-800 leading-tight tracking-tight">
                  {task.name}
                </h3>
                <span
                  className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ring-1 ${priorityStyles[task.priority] ?? "bg-slate-50 text-slate-500 ring-slate-200"}`}
                >
                  <FaFire className="inline mr-1 -mt-0.5 text-[9px]" />{" "}
                  {task.priority}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-light">
                {task.description}
              </p>

              {/* Deadline */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                <FaCalendarAlt className="text-[11px]" /> {task.deadline}
              </div>

              {/* Status row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span
                  className={`flex items-center gap-1.5 text-xs font-semibold ${s.color}`}
                >
                  {s.icon} {task.status}
                </span>
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateTask(task._id, "status", e.target.value)
                  }
                  className="text-[11px] font-medium bg-transparent border-0 px-1 py-0.5 text-slate-500 cursor-pointer hover:text-indigo-600 focus:outline-none focus:ring-0 appearance-none"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              {/* Per-card actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => openModal("update", task)}
                  className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-2 py-1.5 rounded-lg hover:bg-amber-100 active:scale-95 transition-all"
                >
                  <FaEdit className="text-[9px]" /> Update
                </button>

                <button
                  onClick={() => openModal("delete", task)}
                  className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold bg-rose-50 text-rose-600 ring-1 ring-rose-200 px-2 py-1.5 rounded-lg hover:bg-rose-100 active:scale-95 transition-all"
                >
                  <FaTrash className="text-[9px]" /> Delete
                </button>

                <button
                  onClick={() => openModal("assign", task)}
                  className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2 py-1.5 rounded-lg hover:bg-emerald-100 active:scale-95 transition-all"
                >
                  <FaUserPlus className="text-[9px]" /> Assign
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {selectTask && (
        <TaskDetailModal
          task={selectTask}
          onClose={closeModal}
          openModal={openModal}
        />
      )}
      {/* CREATE */}
      {activeModal === "create" && (
        <Modal type="create" onClose={closeModal}>
          <Field label="Task Name">
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design landing page"
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to be done?"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select
                className={inputCls}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Todo">Todo</option>
                <option value="Completed">Completed</option>
              </select>
            </Field>
            <Field label="Priority">
              <select
                className={inputCls}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Assigned To">
              <input
                className={inputCls}
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="User ID or name"
              />
            </Field>
            <Field label="Project">
              <input
                className={inputCls}
                value={Project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Project ID"
              />
            </Field>
          </div>
          <Field label="Deadline">
            <input
              type="date"
              className={inputCls}
              value={deadline}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <SubmitBtn
            onClick={handleSubmit}
            color="from-indigo-600 to-purple-600"
          >
            Submit
          </SubmitBtn>
        </Modal>
      )}

      {/* UPDATE */}
      {activeModal === "update" && (
        <Modal type="update" onClose={closeModal}>
          <Field label="Task Name">
            <input
              className={inputCls}
              value={newname}
              onChange={(e) => setNewname(e.target.value)}
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={newdescription}
              onChange={(e) => setNewdescription(e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Priority">
              <select
                className={inputCls}
                value={newpriority}
                onChange={(e) => setNewpriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </Field>
          </div>
          <Field label="Deadline">
            <input
              type="date"
              className={inputCls}
              value={deadline}
              onChange={(e) => setNewdeadline(e.target.value)}
            />
          </Field>
          <SubmitBtn
            onClick={handleUpdate}
            color="from-amber-500 to-orange-500"
          >
            Update
          </SubmitBtn>
        </Modal>
      )}

      {/* DELETE */}
      {activeModal === "delete" && (
        <Modal type="delete" onClose={closeModal}>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <b>{selectedTask?.name}</b>? This
            can't be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={closeModal}
              className="flex-1 text-sm font-semibold text-slate-600 bg-slate-100 py-3 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-red-500 py-3 rounded-xl"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* ASSIGN */}
      {activeModal === "assign" && (
        <Modal type="assign" onClose={closeModal}>
          <Field label="Assign To">
            <input
              className={inputCls}
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="User ID or name"
            />
          </Field>
          <SubmitBtn
            onClick={handleAssign}
            color="from-emerald-500 to-teal-500"
          >
            Assign
          </SubmitBtn>
        </Modal>
      )}

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MyTasks;
