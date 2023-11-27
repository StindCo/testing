import { useEffect, useState } from "react";

import {
  ArpmFunction,
  ArpuFunction,
  LocalMultipleRunnerFunction,
  LocalRunnerFunction,
  MbouFunction,
  ModelAction,
  MouFunction,
  TranspositionFunction,
} from "../services/NodeFunctions";

import _ from "lodash";
import { useNodesState, useEdgesState } from "reactflow";
import { useCustomState } from "./useCustomState";

export function useProcessRunner(
  nodesInput: any,
  edgesInput: any,
  paramsInput: any = null
) {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(nodesInput);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(edgesInput);
  const [params, setParams] = useState(paramsInput);
  const [output, setOutput] = useState<any>([]);
  const [processState, setProcessState] = useState(false);

  useEffect(() => {
    setNodes(nodesInput);
    setEdges(edgesInput);
    setParams(paramsInput);
  }, [nodesInput, edgesInput, paramsInput]);



  let execute = (node: any) => {
    let outputPromise: any;
    // Lancement de la fonction d'execution
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
      console.warn(error);
    }

    if (outputPromise != null) {
      outputPromise
        .then((result: any) => {
          result = result == null ? [] : result;

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
          console.warn(e);
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
                execute(nodeFounded);
              }

              return nodeFounded;
            })
          );
          // setTimeout(() => execute(node), 200);
        });
      });
  };

  let run: any = () => {
    setProcessState(true);
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

    setTimeout(() => {
      setProcessState(false);

      setOutput(
        nodes
          .filter((node: any) => node.type == "output_node")
          .map((node: any) => node.data)
      );
    }, inputNodes.length * 500 + (nodes.length - inputNodes.length) * 200);
  };

  return {
    run,
    nodes,
    edges,
    output,
    processState,
    setParams,
    setNodes,
    setEdges,
  };
}
