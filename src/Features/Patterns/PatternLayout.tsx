import { useState, useEffect, useRef, useContext } from "react";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";
import { GiProcessor } from "react-icons/gi";
import { TbPointFilled } from "react-icons/tb";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import "react-reflex/styles.css";
import { ProjectManager } from "../../shared/fetchers/Axios";
import { PatternsContext } from "../Dashboard/PatternsContext";
import ProcessView from "./Components/ProcessView";

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function PatternsLayout() {
  const [width, setWidth] = useState<any>(0);
  const viewRef = useRef<any>(null);

  const [processList, setProcessList] = useState<any>([]);
  const [currentElementToView, setCurrentElementToView] = useState<any>({});
  const [categoryOfElementToView, setCategoryOfElementToView] =
    useState<any>("process");

  const [processToShow, setProcessToShow] = useState(processList);
  const [showProcessList, setShowProcessList] = useState(true);
  const [filterInput, setFilterInput] = useState();

  const onChangeFilterInput = (text: string) => {
    setProcessToShow(
      processList.filter((value: any) =>
        value.label.toLowerCase().includes(text)
      )
    );
  };

  useEffect(() => {
    setWidth(1158);
  }, []);

  useEffect(() => {
    setCurrentElementToView(
      processList[randomIntFromInterval(0, processList.length - 1)]
    );
  }, [processList]);

  useEffect(() => {
    ProjectManager.get("/process").then(({ data }) => {
      if (data != processList) {
        setProcessList(data);
        setProcessToShow(data);
      }
    });
  }, []);

  return (
    <>
      <div className="h-full  w-full p-8" onClick={(e) => {}}>
        <div className="bg-white rounded-lg  w-full h-full">
          <ReflexContainer orientation="vertical">
            <ReflexElement className="left-pane" size={300}>
              <div className="pane-content w-full h-full overflow-hidden  bg-[#fefefe]  shadow-xl border-r rounded-l-lg">
                <header className="px-6  py-10 bg-white shadow-sm rounded-b-xl mb-8">
                  <h2 className="text-2xl w-64 mb-4">Gestion des modèles.</h2>
                  <input
                    defaultValue={""}
                    onChange={(e) => onChangeFilterInput(e.target.value)}
                    placeholder="Rechercher"
                    className="input input-sm w-full input-bordered"
                  />
                </header>

                <section className="px-3  overflow-hidden overflow-y-scroll h-full no-scrollBar ">
                  <h4
                    onClick={(e) => setShowProcessList(!showProcessList)}
                    className="text-md truncate select-none bg-slate-800 cursor-pointer p-3 rounded-md text-white flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <GiProcessor size={20} /> <span>Mes Modèles</span>
                    </div>
                    {showProcessList && <BsChevronDown />}
                    {!showProcessList && <BsChevronRight />}
                  </h4>

                  {showProcessList && (
                    <div className="py-1 text-sm pl-4 truncate select-none">
                      {processToShow.map((value: any) => (
                        <div
                          onClick={(e) => {
                            setCurrentElementToView(value);
                            setCategoryOfElementToView("process");
                          }}
                          key={Math.random()}
                          className={`flex flex-row items-center p-2 space-x-2 ${
                            value == currentElementToView ? "bg-[#eee]" : ""
                          }
                           hover:bg-[#eee]
                          cursor-pointer rounded-lg`}
                        >
                          <TbPointFilled size={30} />
                          <span className="truncate">{value.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
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
                {categoryOfElementToView == "process" && (
                  <ProcessView width={width} process={currentElementToView} />
                )}
              </div>
            </ReflexElement>
          </ReflexContainer>
        </div>
      </div>
    </>
  );
}
