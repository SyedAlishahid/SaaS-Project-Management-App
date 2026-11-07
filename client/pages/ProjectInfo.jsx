import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { FaEdit, FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import { FaRegFolderClosed } from "react-icons/fa6";
import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Sidebar from "../components/sideBar.jsx";

import MyTasks from "../pages/myTasks.jsx";

function ProjectInfo() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [show, setShow] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [form, setForm] = useState({ newName: "", newDescription: "" });

  useEffect(() => {
    api.get(`/project/${projectId}`).then((res) => {
      setProject(res.data.project || res.data);
    });
  }, [projectId]);

  if (!project)
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const updateHandler = () => {
    setForm({
      newName: project.projects?.name || "",
      newDescription: project.projects?.description || "",
    });
    setUpdateShow(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/project/update/${projectId}`, form);
      setProject(res.data.project || res.data);
      setUpdateShow(false);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/project/delete/${project.projects?._id}`);
      setShow(false);
      setDeleted(true);
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="grid grid-cols-12 grid-rows-[auto_1fr]  gap-4 p-4 sm:p-6 h-screen overflow-hidden">
      <Navbar
        title="SaaS Dashboard"
        gridCols="col-span-12"
        gridRows="row-span-1"
        mdGridCols="md:col-span-12"
        mdGridRows="md:row-span-1"
      />

      <Sidebar
        title="SaaS Management"
        mdGridCols="md:col-span-3"
        mdGridRows="md:row-span-1"
      />

      <div className="col-span-12 mt-[7%] md:col-span-9 md:row-span-1 overflow-y-auto rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
        {/* Back link */}
        <Link
          to={`/workspace/${project.projects?.workspaceId || ""}/projects`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-6"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          Back to Projects
        </Link>

        {/* Card */}
        <div className="max-w-2xl rounded-xl border  border-slate-700/50 bg-slate-800/60 backdrop-blur-sm overflow-hidden">
          {/* Top accent */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

          <div className="p-5 sm:p-6 md:p-8 space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <FaRegFolderClosed className="w-6 h-6 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Project
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5 truncate">
                  {project.projects?.name}
                </h1>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {project.projects?.description}
              </p>
              <p className="text-xs text-slate-500">
                Updated{" "}
                {project.projects?.updatedAt &&
                  new Date(project.projects.updatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={updateHandler}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                  bg-blue-500/90 text-white text-sm font-medium
                  hover:bg-blue-500 active:bg-blue-600 transition-colors"
              >
                <FaEdit className="w-4 h-4" />
                Update
              </button>
              <button
                onClick={() => setShow(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                  bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20
                  hover:bg-red-500/20 active:bg-red-500/30 transition-colors"
              >
                <FaTrashAlt className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <MyTasks />
        {/* Deleted message */}
        {deleted && (
          <div className="mt-6 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-center">
            <p className="text-sm text-green-400 font-medium">
              ✓ Project deleted successfully.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Reload the page to see changes.
            </p>
          </div>
        )}
      </div>

      {/* ===== UPDATE MODAL ===== */}
      {updateShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setUpdateShow(false)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-slate-700/50 bg-slate-800 shadow-2xl overflow-hidden">
            <div className="h-[3px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white">Update Project</h3>
                <button
                  onClick={() => setUpdateShow(false)}
                  className="w-8 h-8 rounded-full bg-slate-700/60 flex items-center justify-center
                    text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.newName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, newName: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900/60 border border-slate-700
                      text-white text-sm placeholder:text-slate-500
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    value={form.newDescription}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, newDescription: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-900/60 border border-slate-700
                      text-white text-sm placeholder:text-slate-500 resize-none
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setUpdateShow(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700/60 text-slate-300
                      text-sm font-medium hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500 text-white
                      text-sm font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShow(false)}
          />
          <div className="relative w-full max-w-sm rounded-xl border border-slate-700/50 bg-slate-800 shadow-2xl overflow-hidden">
            <div className="h-[3px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
            <div className="p-5 sm:p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <FaTrashAlt className="w-5 h-5 text-red-400" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                Are you sure?
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                This will permanently delete{" "}
                <span className="text-white font-medium">
                  {project.projects?.name}
                </span>
                .
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShow(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700/60 text-slate-300
                    text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white
                    text-sm font-medium hover:bg-red-600 active:bg-red-700 transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectInfo;
