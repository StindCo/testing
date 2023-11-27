import { useEffect, useState } from "react";
import { BsCodeSlash, BsDatabaseDown, BsGear } from "react-icons/bs";
import { Handle, Position } from "reactflow";
import { TbPrompt } from "react-icons/tb";

export default function RunnerNode({ id, data, isConnectable }: any) {
  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div className=" relative text-sm p-2 bg-slate-800 w-10 h-10 items-center flex justify-center rounded-full text-white">
        <BsCodeSlash size={20} />

        <Handle
          type="source"
          position={Position.Right}
          id={"out" + id}
          style={{
            bottom: "auto",
            top: 15,
            right: -3,
            background: "#555",
            width: 8,
            height: 8,
          }}
          isConnectable={isConnectable}
        />

        <div
          onClick={(e) => alert("Cliked node " + id)}
          className="absolute rounded-full no-drag cursor-pointer hover:bg-[#ccc] w-4 h-4 items-center justify-center flex bottom-[-6px] right-[-3px] z-1 bg-[#ddd] text-slate-800  text-xs"
        >
          <TbPrompt />
        </div>
      </div>
    </div>
  );
}
