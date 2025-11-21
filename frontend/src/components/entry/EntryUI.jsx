import { Eye, Trash } from "lucide-react";
import { formatdate } from "../../utils/formatDate";

export default function EntryUI({ entry, handleView, handleRemove }) {
  const words = entry && entry?.title && entry?.title.toUpperCase().split("-");
  return (
    <div className=" border-2 border-stone-800 rounded-md m-2 my-4 p-4 text-sm sm:text-xl min-h-15 flex items-center justify-between ">
      <div className="sm:flex sm:justify-between sm:items-center">
        <small className="text-[8px] sm:text-xs sm:w-40 italic">
          {formatdate(entry?.date)}
        </small>
        <h1>
          {words && words.length > 8
            ? words.slice(0, 8).join(" ") + "..."
            : entry?.title.toUpperCase().replaceAll("-", " ")}
        </h1>
      </div>
      <div className="flex gap-2 sm:gap-4">
        <Eye className="h-8" color="gray" onClick={handleView} />
        <Trash className="h-8" color="red" onClick={handleRemove} />
      </div>
    </div>
  );
}
