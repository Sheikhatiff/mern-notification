import { FileSymlink, Trash2 } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatdate } from "../utils/formatDate";

function Notification({ val }) {
  const navigate = useNavigate();

  return (
    <div className="flex mb-5">
      <div className="p-2  hover:shadow-sm hover:shadow-yellow-100 w-4/5 sm:w-9/10">
        <p className="lowercase">
          Result of Emotions Analysis for this{" "}
          <span className="italic">"{val?.title}"</span> entry is ready!
        </p>
        <div className="flex justify-between items-center">
          <Link
            className="flex hover:cursor-pointer text-blue-500 hover:text-xl"
            onClick={() =>
              navigate(`/all-notifications/report/${val?.title.toLowerCase()}`)
            }
          >
            {" "}
            see the report...
            <FileSymlink />
          </Link>
          <p className="text-xs text-stone-400">{formatdate(val?.date)}</p>
        </div>
      </div>
      <div className=" w-1/5 sm:w-1/10 flex justify-center items-center p-2 ">
        <div className="border-l pl-2 ">
          {" "}
          <Trash2 className="text-red-200" />
        </div>
      </div>
    </div>
  );
}

export default Notification;
