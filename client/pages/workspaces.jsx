import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import Navbar from "../components/navbar.jsx";
import Sidebar from "../components/sideBar.jsx";

const workspaces = () => {
  const [workspace, setWorkspace] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {/* Main Content */}
      <div className="col-span-12 md:col-span-9 md:row-span-10 rounded-lg bg-[#0a0a0f] p-4 md:p-8 overflow-y-auto">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative  mt-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Workspaces
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {workspace.length} active workspace{workspace.length !== 1 && "s"}
            </p>
          </div>

          {/* Cards */}
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
                  className="group relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 transition-all duration-500 hover:bg-white/[0.06] hover:border-violet-500/30 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] hover:-translate-y-1"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-600/20">
                        {ws.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-white leading-tight">
                          {ws.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Created {formatDate(ws.createdAt)}
                          <br />
                          {ws._id}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>

                  {/* Members */}
                  {ws.members.length > 0 ? (
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-3">
                        Members ({ws.members.length})
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
                            </div>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default workspaces;
