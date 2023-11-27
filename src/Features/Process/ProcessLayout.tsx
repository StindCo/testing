import { useCallback, useEffect, useRef, useState } from "react";
import { GrDocumentTime } from "react-icons/gr";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Panel,
  updateEdge,
  useStoreApi,
  useReactFlow,
} from "reactflow";

import { Rnd } from "react-rnd";

import "reactflow/dist/style.css";
import "./overview.css";
import {
  BsChevronDown,
  BsChevronRight,
  BsGrid,
  BsPlayBtn,
  BsPlus,
  BsSave2,
} from "react-icons/bs";
import ToolsManagement from "./Tools/ToolsManagement";
import { motion } from "framer-motion";
import ModelNode from "./Nodes/Model";
import { VscSaveAs } from "react-icons/vsc";
import Runner from "./Nodes/Runner";
import LocalRunner from "./Nodes/LocalRunner";
import { publish, subscribe } from "../../shared/hooks/events";
import { ProjectManager } from "../../shared/fetchers/Axios";

import ConfigNode from "./Tools/ConfigNode";
import PivotNode from "./Nodes/pivot";
import ArpuNode from "./Nodes/ArpuNode";
import LocalMultiRunnerNode from "./Nodes/LocalMultipleRunner";
import TranspositionNode from "./Nodes/Transposition";
import OutputNode from "./Nodes/Output";
import { useSelector } from "react-redux";
import { getUser } from "../../shared/reducers/login";

import { useLocation } from "react-router-dom";
import MouNode from "./Nodes/MouNode";
import MbouNode from "./Nodes/MbouNode";
import ArpmNode from "./Nodes/ArpmNode";
import logo from "../../assets/images/mylogolong.png";
import { ParamsContext } from "./ParamsContext";
import { MdMoreTime } from "react-icons/md";
import ReadExcelNode from "./Nodes/ReadExcel";
import ResultNode from "./Nodes/Result";
import ReadProcessNode from "./Nodes/ReadProcess";
import DataInfos from "./Nodes/DataInfos";

const nodeTypes: any = {
  model: ModelNode,
  runner: Runner,
  import_process: ReadProcessNode,
  pivot: PivotNode,
  readExcel: ReadExcelNode,
  data_infos: DataInfos,
  mou: MouNode,
  result: ResultNode,
  arpm: ArpmNode,
  mbou: MbouNode,
  output_node: OutputNode,
  transposition: TranspositionNode,
  arpu: ArpuNode,
  local_runner: LocalRunner,
  local_multi_runner: LocalMultiRunnerNode,
};

const nodeColor = (node: any) => {
  switch (node.type) {
    case "pivot":
      return "#c2410c";
    case "model":
      return "#1e293b";
    case "local_runner":
      return "#5b21b6";
    case "local_multi_runner":
      return "#9d174d";
    case "arpu":
      return "#eab308";
    default:
      return "#aaa";
  }
};

const getId = () => `node_${Math.random()}`;

function formatDate(date = new Date()) {
  let day, month, year;

  year = date.getFullYear();
  month = date.getMonth() + 1;
  day = date.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  return day + "." + month + "." + year;
}

function generatePeriodParams(periodArray: any) {
  let params: any = {};
  periodArray.forEach((item: any, index: number) => {
    let prefix = "p" + (index + 1);
    params[prefix + "name"] = item.trimester + " - " + item.year;
    params[prefix + "year"] = item.year;
    params[prefix + "trimester"] = item.trimester;
    if (item.trimester == "T1") {
      params[prefix + "firstMonth"] = "Janvier";
      params[prefix + "secondMonth"] = "Février";
      params[prefix + "lastMonth"] = "Mars";
    } else if (item.trimester == "T2") {
      params[prefix + "firstMonth"] = "Avril";
      params[prefix + "secondMonth"] = "Mai";
      params[prefix + "lastMonth"] = "Juin";
    } else if (item.trimester == "T3") {
      params[prefix + "firstMonth"] = "Juillet";
      params[prefix + "secondMonth"] = "Aôut";
      params[prefix + "lastMonth"] = "Septembre";
    } else if (item.trimester == "T4") {
      params[prefix + "firstMonth"] = "Octobre";
      params[prefix + "secondMonth"] = "Novembre";
      params[prefix + "lastMonth"] = "Décembre";
    }
  });
  return params;
}

export default function ProcessLayout() {
  const reactFlowWrapper = useRef<any>(null);
  const [showTools, setShowTools] = useState(false);
  const [searchTool, setSearchTool] = useState("");
  const [label, setLabel] = useState("Sans nom | " + formatDate());
  let userLogged: any = useSelector(getUser);
  const [showConfigNode, setShowConfigNode] = useState(false);
  const [currentElementInConfig, setCurrentElementInConfig] = useState<any>({});
  const [showSaveBox, setShowSaveBox] = useState(false);
  const [canShowSuccessMessage, setCanShowSuccessMessage] = useState(false);
  const store = useStoreApi();
  const [id, setId] = useState(null);
  const edgeUpdateSuccessful = useRef(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isParamsViewShowed, setIsParamsViewShowed] = useState(false);
  const [isParamsPeriodViewShowed, setIsParamsPeriodViewShowed] =
    useState(true);
  const [params, setParams] = useState<any>({});
  const [paramsKey, setParamsKey] = useState([""]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { setViewport } = useReactFlow();
  const [periodParams, setPeriodParams] = useState<any>([]);
  const location = useLocation();
  const process = location.state != null ? location.state.process : null;

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const showMessageSuccess = () => {
    setCanShowSuccessMessage(true);
    setTimeout(() => {
      setCanShowSuccessMessage(false);
    }, 2000);
  };

  const onInit = (reactFlowInstance: any) => {
    console.log("flow loaded:", reactFlowInstance);
    setReactFlowInstance(reactFlowInstance);

    if (process != null) {
      const flow = JSON.parse(process.flow);

      setId(process.id);

      setLabel(process.label);

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        console.log(flow.params);
        if (flow.params != null) {
          setParams(flow.params);
          setParamsKey(Object.keys(flow.params));
        }
        if (flow.periodParams != null) {
          setPeriodParams(flow.periodParams);
        }
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    }
  };

  const save = (isNew = false, isSilent = false) => {
    let flow = reactFlowInstance.toObject();
    flow.params = params;
    flow.periodParams = periodParams;
    flow = JSON.stringify(flow);

    let outputs: any = store
      .getState()
      .getNodes()
      .filter((node: any) => node.type == "output_node")
      .map((value) => value.data);

    outputs = JSON.stringify(outputs);
    let newId = isNew ? null : id;
    ProjectManager.post("/process", {
      id: newId,
      flow,
      label,
      createdAt: new Date(),
      projectId: null,
      outputs,
      createdBy: userLogged.user,
    }).then(({ data }) => {
      if (data != "" && data != null) {
        setId(data.id);
        if (!isSilent) {
          setShowSaveBox(false);
          showMessageSuccess();
        }
      }
    });
  };

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onConnect = useCallback((params: Edge<any> | Connection) => {
    try {
      setEdges((eds) => {
        params = { ...params, updatable: "target", animated: true };
        return addEdge(params, eds);
      });
      let node: any = store
        .getState()
        .getNodes()
        .filter((node: any) => node.id == params.source);
      let key = params.sourceHandle || "error";
      let dataToSend: any = node[0].data[key];

      publish(
        "onConnect_" + params.target + "_" + params.targetHandle,
        dataToSend
      );
    } catch (e) {
      console.log("error founded");
    }
  }, []);

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge<any>, newConnection: Connection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    []
  );

  const onEdgeUpdateEnd = useCallback((_: any, edge: { id: string }) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  useEffect(() => {
    subscribe("onConfig", (e: any) => {
      setCurrentElementInConfig(e?.detail);
      setShowConfigNode(true);
    });

    subscribe("onUpdate", (e: any) => {
      let details: any = e.detail;
      let edgesToNotify: any = store
        .getState()
        .edges.filter(
          (item: any) =>
            item.source == details.id &&
            item.sourceHandle == details.sourceHandle
        )
        .forEach((item: any) => {
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === item.target) {
                // it's important that you create a new object here
                // in order to notify react flow about the change
                node.data = {
                  ...node.data,
                };
                node.data[item.targetHandle] = [...details.data];
              }

              return node;
            })
          );

          // publish(
          //   "onUpdate_" + item.target + "_" + item.targetHandle,
          //   details.data
          // );
        });
    });

    subscribe("closeConfigNode", (e: any) => setShowConfigNode(false));
  }, []);

  return (
    <>
      <div
        className="h-full  w-full p-8"
        onClick={(e) => {
          setShowTools(false);
          setShowSaveBox(false);
        }}
      >
        <ParamsContext.Provider value={params}>
          <div
            className="bg-[#fefefe] rounded-lg flex items-start justify-between  w-full h-full"

          >
            <div
              className="h-full overflow-hidden overflow-y-scroll no-scrollBar border-r w-1/5 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="flex flx-col space-x-6 items-center pt-8 rounded-lg">
                <h3 className="text-3xl font-[] text-slate-800 p-3">Toolbox.</h3>
              </div>
              <div className="w-full p-3">
                <input
                  type="search"
                  onChange={(e) => {
                    setSearchTool(e.target.value);
                    setShowTools(true);
                  }}
                  placeholder="Rechercher un outil"
                  className="input w-full input-bordered rounded-lg input-sm"
                />
              </div>
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                >
                  <ToolsManagement text={searchTool} />
                </motion.div>
              </div>
            </div>
            <div
              id="reactflow-view"
              ref={reactFlowWrapper}
              className="bg-[#fefefe]  w-4/5 h-full"
              style={{
                backgroundImage: `url(${logo})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeUpdate={onEdgeUpdate}
                onEdgeUpdateStart={onEdgeUpdateStart}
                onEdgeUpdateEnd={onEdgeUpdateEnd}
                onInit={onInit}
                fitView
                defaultViewport={{ zoom: 0.4, x: 0, y: 0 }}
                snapToGrid
                onDrop={onDrop}
                onDragOver={onDragOver}
                attributionPosition="top-right"
                nodeTypes={nodeTypes}
              >
                <MiniMap
                  nodeColor={nodeColor}
                  nodeStrokeWidth={3}
                  zoomable
                  pannable
                  position={"bottom-right"}
                />
                <Controls position={"top-right"} />
                {/* <Background color="#aaa" gap={20} /> */}

                <Panel position="bottom-left">
                  {canShowSuccessMessage && (
                    <div className="toast w-64 text-center toast-center toast-top ">
                      <div className={`alert alert-success  px-6 mb-8 shadow-lg`}>
                        <div className="w-text-center text-white">
                          <span className="text-center">
                            Enregistré avec succès
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Panel>

                <Panel position="bottom-left" className="w-full">
                  <div className="w-[35%]">
                    <div className="p-3 w-full h-5">
                      <Rnd
                        bounds={"#reactflow-view"}
                        dragHandleClassName={"handle"}
                        minWidth={350}
                        minHeight={50}
                        default={{
                          x: 0,
                          y: -40,
                          width: 400,
                          height: 50,
                        }}
                      >
                        <div className="w-full border overflow-hidden overflow-y-scroll no-scrollBar pb-8 h-full shadow-sm rounded-lg bg-[#fcfcfc]">
                          <div className="flex fixed flex-row space-x-6 shadow-sm justify-between items-center bg-slate-700 text-white w-full border p-2 rounded-lg">
                            <div className="w-4/5 handle cursor-move">
                              <h3 className="p-1 text-base">
                                Editeur de paramètres
                              </h3>
                            </div>
                            <div className="flex cursor-pointer text-white items-center space-x-2">
                              <MdMoreTime
                                onClick={(e) => {
                                  setIsParamsPeriodViewShowed(true);
                                  setIsParamsViewShowed(false);
                                }}
                                className="text-white"
                                size={25}
                              />
                              <BsPlus
                                onClick={(e) => {
                                  setIsParamsPeriodViewShowed(false);
                                  setIsParamsViewShowed(true);
                                  setParamsKey((params) => [...params, ""]);
                                }}
                                size={30}
                              />
                              {/* <div
                              onClick={(e) =>
                                setIsParamsViewShowed(!isParamsViewShowed)
                              }
                              className="px-2"
                            >
                              {isParamsViewShowed && (
                                <BsChevronDown size={20} />
                              )}
                              {!isParamsViewShowed && (
                                <BsChevronRight size={20} />
                              )}
                            </div> */}
                            </div>
                          </div>
                          {isParamsViewShowed && (
                            <div className="h-full mt-16  w-full items-start">
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
                                        setParamsKey((params: any) => {
                                          params[index] = e.target.value;
                                          return params;
                                        });
                                      }}
                                      className="input bg-[#fcfcfc] text-center rounded-lg w-1/2 input-bordered input-sm"
                                    />
                                    <input
                                      type="text"
                                      defaultValue={params[paramsKey[index]]}
                                      onChange={(e) => {
                                        setParams((params: any) => {
                                          params[paramsKey[index]] =
                                            e.target.value;
                                          return params;
                                        });
                                      }}
                                      className="input bg-[#fcfcfc] rounded-lg text-center  w-1/2 input-bordered input-sm"
                                    />
                                    <hr />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {isParamsPeriodViewShowed && (
                            <div className="h-full mt-16  w-full items-start">
                              <div className="px-3 w-full m-auto">
                                <div className="flex flex-row w-full border-b pb-1 text-sm">
                                  <p className="w-full  text-center">
                                    Définition des variables périodiques
                                  </p>
                                </div>
                                {Array(3)
                                  .fill(0)
                                  .map((value: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex pl-2 w-full text-center space-x-4 flex-row items-center justify-around py-2"
                                    >
                                      <select
                                        onChange={(e: any) => {
                                          setPeriodParams((params: any) => {
                                            params[index] = params[index] ?? {};
                                            params[index].trimester =
                                              e.target.value;
                                            return params;
                                          });
                                        }}
                                        defaultValue={
                                          periodParams[index]?.trimester
                                        }
                                        className="select select-bordered select-sm w-1/2 max-w-xs"
                                      >
                                        <option value="">Quel trimestre?</option>
                                        <option value="T1">T1</option>
                                        <option value="T2">T2</option>
                                        <option value="T3">T3</option>
                                        <option value="T4">T4</option>
                                      </select>
                                      <input
                                        defaultValue={periodParams[index]?.year}
                                        onChange={(e: any) => {
                                          setPeriodParams((params: any) => {
                                            params[index] = params[index] ?? {};
                                            params[index]["year"] =
                                              e.target.value;
                                            return params;
                                          });
                                        }}
                                        type="text"
                                        placeholder="Année"
                                        className="input bg-[#fcfcfc] rounded-lg text-center  w-1/2 input-bordered input-sm"
                                      />
                                      <hr />
                                    </div>
                                  ))}
                                <div className="text-center mt-2">
                                  {" "}
                                  <button
                                    onClick={(e) => {
                                      let paramsGenerated = {
                                        ...params,
                                        ...generatePeriodParams(periodParams),
                                      };
                                      setParams(paramsGenerated);
                                      setParamsKey(Object.keys(paramsGenerated));
                                    }}
                                    className="btn btn-sm mx-auto rounded-lg"
                                  >
                                    Générer les paramètres
                                  </button>{" "}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Rnd>
                    </div>

                    <div className="flex flex-row space-x-6 shadow-sm justify-between items-center bg-white w-full border p-2 rounded-lg">
                      <div className="w-4/5">
                        <input
                          type="text"
                          value={label}
                          onChange={(e) => setLabel(e.target.value)}
                          placeholder={"Le nom du label"}
                          className=" border-none outline-none input-sm p-2 w-full"
                        />
                      </div>
                      <div className="pr-2 flex flex-row items-center cursor-pointer space-x-4">
                        <BsSave2 onClick={(e) => save()} size={20} />
                        <VscSaveAs
                          onClick={(e) => {
                            save(true);
                          }}
                          size={22}
                        />
                      </div>
                    </div>
                  </div>
                </Panel>



                <Panel position="bottom-center">
                  <div className="relative bg-white px-5 rounded-lg py-2 border">
                    <div className="flex cursor-pointer items-center shadow-md flex-row select-none  text-white">
                      <div
                        onClick={(e) => publish("onRun", {})}
                        className="flex space-x-4 px-10  bg-green-700 py-2 active:shadow-xl hover:shadow-xl hover:bg-green-600 transistion items-center  rounded-lg"
                      >
                        <BsPlayBtn className="" size={20} />{" "}
                        <span className="text-sm">Executer</span>
                      </div>
                    </div>
                  </div>
                </Panel>
              </ReactFlow>
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {showConfigNode && <ConfigNode details={currentElementInConfig} />}
          </div>
        </ParamsContext.Provider>
      </div>
    </>
  );
}
