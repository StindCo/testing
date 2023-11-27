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
import { publish } from "../../../shared/hooks/events";
import ProjetCard from "./ProjetCard";

type Props = {
  projets: any;
  text: any;
};

export default function SearchView({ projets, text }: Props) {
  const [foundedProjects, setFoundedProjects] = useState([]);
  useEffect(() => {
    if (text != "" && text.length > 2) {
      setFoundedProjects(
        projets
          .filter((projet: any) => projet.name.toLowerCase().includes(text))
          .reverse()
      );
    } else {
      setFoundedProjects([]);
    }
  }, [projets, text]);

  return (
    <div className="w-full h-screen pb-[300px] pt-6 no-scrollBar overflow overflow-y-scroll">
      <h4 className="w-full flex items-center justify-between text-lg mb-6">
        <span>Recherche ...</span>{" "}
        <span
          onClick={() => publish("close-search-view", {})}
          className="text-sm text-red-600 cursor-pointer"
        >
          annuler
        </span>{" "}
      </h4>

      {foundedProjects.length == 0 && (
        <div className="text-center text-orange-500 border-orange-500 border mx-auto h-20 mt-36 flex flex-col items-center justify-center rounded-lg w-2/5   text-sm">
          <h1>Aucun projet trouvé</h1>
        </div>
      )}
      {foundedProjects.length != 0 && (
        <div className="">
          {/* Récents projets */}
          <div>
            <div className="grid grid-cols-3 break-all gap-8 mt-4">
              {foundedProjects.map((project: any, index: number) => (
                <ProjetCard
                  index={projets.findIndex((p:any) => p.id == project.id)}
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
