import React from "react";
import { useRouteError } from "react-router-dom";

function Error() {
  const error = useRouteError();
  return (
    <div className="text-3xl text-stone-300 m-4 p-2 space-y-2 italic font-medium">
      {console.log(error)}
      <h1>Something went wrong 😢</h1>
      <p>{error.data || error.message} 💥</p>
    </div>
  );
}

export default Error;
