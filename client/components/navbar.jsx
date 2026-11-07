import React from "react";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { FaBell, FaUser } from "react-icons/fa";

const Navbar = ({
  title = "Saas Management",
  gridCols = "col-span-12",
  gridRows = "row-span-2",
  mdGridCols = "md:col-span-12",
  mdGridRows = "md:row-span-2",
}) => {
  return (
    <div
      className={`bg-slate-100 fixed z-10 overflow-hidden h-12 flex justify-between items-center px-10 text-xl rounded-lg w-full ${gridCols} ${gridRows} ${mdGridCols} ${mdGridRows}`}
    >
      <div className="flex items-center font-bold">
        {title}
        <MdOutlineQrCodeScanner className="text-2xl ml-5" />
      </div>

      <div className="flex items-center gap-5 mr-4">
        <FaBell />
        <FaUser />
      </div>
    </div>
  );
};

export default Navbar;
