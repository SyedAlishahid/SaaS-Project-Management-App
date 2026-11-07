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

        <div className="md:w-[85%] p-6  h-auto w-screen border-2 m-4 border-slate-800 rounded-lg">
          <div className="flex justify-between p-4">
            <h3 className="font-bold text-lg">Recent Projects</h3>
            <h6>View all</h6>
          </div>

          <div className="border-b-2 border-slate-800 w-full px-20 py-1"></div>
          {projectsInfo.projects?.map((project) => (
            <div
              key={project._id}
              className="group relative w-auto bg-slate-700 m-8 rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-700"
            >
              <h2 className="text-xl font-semibold text-white mb-2">
                {project.name}
              </h2>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>{" "}
              <div className="relative   top-full mt-2 w-96 p-4 bg-slate-600 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                {project.description}
              </div>
              <div key={project._id}>
                <Link
                  to={`/project/${project._id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View Details <span aria-hidden>→</span>
                </Link>
              </div>
              {/* Tooltip on hover */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
