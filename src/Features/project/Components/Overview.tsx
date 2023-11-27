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

export default function Overview({ projets }: Props) {
  const [lastProjects, setLastProjects] = useState(projets.slice(0, 3));
  useEffect(() => {
    setLastProjects(projets.slice(0, 3));
  }, [projets]);

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
            <h4 className="w-full text-lg mb-6">Les derniers projets</h4>
            <div className="grid grid-cols-3 break-all gap-8 mt-4">
              {lastProjects.map((project: any, index: number) => (
                <ProjetCard
                  index={index}
                  key={Math.random()}
                  project={project}
                />
              ))}
            </div>
          </div>
          {/* les derniers outputs */}
          {/* <div className="mt-8">
            <h4 className="w-full text-lg mb-2">Quelques outputs</h4>
            <div className="bg-[#fefefe]  w-full select-none">
              {Array(6)
                .fill(6)
                .map((value: any) => (
                  <div
                    key={Math.random()}
                    className=" flex flex-row hover:bg-[#f5f5f5d3]  justify-between px-4 py-2 bg-white cursor-pointer text-slate-800 border-[#e5e9f0]"
                  >
                    <div className="clear-both flex flex-row space-x-8 w-4/5  items-center">
                      <FcViewDetails className="text-3xl" />
                      <p className="">Evolution des abonnements</p>
                    </div>
                    <div className="dropdown dropdown-left  p-2 float-right">
                      <label tabIndex={0} className="cursor-pointer">
                        <BsThreeDots className="text-2xl text-shadow-lg" />
                      </label>
                      <ul
                        tabIndex={1}
                        className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52"
                      >
                        <li>
                          <a>
                            <BsUpload />
                            <span>new data</span>
                          </a>
                        </li>
                        <li>
                          <a>
                            <BsCheckCircle />
                            <span>Validation</span>
                          </a>
                        </li>
                        <li>
                          <a>
                            <BsCollection />
                            <span>voir dans pivot</span>
                          </a>
                        </li>
                        <li>
                          <a>
                            <BsTable />
                            <span>Afficher la table</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
}
