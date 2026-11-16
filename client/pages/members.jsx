import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/navbar.jsx";
import Sidebar from "../components/sideBar.jsx";

const RoleBadge = ({ role }) => {
  const styles = {
    admin: "bg-red-50 text-red-700 ring-red-600/20",
    member: "bg-blue-50 text-blue-700 ring-blue-600/20",
    user: "bg-gray-50 text-gray-600 ring-gray-500/20",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${styles[role] || styles.user}`}
    >
      {role}
    </span>
  );
};

const MemberRow = ({ member }) => (
  <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors">
    <img
      src={
        member.user?.profile ||
        "https://ui-avatars.com/api/?name=" + (member.user?.name || "U")
      }
      alt={member.user?.name}
      className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">
        {member.user?.name || "Unknown"}
      </p>
      <p className="text-xs text-gray-500 truncate">{member.user?.email}</p>
    </div>
    <RoleBadge role={member.role} />
  </div>
);

const WorkspaceCard = ({ ws }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    {/* Header */}
    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
          {ws.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{ws.name}</h3>
          <p className="text-xs text-gray-400">
            {ws.members?.length || 0} members
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[11px] text-gray-400">Created</p>
        <p className="text-xs font-medium text-gray-600">
          {new Date(ws.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>

    {/* Members List */}
    <div className="divide-y divide-gray-50">
      {ws.members?.map((m, i) => (
        <MemberRow key={m._id || i} member={m} />
      ))}
    </div>
  </div>
);

const Skeleton = () => (
  <div className="space-y-5">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
      >
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-100 rounded w-20" />
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-gray-200" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-gray-200 rounded w-28" />
                <div className="h-3 bg-gray-100 rounded w-40" />
              </div>
              <div className="w-14 h-5 bg-gray-100 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const Members = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/workspace/my-workspace")
      .then((res) => setWorkspaces(res.data.workspaces))
      .catch((err) => setError(err.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const totalMembers = workspaces.reduce(
    (sum, ws) => sum + (ws.members?.length || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="grid grid-cols-12 min-h-screen">
        <div className="col-span-12">
          <Navbar
            title="SaaS Dashboard"
            gridCols="col-span-12"
            gridRows="row-span-2"
            mdGridCols="md:col-span-12"
            mdGridRows="md:row-span-2"
          />
        </div>
        <div className="col-span-3 hidden md:block">
          <Sidebar
            title="SaaS Management"
            mdGridCols="md:col-span-3"
            mdGridRows="md:row-span-10"
          />
        </div>

        <main className="col-span-12 md:col-span-9 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Team Members
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {workspaces.length} workspaces · {totalMembers} total members
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <Skeleton />
          ) : workspaces.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No workspaces found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {workspaces.map((ws) => (
                <WorkspaceCard key={ws._id} ws={ws} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Members;
