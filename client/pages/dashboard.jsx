import React, { useEffect, useState } from "react";
import { LuSquareDashedKanban } from "react-icons/lu";
import api from "../api/axios.js";
import { FaBell } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { MdWorkspacePremium } from "react-icons/md";
import { MdOutlineTaskAlt } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { FaRegFolderClosed } from "react-icons/fa6";
import Box from "../components/box.jsx";
import {
  FolderKanban,
  ArrowUpRight,
  ArrowRight,
  FolderGit2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoIosTimer } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { Link, NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Sidebar from "../components/sideBar.jsx";
const Dashboard = () => {
  const [data, setData] = useState({ stats: null, success: false });
  const [projectsInfo, setProjectInfo] = useState([]);
  const token = localStorage.getItem("token");
  const { workspaceId } = useParams();

  const { projectId } = useParams();
  const [single, setSingle] = useState([]);

  useEffect(() => {
    api.get(`/project/workspace/${workspaceId}/projects/`).then((res) => {
      setProjectInfo(res.data);

      const projectId = res.data.projects[0]?._id;
      if (!projectId) return;

      api.get(`/dashboard/${projectId}`).then((r) => setData(r.data));
    });
  }, [workspaceId]);

  return (
    <div className=" grid grid-cols-12 grid-row-12 gap-4 p-6 overflow-hidden h-auto w-screen">
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
      <div className=" md:col-span-9 flex justify-center mt-[8%] items-center flex-col h-full bg-slate-100 md:row-span-10 rounded-lg col-span-12 row-span-10">
        <h1 className="text-xl font-bold p-2 text-center ">Dashboard</h1>
        <h4 className=" p-2 text-sm  text-center">
          Welcome back! Here's your overview.
        </h4>
        <div className="flex flex-wrap justify-center items-center">
          <Box
            icon={<FaRegFolderClosed className="h-8 text-blue-600 w-8" />}
            num={data.stats?.Tasks ?? 0}
            content={"Tasks"}
          />
          <Box
            icon={<MdOutlineTaskAlt className="h-8 text-green-600 w-8" />}
            num={data.stats?.Completed ?? 0}
            content={"Completed"}
          />
          <Box
            icon={<IoIosTimer className="h-8 text-yellow-600 w-8" />}
            num={data.stats?.Pendings ?? 0}
            content={"Pending Tasks"}
          />
          <Box
            icon={<CiCalendarDate className="h-8 text-red-600 w-8" />}
            num={data.stats?.overdue_Tasks ?? 0}
            content={"Overdue Tasks"}
          />
        </div>
        <section className="w-full md:w-[85%] m-4 rounded-2xl border border-white/[0.08] bg-[#0B0F19]/90 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08] bg-gradient-to-r from-white/[0.03] to-transparent">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-400/20 text-indigo-400 shadow-inner">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold tracking-tight text-white">
                    Recent Projects
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
                    {projectsInfo.projects?.length || 0}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a workspace to inspect details and progress
                </p>
              </div>
            </div>

            <button
              type="button"
              className="group inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-200"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Projects Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectsInfo.projects?.map((project) => (
              <Link
                key={project._id}
                to={`/project/${project._id}`}
                className="group relative flex flex-col justify-between rounded-xl border border-white/[0.07] bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                {/* Subtle top highlight line on hover */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Card Top Row: Icon + Arrow */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 border border-white/[0.06] text-slate-300 group-hover:bg-indigo-500/15 group-hover:text-indigo-300 group-hover:border-indigo-500/30 transition-colors">
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-indigo-400 transition-colors">
                      Open
                      <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  {/* Project Title */}
                  <h2 className="text-base font-semibold text-slate-100 group-hover:text-white transition-colors line-clamp-1 mb-1.5">
                    {project.name}
                  </h2>

                  {/* Description (expands smoothly on hover instead of broken floating box) */}
                  <p
                    title={project.description}
                    className="text-xs leading-relaxed text-slate-400 line-clamp-2 group-hover:text-slate-300 transition-colors"
                  >
                    {project.description}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    View Details
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
