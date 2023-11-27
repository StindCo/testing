import { useEffect, useState } from "react";

import _ from "lodash";
import { useProcessRunner } from "./useProcessRunner";
import { useProcessRunnerSync } from "./useProcessRunnerSync";

export function useProjetRunner(processesInput: any, paramsInput: any) {
  const [processes, setProcesses] = useState<any>(processesInput);
  const [params, setParams] = useState<any>(paramsInput);
  const [processesRunner, setProcessesRunner] = useState<any>();
  const [nodesOfProcessInRunning, setNodesOfProcessInRunning] = useState([]);
  const [edgesOfProcessInRunning, setEdgesOfProcessInRunning] = useState([]);

  console.log(nodesOfProcessInRunning);
  console.log(edgesOfProcessInRunning);

  const runner: any = useProcessRunnerSync(
    nodesOfProcessInRunning,
    edgesOfProcessInRunning,
    params
  );

  useEffect(() => {
    console.log("Updates");
    setProcesses(processesInput);
    setParams(paramsInput);
  }, [processesInput, paramsInput]);

  const run = (index = 0) => {
    let flow = JSON.parse(processesInput[index].flow);
    setNodesOfProcessInRunning(flow.nodes);
    setEdgesOfProcessInRunning(flow.edges);

    console.log(nodesOfProcessInRunning, "jsksj");
    setTimeout(() => {
      // console.log(flow.nodes, "amlam");
      console.log(runner.nodes)

      if (processes[index + 1] != null) run(index + 1);
    }, 500);

  };

  return { processes, params, run };
}
