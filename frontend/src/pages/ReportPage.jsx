import React from "react";
import BarChart from "../components/BarChart";
import { useLocation } from "react-router-dom";
import { entries } from "../data";
import { formatdate } from "../utils/formatDate";

const data = {
  excitement: 12.5,
  anger: 7.25,
  sadness: 19.25,
  surprise: 31.75,
  neutral: 14.25,
  others: 15.0,
};
function ReportPage() {
  const { pathname } = useLocation();
  const path = pathname?.split("/")[3];
  const entry = entries.filter((e) => e.title.toLowerCase() === path).at(0);
  if (!entry)
    return (
      <p className="italic m-4 p-4 text-stone-300">
        No Record Found or you deleted this record!
      </p>
    );
  return (
    <div className="">
      <div className="m-2 p-2 sm:mx-6 px-4 text-stone-200">
        <div className="sm:flex sm:justify-around sm:items-center">
          {" "}
          <h1 className="uppercase font-bold text-xl items-center">
            {entry.title.replaceAll("-", " ")}
          </h1>
          <p className="text-xs text-stone-400">{formatdate(entry.date)}</p>
        </div>
        <p className="mt-4 sm:h-18 sm:overflow-auto text-stone-300">
          {entry.entry}
        </p>
      </div>
      <BarChart data={data} />
    </div>
  );
}

export default ReportPage;
