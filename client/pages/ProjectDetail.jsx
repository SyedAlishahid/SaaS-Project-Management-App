import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";
import Navbar from "../components/navbar.jsx";
import { FolderOpen, ArrowRight, ExternalLink } from "lucide-react";
import Sidebar from "../components/sideBar.jsx";
import myTasks from "./myTasks.jsx";

const ProjectDetail = () => {
  const [projectsInfo, setProjectsInfo] = useState([]);
  const { workspaceId } = useParams();

  useEffect(() => {
    api.get(`/project/workspace/${workspaceId}/projects/`).then((res) => {
      setProjectsInfo(res.data);
    });
  }, [workspaceId]);

  console.log(projectsInfo);
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
      <h3>All projects</h3>{" "}
      <div className="md:col-span-9 h-full mt-[5%] bg-gradient-to-br sm:mt-[10%] mr-10 overflow-none lg:mt-[3%] from-slate-900 via-slate-800 to-slate-900 md:row-span-10 rounded-2xl col-span-12 row-span-10 p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="flex flex-col gap-4 sm:gap-5 h-full justify-center">
          {projectsInfo.projects?.map((project) => (
            <div
              key={project._id}
              className="group relative flex items-center gap-4 sm:gap-5
          rounded-xl p-4 sm:p-5
          bg-slate-800/60 backdrop-blur-sm border border-slate-700/50
          hover:border-blue-500/40 hover:bg-slate-800/80
          hover:shadow-lg hover:shadow-blue-500/10
          transition-all duration-300"
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-3/5 w-[3px] rounded-full
          bg-gradient-to-b from-blue-500/0 via-blue-500/70 to-blue-500/0
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              {/* Icon */}
              <div
                className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg
          bg-slate-700/80 flex items-center justify-center
          group-hover:bg-blue-500/20 transition-colors duration-300"
              >
                <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h2
                  className="text-sm sm:text-base font-semibold text-white
            group-hover:text-blue-300 transition-colors truncate"
                >
                  {project.name}
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm line-clamp-1 sm:line-clamp-2 mt-0.5">
                  {project.description}
                </p>
              </div>

              {/* CTA */}
              <Link
                to={`/project/${project._id}`}
                className="shrink-0 hidden sm:inline-flex items-center gap-1.5
            text-sm font-medium text-blue-400 hover:text-blue-300
            transition-all duration-200"
              >
                View
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              {/* Mobile CTA (icon only) */}
              <Link
                to={`/project/${project._id}`}
                className="shrink-0 sm:hidden w-8 h-8 rounded-full
            bg-slate-700/60 flex items-center justify-center
            hover:bg-blue-500/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
              </Link>
            </div>
          ))}
        </div>
        <myTasks />
      </div>
    </div>
  );
};

export default ProjectDetail;
