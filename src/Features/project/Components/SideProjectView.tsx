import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineFundView } from "react-icons/ai";
import { BsChevronDown, BsChevronRight, BsPen } from "react-icons/bs";
import { FcOpenedFolder } from "react-icons/fc";
import { GiProcessor } from "react-icons/gi";
import { TbPointFilled } from "react-icons/tb";
import { publish } from "../../../shared/hooks/events";

type Props = {
  projet: any;
};

export default function SideProjectView({ projet }: Props) {
  const [showProcessList, setShowProcessList] = useState(true);

  return (
    <div
      className={`w-full h-full overflow-hidden border-2 border-[${projet.colorRef?.toLowerCase()}]`}
      style={{
        borderColor: projet.colorRef?.toLowerCase(),
      }}
    >
      <header className="flex flex-col space-y-3 text-center shadow-md p-5 items-center">
        <div className="flex flex-row btn-groups w-full items-center mb-3 justify-end ">
          {/* <button
            onClick={() => publish("open-visual-view", {})}
            className="text-xs flex border p-1  space-x-2 hover:bg-slate-50  items-center"
          >
            <AiOutlineFundView size={25} /> <span>visualize</span>
          </button> */}
          <button
            onClick={() => publish("open-editor", { projet: projet })}
            className="text-xs flex border p-1 px-3 rounded-lg space-x-2 hover:bg-slate-50  items-center"
          >
            <AiOutlineEdit size={25} /> <span>Editeur</span>
          </button>
        </div>

        <div
          className=" p-5 rounded-full border"
          style={{
            borderColor: projet.colorRef?.toLowerCase(),
          }}
        >
          <FcOpenedFolder className="text-6xl" />
        </div>
        <h2 className="text-xl font-[PoppinsBold]">{projet.name}</h2>
        <h2 className="text-xs">crée par {projet.createdBy?.username}</h2>
      </header>
      <div className="p-3 mt-2">
        <h4
          onClick={(e) => setShowProcessList(!showProcessList)}
          className="text-md select-none bg-slate-700 cursor-pointer p-3 rounded-md text-white flex items-center justify-between"
        >
          <div className="flex items-center space-x-2 text-sm">
            <span>{projet.processes?.length ?? "0"}</span>{" "}
            <span>Modèles intégrés</span>
          </div>
          {showProcessList && <BsChevronDown />}
          {!showProcessList && <BsChevronRight />}
        </h4>
      </div>
      <div className="h-28 overflow-hidden overflow-y-scroll">
        <div className="py-1 text-sm pl-4 truncate select-none ">
          {projet.processes != null && projet.processes.map((value: any) => (
            <div
              onClick={(e) => {}}
              key={Math.random()}
              className={`flex flex-row text-sm items-center p-2 space-x-2
                           hover:bg-[#eee]
                          cursor-pointer rounded-lg`}
            >
              <TbPointFilled size={25} />
              <span className="truncate">{value.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 mt-2">
        <h4
          onClick={(e) => setShowProcessList(!showProcessList)}
          className="text-md select-none bg-slate-700 cursor-pointer p-3 rounded-md text-white flex items-center justify-between"
        >
          <div className="flex items-center space-x-2 text-sm">
            <span>{projet.outputs?.length ?? "0"}</span>{" "}
            <span>Valeurs en sortie</span>
          </div>
          {showProcessList && <BsChevronDown />}
          {!showProcessList && <BsChevronRight />}
        </h4>
      </div>
      <div className="h-28 overflow-hidden overflow-y-scroll">
        <div className="py-1 text-sm pl-4 truncate select-none ">
          {projet.outputs != null && projet.outputs.map((value: any) => (
            <div
              onClick={(e) => {}}
              key={Math.random()}
              className={`flex flex-row text-sm items-center p-2 space-x-2
                           hover:bg-[#eee]
                          cursor-pointer rounded-lg`}
            >
              <TbPointFilled size={25} />
              <span className="truncate">{value.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
