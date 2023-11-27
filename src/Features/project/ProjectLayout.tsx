import { useState, useEffect, useRef } from "react";
import { GiProcessor } from "react-icons/gi";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import "react-reflex/styles.css";
import { subscribe } from "../../shared/hooks/events";
import CkEditotView from "./Components/CkEditotView";
import CreateProject from "./Components/CreateProject";
import EditorView from "./Components/EditorView";
import ProjetMainView from "./Components/ProjetMainView";
import TinyEditor from "./Components/TinyEditor";

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function ProjectLayout() {
  const [width, setWidth] = useState<any>(0);
  const viewRef = useRef<any>(null);
  const [focusView, setFocusView] = useState(2);
  const [projetToEdit, setProjetToEdit] = useState(null);

  useEffect(() => {
    setWidth(1158);
    subscribe("projet-change-view", ({ detail }: any) => {
      setFocusView(detail.view ?? focusView);
    });

    subscribe("open-editor", ({ detail }: any) => {
      setProjetToEdit(detail.projet);
      setFocusView(3);
    });

  }, []);

  return (
    <>
      <div className="h-full  w-full p-8" onClick={(e) => {}}>
        <div className="bg-white rounded-lg  w-full h-full">
          <ReflexContainer orientation="vertical">
            <ReflexElement className="left-pane" size={250}>
              <div className="pane-content bg-slate-800 w-full h-full overflow-hidden overflow-y-scroll no-scrollBar  shadow-xl border-r rounded-l-lg">
                <header className="px-6  py-10 text-white rounded-b-xl mb-5">
                  <h2 className="text-2xl text-left w-56">
                    <span className="font-[PoppinsBold]">Dep</span>miner.
                  </h2>
                </header>

                <section className="px-3  truncate">
                  <h4
                    onClick={() => setFocusView(1)}
                    className={`text-md select-none  ${
                      focusView == 1 ? "bg-slate-50" : "bg-slate-300"
                    }  hover:bg-slate-50 cursor-pointer p-2 rounded-md text-black flex items-center justify-between`}
                  >
                    <div className="flex items-center space-x-3">
                      <GiProcessor size={20} /> <span> Nouveau projet</span>
                    </div>
                    {/* {showProcessList && <BsChevronRight />} */}
                  </h4>
                </section>
                <section className="px-3 mt-6  truncate">
                  <h4
                    onClick={() => setFocusView(2)}
                    className={`text-md select-none ${
                      focusView == 2 ? "bg-slate-50" : "bg-slate-300"
                    }  hover:bg-slate-50 cursor-pointer p-2 rounded-md text-black flex items-center justify-between`}
                  >
                    <div className="flex items-center space-x-3">
                      <GiProcessor size={20} /> <span>Tous les projets</span>
                    </div>
                    {/* {showProcessList && <BsChevronRight />} */}
                  </h4>
                </section>
                <section className="px-3 mt-6  truncate">
                  <h4
                    onClick={() => setFocusView(3)}
                    className={`text-md select-none ${
                      focusView == 3 ? "bg-slate-50" : "bg-slate-300"
                    }  hover:bg-slate-50 cursor-pointer p-2 rounded-md text-black flex items-center justify-between`}
                  >
                    <div className="flex items-center space-x-3">
                      <GiProcessor size={20} /> <span>Editeur</span>
                    </div>
                    {/* {showProcessList && <BsChevronRight />} */}
                  </h4>
                </section>
                {/* <section className="px-3 mt-6  truncate">
                  <h4
                    onClick={() => setFocusView(4)}
                    className={`text-md select-none ${
                      focusView == 4 ? "bg-slate-50" : "bg-slate-300"
                    }  hover:bg-slate-50 cursor-pointer p-2 rounded-md text-black flex items-center justify-between`}
                  >
                    <div className="flex items-center space-x-3">
                      <GiProcessor size={20} /> <span>Publications</span>
                    </div>
                  </h4>
                </section> */}
              </div>
            </ReflexElement>

            <ReflexSplitter className="text-white border-white bg-white" />

            <ReflexElement
              onResize={({ domElement, component }: any) =>
                setWidth(component?.ref?.current.offsetWidth)
              }
              className="right-pane"
            >
              <div ref={viewRef} className="h-full w-full overflow-hidden">
                {focusView == 1 && <CreateProject width={width} />}
                {focusView == 2 && <ProjetMainView />}
                {focusView == 3 && <TinyEditor projet={projetToEdit} />}
                {/* {focusView == 3 && <EditorView />} */}
                {/* {focusView == 3 && <CkEditotView />} */}
              </div>
            </ReflexElement>
          </ReflexContainer>
        </div>
      </div>
    </>
  );
}
