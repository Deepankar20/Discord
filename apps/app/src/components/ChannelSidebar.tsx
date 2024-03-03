import { useQueries } from "@tanstack/react-query";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

const ChannelSidebar = () => {
  const router = useRouter();
  const serverId = router.query.sId;
  console.log(serverId);

  return (
    <div className="bg-gray-700 h-screen w-56 flex flex-col gap-12 p-3 items-center">
      <div>
        <h1>
          text channels <button>+</button>
        </h1>

        <div>#general</div>
        <div>#general</div>
      </div>

      <div></div>
    </div>
  );
};

export default ChannelSidebar;
