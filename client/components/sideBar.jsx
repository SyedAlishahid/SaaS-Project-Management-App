import { MdOutlineQrCodeScanner } from "react-icons/md";
import { MdWorkspacePremium } from "react-icons/md";
import { MdOutlineTaskAlt } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { FaRegFolderClosed } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
const sidebar = ({
  gridCols = "col-span-12",
  gridRows = "row-span-10",
  mdGridCols = "md:col-span-4",
  mdGridRows = "md:row-span-10",
}) => {
  const { workspaceId, projectId } = useParams();

  return (
    <div
      className={`bg-slate-100 ${gridRows} ${mdGridRows} ${mdGridCols} ${gridCols} hidden mt-[25%] rounded-lg lg:flex lg:flex-col p-4`}
    >
      <h1 className="font-bold text-lg">MENU</h1>

      <NavLink
        to={`/dashboard/${workspaceId}`}
        className={({ isActive }) =>
          `flex items-center justify-between text-xl mt-5 p-2 rounded-md transition-colors ${
            isActive ? "bg-slate-400" : "hover:bg-gray-300"
          }`
        }
      >
        Dashboard
        <MdOutlineQrCodeScanner className="text-2xl mr-5" />
      </NavLink>

      <NavLink
        to="/workspace/my-workspace"
        className={({ isActive }) =>
          `flex items-center justify-between text-xl mt-5 p-2 rounded-md transition-colors ${
            isActive ? "bg-slate-400" : "hover:bg-gray-300"
          }`
        }
      >
        Workspaces
        <MdWorkspacePremium className="text-2xl mr-5" />
      </NavLink>

      <NavLink
        to={`/project/workspace/${workspaceId}/projects/`}
        className={({ isActive }) =>
          `flex items-center justify-between text-xl mt-5 p-2 rounded-md transition-colors ${
            isActive ? "bg-slate-400" : "hover:bg-gray-300"
          }`
        }
      >
        Projects
        <FaRegFolderClosed className="text-2xl mr-5" />
      </NavLink>

      <NavLink
        to="/members"
        className={({ isActive }) =>
          `flex items-center justify-between text-xl mt-5 p-2 rounded-md transition-colors ${
            isActive ? "bg-slate-400" : "hover:bg-gray-300"
          }`
        }
      >
        Members
        <FaUsers className="text-2xl mr-5" />
      </NavLink>
    </div>
  );
};

export default sidebar;
