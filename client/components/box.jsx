import React from "react";

const box = ({ icon, num, content }) => {
  return (
    <div className="h-40 w-82 rounded-lg m-4 border-2  border-slate-600 p-4 ">
      {icon}
      <h2 className="font-bold text-2xl pt-4">{num}</h2>
      <h6 className="font-semibold text-xl">{content}</h6>
    </div>
  );
};

export default box;
