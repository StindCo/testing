import { useContext, useEffect, useState } from "react";

import "react-reflex/styles.css";
import ProjetTableView from "./ProjetTableView";
import ChartView from "./ChartView";
import { ParamsContext } from "./ParamsContext";


type Props = {
  key: any;
  output: any;
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

export default function View({ output }: Props) {
  const [name, setName] = useState(output.config?.name ?? "Sans nom");
  const [typeOfRender, setTypeOfRender] = useState(
    output.config?.typeOfRender ?? "simple-table"
  );
  const [input, setInput] = useState(output.input ?? []);
  const params = useContext(ParamsContext);


  useEffect(() => {
    setName(output.config?.name);
    setInput(output.input);
    setTypeOfRender(output.config?.typeOfRender ?? "simple-table");
  }, [output]);

  return (
    <div className="shadow-md w-full overflow-hidden  cursor-move rounded-sm h-full">
      <div className="truncate px-5 p-3 text-lg dragHandle w-full bg-[#fefefe] border-t border-x border-[#f5f5f5] shadow-sm">
        <h2 className="">{filterCode(name, params) }</h2>
      </div>
      <div className="w-full h-full cursor-auto">
        <div className="border-t h-full w-full">
          {typeOfRender == "simple-table" && <ProjetTableView data={input} />}
          {(typeOfRender == "chart-line" || typeOfRender == "chart-column" || typeOfRender == "chart-circular-fill") && (
            <ChartView
              legend={"Un titre"}
              description={"dk"}
              typeOfRender={typeOfRender}
              data={input}
            />
          )}
        </div>
      </div>

      {/* <Table data={output.input} /> */}
    </div>
  );
}
