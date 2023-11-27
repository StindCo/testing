import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNodesState, useEdgesState } from "reactflow";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useProcessRunner } from "../../../shared/hooks/useProcessRunner";
import { useProcessRunnerSync } from "../../../shared/hooks/useProcessRunnerSync";
import {
  ModelAction,
  ArpuFunction,
  MouFunction,
  MbouFunction,
  ArpmFunction,
  LocalRunnerFunction,
  TranspositionFunction,
  LocalMultipleRunnerFunction,
} from "../../../shared/services/NodeFunctions";
import { RunningContext } from "./CreateProject";
import { ProjectManager } from "../../../shared/fetchers/Axios";
import { BsCheck } from "react-icons/bs";
import { subscribe } from "../../../shared/hooks/events";

type Props = {
  process: any;
  project: any;
  paramsInput: any;
};

const hexCharacters = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];

function getCharacter(index: number) {
  return hexCharacters[index];
}

function generateNewColor() {
  let hexColorRep = "#";

  for (let index = 0; index < 6; index++) {
    const randomPosition = Math.floor(Math.random() * hexCharacters.length);
    hexColorRep += getCharacter(randomPosition);
  }

  return hexColorRep;
}

const extractNodes: any = (process: any) => {
  let flow: any = JSON.parse(process?.flow);
  return flow.nodes;
};

const extractEdges: any = (process: any) => {
  let flow: any = JSON.parse(process?.flow);
  return flow.edges;
};

const filterCode = (code: string, params: any) => {
  var regex = /{([^}]+)}/g;
  var results = [];
  let match;
  while ((match = regex.exec(code))) {
    results.push(match[1]);
  }
  let allCode: any = results.reduce((previous, value: string) => {
    let codeFinal = previous.replace(
      `{${value}}`,
      params[value] ?? `{${value}}`
    );
    return codeFinal;
  }, code);

  return allCode;
};
export default function ProcessRunner({
  process,
  project,
  paramsInput,
}: Props) {
  const [processFounded, setProcess] = useState<any>(process);
  const canRun = useContext(RunningContext);
  const [projetFounded, setProjet] = useState<any>(project);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stateName, setStateName] = useState("Chargement des variables");

  const [nodes, setNodes, onNodesChange] = useNodesState<any>(
    extractNodes(process)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(
    extractEdges(process)
  );
  const [params, setParams] = useState(paramsInput);
  const [output, setOutput] = useState<any>([]);
  const [processState, setProcessState] = useState(false);

  useEffect(() => {
    setProjet(project);
  }, [project]);


  useEffect(() => {
    if (processState) {
      let outputs = nodes
        .filter((node: any) => node.type == "output_node")
        .map((node: any) => {
          return node.data;
          });
      setStateName("Enregistrement du process");
      ProjectManager.post(
        "/projets/" + projetFounded.id + "/processes",
        process
      ).then(({ data }: any) => {
        setStateName("Ajout des outputs du process");
        let resultPromises = outputs.map((output: any) => {
          let dataToImport: any = {};
          dataToImport.name = filterCode(output.config.name, params)  ;
          dataToImport.colorRef = generateNewColor();
          dataToImport.processName = process.id;
          dataToImport.code = JSON.stringify(output);
          ProjectManager.post(
            "/projets/" + projetFounded.id + "/outputs",
            dataToImport
          );
        });
        let timer = setTimeout(() => {
          setStateName("Finilisation de l'execution");
          let timer = setTimeout(() => {
            setStateName("Processus Terminé");
            setIsLoaded(true);
          }, 200);
          return () => clearTimeout(timer);
        }, outputs.length * 500);
        return () => clearTimeout(timer);
      });
    }
  }, [processState]);

  useEffect(() => {
    subscribe("launchRunner" + process.id, () => {
      let flow = JSON.parse(process.flow);
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setParams(paramsInput);
      let timer = setTimeout(() => {
        console.log("runnning");
        run();
      }, Math.floor(Math.random() * 1000));
      return () => clearTimeout(timer);
    });
  }, []);

  let execute = (node: any) => {
    let outputPromise: any;
    // Lancement de la fonction d'execution;
    if (node.type == "output_node") return true;
    if (node.type == "pivot") return true;

    try {
      switch (node.type) {
        case "model":
          outputPromise = ModelAction(node);
          break;
        case "arpu":
          outputPromise = ArpuFunction(node);
          break;
        case "mou":
          outputPromise = MouFunction(node);
          break;
        case "mbou":
          outputPromise = MbouFunction(node);
          break;
        case "arpm":
          outputPromise = ArpmFunction(node);
          break;
        case "local_runner":
          outputPromise = LocalRunnerFunction(node, params);
          break;
        case "transposition":
          outputPromise = TranspositionFunction(node);
          break;
        case "local_multi_runner":
          outputPromise = LocalMultipleRunnerFunction(node, params);
          break;
      }
    } catch (error: any) {
      setNodes((nds: any) =>
        nds.map((nodeFounded: any) => {
          if (nodeFounded.id === node.id) {
            nodeFounded.data = {
              ...nodeFounded.data,
            };
            nodeFounded.data["output"] = [];
          }
          return nodeFounded;
        })
      );
      setTimeout(() => {
        let nodeFounded: any = nodes.filter((nd: any) => nd.id === node.id)[0];
        transmiss(nodeFounded, "output", []);
      }, 100);
    }

    if (outputPromise != null) {
      outputPromise
        .then((result: any) => {
          result = result == null ? [] : result;
          // console.log(result, "kdkdl", node.type, node.id)
          setNodes((nds: any) =>
            nds.map((nodeFounded: any) => {
              if (nodeFounded.id === node.id) {
                nodeFounded.data = {
                  ...nodeFounded.data,
                };
                nodeFounded.data.output = result;
                transmiss(nodeFounded, "output", result);
              }
              return nodeFounded;
            })
          );
        })
        .catch((e: any) => {
          setNodes((nds: any) =>
            nds.map((nodeFounded: any) => {
              if (nodeFounded.id === node.id) {
                nodeFounded.data = {
                  ...nodeFounded.data,
                };
                nodeFounded.data["output"] = [];
                transmiss(nodeFounded, "output", []);
              }
              return nodeFounded;
            })
          );
        });
    }

    return true;
  };

  let transmiss = (source: any, sourceHandle: any, data: any) => {
    let workedEdges = edges
      .filter(
        (edge: any) =>
          edge.source == source.id && edge.sourceHandle == sourceHandle
      )
      .forEach((edge: any) => {
        let nodesToChange = nodes.filter((node: any) => node.id == edge.target);
        nodesToChange.forEach((node: any) => {
          setNodes((nds: any) =>
            nds.map((nodeFounded: any) => {
              if (nodeFounded.id === node.id) {
                nodeFounded.data = {
                  ...nodeFounded.data,
                };
                nodeFounded.data[edge.targetHandle] = data;
                // console.log(nodeFounded, "AAAA");
                execute(nodeFounded);
              }

              return nodeFounded;
            })
          );
        });
      });
  };

  let run: any = () => {
    setStateName("Compilation du process");
    let inputNodes = nodes.filter(
      (node: any) =>
        node.type == "model" ||
        node.type == "arpu" ||
        node.type == "mou" ||
        node.type == "mbou" ||
        node.type == "arpm"
    );

    inputNodes.forEach((node: any, index: number, array: any) => {
      execute(node);
    });

    let timer = setTimeout(() => {
      setProcessState(true);
    }, nodes.length * 500);

    return () => clearTimeout(timer);
  };

  return (
    <div className="mt-2 flex flex-col mb-8 bg-slate-100 p-3">
      <p className="text-left mb-2 flex items-center w-full">
        {isLoaded && <BsCheck className="text-3xl mr-4 text-green-600" />}
        <span className="font-[PoppinsBold] mr-3">{stateName} :</span>
        <span className="text-xs">{process.label}</span>
      </p>
      {/* {!isLoaded && <progress className="progress w-48"></progress>} */}
      {!isLoaded && <div className="text-xs text-left">opération en cours de traitement ...</div>}
    </div>
  );
}
