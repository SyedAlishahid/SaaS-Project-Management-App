import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import Navbar from "../components/navbar.jsx";
import Sidebar from "../components/sideBar.jsx";
import { ToastContainer, toast } from "react-toastify";

const workspaces = () => {
  const [workspace, setWorkspace] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalType, setModalType] = useState(null); // 'createWorkspace' | 'deleteWorkspace' | 'addMembers' | 'removeMember' | 'updateMemberRole'
  const [targetWorkspace, setTargetWorkspace] = useState(null);
  const [userId, setUserId] = useState(null);

  const [name, setNewWorkspaceName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("member");

  const [addmember, setAddMember] = useState([]);
  const [newRole, setNewrole] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    api
      .get("/workspace/my-workspace")
      .then((res) => setWorkspace(res.data.workspaces))
      .finally(() => setLoading(false));
  }, []);
  console.log(workspace);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const closeModal = () => {
    setModalType(null);
    setTargetWorkspace(null);
    setNewWorkspaceName("");
    setMemberEmail("");
    setMemberRole("member");
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Workspace name is required");
      return;
    }

    try {
      const res = await api.post("/workspace/create-workspace", {
        name: name.trim(),
      });

      if (res.data.success || res.data.workspace) {
        const created = res.data.workspace || res.data;
        setWorkspace((prev) => [created, ...prev]);
        closeModal();
      }
    } catch (err) {
      console.error(
        "Create workspace failed:",
        err.response?.data || err.message,
      );
    }
  };

  const handleDeleteWorkspace = async () => {
    try {
      const data = await api.delete(
        `/workspace/delete-workspace/${targetWorkspace}`,
      );
      console.log(data);
      toast.error("Workspace deleted Successfully! reload to see changes");
      closeModal();
    } catch (error) {
      toast.error("Error occurs~");
      console.log(error);
    }
  };

  const handleAddMembers = async (e) => {
    try {
      e.preventDefault();
      const data = new URLSearchParams();
      data.append("email", memberEmail);
      data.append("role", memberRole);
      console.log(targetWorkspace);
      const response = await api.post(
        `/workspace/add-member/${targetWorkspace._id}`,
        data, // ← pass it here
      );
      toast.success("Member Added successfully~");
      setAddMember({ memberEmail, memberRole });
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveMember = async (e) => {
    try {
      e.preventDefault();
      const response = await api.delete(
        `/workspace/remove-member/${targetWorkspace._id}/${userId}`,
      );
      console.log(response);
      closeModal();
      toast.success("User removed Successfully~");
    } catch (error) {
      console.log(error);
      toast.error("Error occurs try again later~");
    }
  };

  const handleUpdateMemberRole = async (e) => {
    try {
      e.preventDefault();
      closeModal();
      const resp = await api.patch(
        `/workspace/update-role/${targetWorkspace._id}/${userId}`,
        { newRole },
      );
      toast.success("User role updated Successfully~");
      console.log(resp);
    } catch (error) {
      console.log(error);
      toast.error("can't Update users role~");
    }
  };

  return (
    <div className="grid grid-cols-12 grid-row-12 gap-4 p-6 overflow-hidden h-auto w-screen">
      <Navbar
        title="SaaS Dashboard"
        gridCols="col-span-12"
        gridRows="row-span-2"
        mdGridCols="md:col-span-12"
        mdGridRows="md:row-span-2"
      />
      <Sidebar
        title="SaaS Management"
        mdGridCols="md:col-span-3"
        mdGridRows="md:row-span-10"
      />

      <div className="col-span-12 lg:col-span-9 lg:row-span-10 rounded-lg bg-[#0a0a0f] p-4 lg:p-8 overflow-y-auto">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative mt-10">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Workspaces
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {workspace?.length} active workspace
                {workspace?.length !== 1 && "s"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalType("createWorkspace")}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-600/30 transition flex items-center gap-1.5"
            >
              <span>+</span> Create Workspace
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workspace.map((ws) => (
                <div
                  key={ws._id}
                  className="group relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 transition-all duration-500 hover:bg-white/[0.06] hover:border-violet-500/30 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-600/20">
                          {(ws.name || "W").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-base text-white leading-tight">
                            {ws.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Created {formatDate(ws.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                        <button
                          type="button"
                          title="Delete Workspace"
                          onClick={() => {
                            setTargetWorkspace(ws._id);
                            setModalType("deleteWorkspace");
                            handleDeleteWorkspace;
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {ws.members?.length > 0 ? (
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-3">
                          Members ({ws.members?.length})
                        </p>
                        <div className="space-y-2">
                          {ws.members.map((m) => (
                            <div
                              key={m._id}
                              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-300"
                            >
                              <div className="relative shrink-0">
                                <img
                                  src={
                                    m.user?.profile ||
                                    `https://api.dicebear.com/7.x/initials/svg?seed=${m.user?.name || m.user}`
                                  }
                                  alt={m.user?.name || "User"}
                                  className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-500/30"
                                />
                                {m.user?.isVerified && (
                                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#0a0a0f] flex items-center justify-center">
                                    <svg
                                      className="w-2 h-2 text-slate-900"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-white truncate">
                                    {m.user?.name || "Unknown"}
                                  </p>
                                  <span
                                    className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                                      m.role === "admin"
                                        ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                                        : "bg-slate-500/15 text-slate-400 border border-slate-500/20"
                                    }`}
                                  >
                                    {m.role}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">
                                  {m.user?.email}
                                </p>
                                {m.user?.bio && (
                                  <p className="text-[11px] text-slate-600 truncate mt-0.5">
                                    {m.user.bio}
                                  </p>
                                )}
                              </div>{" "}
                              <button
                                type="button"
                                onClick={() => {
                                  setTargetWorkspace(ws);
                                  setUserId(m._id);
                                  setModalType("removeMember");
                                }}
                                className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition truncate"
                              >
                                - Remove
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setTargetWorkspace(ws);
                                  setUserId(m.user._id);
                                  setEmail(m.user.email);
                                  setModalType("updateMemberRole");
                                }}
                                className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition truncate"
                              >
                                Update Role
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                        No members yet
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.08] grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetWorkspace(ws);
                        setModalType("addMembers");
                      }}
                      className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition truncate"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalType && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-[340px] sm:max-w-[380px] aspect-square bg-[#0e0e17] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            >
              ✕
            </button>

            {modalType === "createWorkspace" && (
              <form
                onSubmit={handleCreateWorkspace}
                className="flex flex-col justify-between h-full"
              >
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Create Workspace
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Provide a name for the new workspace.
                  </p>
                  <div className="mt-6">
                    <label className="text-xs text-slate-300 font-medium">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Production"
                      value={name}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      className="mt-1.5 w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs transition"
                >
                  Create
                </button>
              </form>
            )}

            {modalType === "deleteWorkspace" && (
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-bold text-rose-400">
                    Delete Workspace
                  </h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Are you sure you want to delete{" "}
                    <span className="text-white font-medium">
                      {targetWorkspace?.name}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteWorkspace}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs text-white font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {modalType === "addMembers" && (
              <form
                onSubmit={handleAddMembers}
                className="flex flex-col justify-between  h-full"
              >
                <div>
                  <h3 className="text-lg font-bold  text-emerald-400">
                    Add Member
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Invite to{" "}
                    <span className="text-white">{targetWorkspace?.name}</span>.
                  </p>
                  <div className="mt-6">
                    <label className="text-xs text-slate-300 font-medium">
                      Member Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      className="mt-1.5 w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />

                    <select
                      required
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      className="mt-1.5 w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="" disabled>
                        Select role
                      </option>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition"
                >
                  Send Invite
                </button>
              </form>
            )}

            {modalType === "removeMember" && (
              <form
                onSubmit={handleRemoveMember}
                className="flex mt-[15%] flex-col gap-5"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-rose-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>

                {/* Title + message */}
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Remove member
                  </h3>
                  <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                    You're about to remove{" "}
                    <span className="text-white font-medium">
                      {targetWorkspace?.name}
                    </span>{" "}
                    from this workspace. This action cannot be undone.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setModalType(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-medium text-sm transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition"
                  >
                    Remove
                  </button>
                </div>
              </form>
            )}

            {modalType === "updateMemberRole" && (
              <form
                onSubmit={handleUpdateMemberRole}
                className="flex flex-col justify-between h-full"
              >
                <div>
                  <h3 className="text-lg font-bold text-amber-400">
                    Update Member Role
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Workspace:{" "}
                    <span className="text-white">{targetWorkspace?.name}</span>
                  </p>
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-xs text-slate-300 font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly
                        className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 font-medium">
                        Role
                      </label>
                      <select
                        className="mt-1 w-full bg-[#12121e] border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500"
                        value={newRole}
                        onChange={(e) => setNewrole(e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition"
                >
                  Update Role
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default workspaces;
