import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FcOpenedFolder } from "react-icons/fc";
import { publish } from "../../../shared/hooks/events";

type Props = {
  project: any;
  index: number;
};

export default function ProjetCard({ project, index }: Props) {
  const showInSideView = () => {};

  return (
    <div
      onDoubleClick={() => publish("show-project", { index })}
      className="border-t select-none  border-l rounded-lg h-48 cursor-pointer text-center shadow-md p-4 pb-5"
    >
      <div className="relative flex flex-row justify-between w-full float-right  dropdown dropdown-left">
        <div
          style={{
            backgroundColor: project.colorRef?.toLowerCase(),
          }}
          className={`cursor-pointer border w-6 h-6 rounded-full`}
        ></div>
        <div>
          <label tabIndex={0} className="cursor-pointer">
            {/* <BsThreeDotsVertical className="text-2xl text-shadow-lg" /> */}
          </label>
        </div>
      </div>
      <div className=" mt-10 flex flex-col w-full  justify-center space-y-3       items-center">
        <FcOpenedFolder className="text-6xl" />
        <p className="text-sm w-2/3">{project.name}</p>
      </div>
    </div>
  );
}
