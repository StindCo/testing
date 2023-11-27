import { useEffect, useState } from "react";
import _ from "lodash";
import GridLayout from "react-grid-layout";
import "../styles/grid.css";
import "/node_modules/react-resizable/css/styles.css";
import View from "./View";
import { BsGear, BsPlay, BsShare } from "react-icons/bs";
import { GiProcessor } from "react-icons/gi";
import { Link } from "react-router-dom";
import {
  MdDeleteSweep,
  MdOutlineMobileScreenShare,
  MdOutlineSettingsPhone,
  MdSettingsVoice,
  MdSignalCellular3Bar,
} from "react-icons/md";
import { useProcessRunner } from "../../../shared/hooks/useProcessRunner";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import { publish } from "../../../shared/hooks/events";
import operateurs from "../../../shared/reducers/operateurs";
import { RotatingLines } from "react-loader-spinner";
import { ParamsContext } from "./ParamsContext";

type Props = {
  process: any;
  width: any;
};

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function generateString(length: number) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export default function ProcessView({ process, width }: Props) {
  if (process == null) return <></>;
  const [outputs, setOutputs] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [showProcessRunner, setShowProcessRunner] = useState(false);

  const [edges, setEdges] = useState([]);
  const [processParams, setProcessParams] = useState<any>({ sksl: "" });
  const [rootValue, setRootValue] = useState(generateString(8));
  const [paramsKey, setParamsKey] = useState(["sksl"]);
  const [showProcessParams, setShowProcessParams] = useState(false);
  const [layout, setLayout] = useState<any>([]);
  const [isNew, setIsNew] = useState(false);

  let processRunner = useProcessRunner(nodes, edges, processParams);

  useEffect(() => {
    processRunner.setParams(processParams);
  }, processParams);

  useEffect(() => {
    let iterator: number = 1;
    let y: number = 0;
    let outputsToPut = outputs.map((_: any, k: number) => {
      iterator = iterator >= 2 ? 1 : iterator + 1;
      let x = 0;
      if (iterator == 1) x = 0;
      if (iterator == 2) x = 6;

      return { i: `${rootValue}-${k}`, x, y: 0, w: 6, h: 8, minW: 4, minH: 4 };
    });
    setLayout([...outputsToPut]);
  }, [outputs]);

  useEffect(() => {
    setRootValue(generateString(8));
    setIsNew(true);
    setOutputs(processRunner.output);
  }, [processRunner.output]);

  useEffect(() => {
    setRootValue(generateString(8));
    let value: any = [...JSON.parse(process.outputs)];
    setOutputs(value);
  }, [process]);

  useEffect(() => {
    let flow: any = JSON.parse(process.flow);
    setNodes(flow.nodes);
    setEdges(flow.edges);
    if (flow.params != null) {
      setParamsKey(Object.keys(flow.params));
    } else {
      setParamsKey([]);
    }
    setProcessParams({ ...flow.params });
  }, [process]);

  // const layout = [
  //   { i: "a", x: 0, y: 0, w: 4, h: 8 },
  //   { i: "b", x: 4, y: 0, w: 4, h: 8 },
  //   { i: "c", x: 8, y: 0, w: 4, h: 8 },
  // ];

  return (
    <>
      <ReflexContainer orientation="vertical">
        <ReflexElement className="left-pane">
          <div className="pane-content overflow-hidden truncate w-full h-full flex flex-col justify-between">
            <div className="p-8 py-4 overflow-hidden truncate ">
              <header className="border-b p-6 flex truncate  items-center justify-between">
                <div className="flex items-center space-x-5">
                  <GiProcessor size={40} />
                  <div className="truncate">
                    <h1 className="text-xl">{process.label ?? ""}</h1>
                    <h4 className="text-gray-700 text-xs mt-1">
                      {" "}
                      crée ou modifié par{" "}
                      <span className="font-[PoppinsBold]">
                        {process.createdBy.username ?? ""}
                      </span>{" "}
                    </h4>
                  </div>
                </div>
                <div className="truncate">
                  <button
                    onClick={() => {
                      // setShowProcessRunner(true);
                      processRunner.run();
                      // setOutputs(processRunner.output);
                    }}
                    className={`btn btn-icon w-30 rounded-lg truncate btn-sm px-5 btn-success  ${
                      processRunner.processState ? "" : "btn-outline"
                    }`}
                  >
                    {processRunner.processState && (
                      <>
                        <RotatingLines
                          strokeColor="black"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="20"
                          visible={true}
                        />
                        <span className="ml-3">Chargement ...</span>
                      </>
                    )}
                    {!processRunner.processState && (
                      <>
                        <BsPlay size={25} />
                        Executer
                      </>
                    )}
                  </button>
                </div>
              </header>
              <ParamsContext.Provider value={processParams}>
                <div className="p-4 pb-32 h-full overflow-hidden no-scrollBar overflow-y-scroll">
                  <GridLayout
                    className="layout"
                    layout={layout}
                    cols={12}
                    draggableHandle=".dragHandle"
                    rowHeight={30}
                    width={width - 100}
                  >
                    {outputs.map((value: any, index: any) => (
                      <div key={`${rootValue}-${index}`}>
                        <View output={value} key={index} />
                      </div>
                    ))}
                  </GridLayout>
                </div>
              </ParamsContext.Provider>
            </div>

            <div className="border-t space-x-6 flex flex-row justify-end p-2 bg-[#fefefe]">
              <Link
                to="/dashboard/process"
                state={{ process }}
                className="py-2 px-6 btn-outline border rounded-lg btn btn-sm flex space-x-3"
              >
                <BsShare /> <span>Ouvrir le process</span>
              </Link>
              {/* <button className="py-2 px-6 btn-outline btn-error border rounded-lg btn btn-sm flex items-center space-x-3">
                <MdDeleteSweep size={16} /> <span>Supprimer le modèle</span>
              </button> */}
              <button
                onClick={() => setShowProcessParams(true)}
                className="py-2 px-6 btn-outline btn-primary border rounded-lg btn btn-sm flex items-center space-x-3"
              >
                <BsGear size={16} /> <span>Configurer les variables</span>
              </button>
            </div>
          </div>
        </ReflexElement>
        {showProcessRunner && <ReflexSplitter propagate={true} />}

        {showProcessRunner && (
          <ReflexElement className="bottom-pane h-[300px]">
            <div className=" text-lg border-b p-3 px-4 bg-slate-800 text-white">
              Prévisualisation
            </div>
          </ReflexElement>
        )}
      </ReflexContainer>

      {showProcessParams && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 p-0 max-w-3xl h-3/4 no-scrollBar">
            <div className="flex flex-row border-b p-4 px-8 items-center justify-between">
              <h3 className="text-xl font-bold">Variables d'environnement</h3>
              <label
                htmlFor="my-modal-3"
                onClick={(e) => setShowProcessParams(false)}
                className="btn btn-sm btn-circle"
              >
                ✕
              </label>
            </div>

            <div className="h-full mt-3  w-full items-start">
              <div className="px-3 w-full m-auto">
                <div className="flex flex-row w-full border-b pb-1 text-sm">
                  <p className="w-1/2 text-center">Clé</p>
                  <p className="w-1/2 text-center">Valeur</p>
                </div>
                {paramsKey.map((value: any, index: number) => (
                  <div
                    key={index}
                    className="flex pl-2 w-full text-center space-x-4 flex-row items-center justify-around py-2"
                  >
                    <input
                      type="text"
                      defaultValue={value}
                      onChange={(e) => {
                        setParamsKey((processParams: any) => {
                          processParams[index] = e.target.value;
                          return processParams;
                        });
                      }}
                      className="input bg-[#fcfcfc] text-center rounded-lg w-1/2 input-bordered input-sm"
                    />
                    <input
                      type="text"
                      defaultValue={processParams[paramsKey[index]]}
                      onChange={(e) => {
                        console.log(processParams[paramsKey[index]]);
                        setProcessParams((processParams: any) => {
                          processParams[paramsKey[index]] = e.target.value;
                          return processParams;
                        });
                      }}
                      className="input bg-[#fcfcfc] rounded-lg text-center  w-1/2 input-bordered input-sm"
                    />
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
