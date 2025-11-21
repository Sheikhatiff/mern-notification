import React from "react";
import { Bell, BellRing } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header() {
  //temporary logic for getting random boolean value
  // eslint-disable-next-line react-hooks/purity
  const unreadNotifications = Date.now() % 2;
  const naviagte = useNavigate();

  function handleBellClick() {
    naviagte("/all-notifications");
  }

  return (
    <div className="bg-stone-900 text-xl sm:text-3xl text-stone-100 px-4 sm:px-6 py-4 flex justify-between items-center w-full mt-2 ">
      <span onClick={() => naviagte("/")} className="font-semibold">
        💌 | NOTIFICATIONS
      </span>
      {unreadNotifications ? (
        <BellRing
          size={30}
          className="shrink-0 hover:size-9 text-amber-200 hover:text-amber-400"
          onClick={handleBellClick}
        />
      ) : (
        <Bell
          size={30}
          className="shrink-0 hover:size-9 text-amber-200 hover:text-amber-400"
          onClick={handleBellClick}
        />
      )}
    </div>
  );
}

export default Header;
