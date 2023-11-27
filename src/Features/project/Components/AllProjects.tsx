import React, { useEffect, useState } from "react";
import {
  BsFilesAlt,
  BsThreeDots,
  BsUpload,
  BsCheckCircle,
  BsCollection,
  BsTable,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { FcOpenedFolder, FcViewDetails } from "react-icons/fc";
import ProjetCard from "./ProjetCard";

type Props = {
  projets: any;
};

export default function AllProjects({ projets }: Props) {
  return (
    <div className="w-full h-screen pb-[800px] no-scrollBar overflow overflow-y-scroll">
      {projets.length == 0 && (
        <div className="text-center text-orange-500 border-orange-500 border mx-auto h-20 mt-36 flex flex-col items-center justify-center rounded-lg w-2/5   text-sm">
          <h1>Aucun projet trouvé</h1>
        </div>
      )}
      {projets.length != 0 && (
        <div className="">
          {/* Récents projets */}
          <div>
            <h4 className="w-full text-lg mb-6">Tous les projets</h4>
            <div className="grid grid-cols-3 break-all gap-8 mt-4">
              {projets.map((project: any, index: number) => (
                <ProjetCard
                  index={index}
                  key={Math.random()}
                  project={project}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
