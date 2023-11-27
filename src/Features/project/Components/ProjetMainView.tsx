import React, { useEffect, useState } from "react";
import { BsPlus, BsPlusCircle } from "react-icons/bs";
import { TbNoteOff, TbNotesOff } from "react-icons/tb";
import { ProjectManager } from "../../../shared/fetchers/Axios";
import { publish, subscribe } from "../../../shared/hooks/events";
import AllProjects from "./AllProjects";
import Overview from "./Overview";
import ProjetVisualize from "./ProjetVisualize";
import SearchView from "./SearchView";
import SideProjectView from "./SideProjectView";

type Props = {};

export default function ProjetMainView({}: Props) {
  const [workspaceElement, setWorkspaceElement] = useState(1);
  const [projets, setProjets] = useState<any>([]);
  const [searchText, setSearchText] = useState("");
  const [principalView, setPrincipalView] = useState(1);
  const [lastView, setLastView] = useState(1);
  const [projetFocus, setProjetFocus] = useState<any>();

  useEffect(() => {
    subscribe("close-search-view", ({ detail }: any) => {
      setPrincipalView(lastView);
    });

    subscribe("open-visual-view", ({ detail }: any) => {
      setPrincipalView(3);
    });

    subscribe("show-project", ({ detail }: any) => {
      setProjetFocus(detail.index);
    });

    ProjectManager.get("/projets").then(({ data }) => {
      setProjets([...data].reverse());
      data.forEach((value: any) => {
        // Load outputs Of projets
        ProjectManager.get("/projets/" + value.id + "/report").then(
          ({ data }) => {
            setProjets((projets: any) => {
              projets = projets.map((projet: any) => {
                if (projet.id == value.id) {
                  projet.report = data;
                }
                return projet;
              });

              return projets;
            });
          }
        );
        // Load outputs Of projets
        ProjectManager.get("/projets/" + value.id + "/outputs").then(
          ({ data }) => {
            setProjets((projets: any) => {
              projets = projets.map((projet: any) => {
                if (projet.id == value.id) {
                  projet.outputs = data;
                }
                return projet;
              });

              return projets;
            });
          }
        );
        // Load processes Of projets
        ProjectManager.get("/projets/" + value.id + "/processes").then(
          ({ data }) => {
            setProjets((projets: any) => {
              projets = projets.map((projet: any) => {
                if (projet.id == value.id) {
                  projet.processes = data;
                }
                return projet;
              });

              return projets;
            });
          }
        );
      });
    });
  }, []);

  return (
    <div className="h-full flex flex-row items-start justify-between">
      <div className="w-4/5 h-full overflow  p-8">
        {/* Bar de recherche des projets */}
        <div className="w-full">
          <input
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => {
              setLastView(principalView);
              setPrincipalView(2);
            }}
            type="text"
            placeholder="Rechercher un projet ..."
            className="input input-bordered rounded-sm mt-3  w-full"
          />
        </div>
        {principalView == 1 && (
          <div>
            {/* Titre et menu sous-adjaçant */}
            <div className="mt-6 mb-4 font-bold text-3xl">Workspace.</div>
            <div className="flex flex-row items-center justify-between w-full border-b">
              <div>
                <a
                  onClick={() => setWorkspaceElement(1)}
                  className={`border-b ${
                    workspaceElement == 1
                      ? "border-blue-600 text-blue-600 bg-slate-50"
                      : ""
                  }  cursor-pointer p-3 px-5`}
                >
                  Overview
                </a>
                <a
                  onClick={() => setWorkspaceElement(2)}
                  className={`border-b ${
                    workspaceElement == 2
                      ? "border-blue-600 text-blue-600 bg-slate-50"
                      : ""
                  }  cursor-pointer p-3 px-5`}
                >
                  Tous les projets
                </a>
              </div>
              <div>
                <a
                  onClick={() => publish("projet-change-view", { view: 1 })}
                  className="border-b float-right rounded-t-lg p-3 px-5 btn space-x-3"
                >
                  <BsPlusCircle /> <span>nouveau</span>
                </a>
              </div>
            </div>

            {/* les views */}
            <div className=" w-full  p-6">
              {workspaceElement == 1 && <Overview projets={projets} />}
              {workspaceElement == 2 && <AllProjects projets={projets} />}
            </div>
          </div>
        )}

        {principalView == 2 && (
          <SearchView projets={projets} text={searchText} />
        )}
        {principalView == 3 && (
          <ProjetVisualize projet={projets[projetFocus]} />
        )}
      </div>
      <div className="w-1/4 h-full bg-[#fefefe] border-l ">
        {projetFocus == null && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="p-8 bg-slate-50 text-cyan-500 rounded-full">
              <TbNoteOff size={48} />
            </div>
            <h1 className="text-xs mt-8">Rien à signaler</h1>
          </div>
        )}

        {projetFocus != null && (
          <SideProjectView projet={projets[projetFocus]} />
        )}
      </div>
    </div>
  );
}
