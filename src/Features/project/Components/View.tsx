import { useEffect, useState } from "react";

import "react-reflex/styles.css";
import ProjetTableView from "./ProjetTableView";
import ChartView from "./ChartView";
import { BsFullscreen, BsShare } from "react-icons/bs";
import { publish } from "../../../shared/hooks/events";

type Props = {
  key: any;
  output: any;
};

export default function View({ output }: Props) {
  const [outputToShow, setOutputToShow] = useState<any>();
  const [typeOfRender, setTypeOfRender] = useState();
  const [showLeftBar, setShowLeftBar] = useState(false);

  useEffect(() => {
    setTypeOfRender(outputToShow?.config?.typeOfRender);
  }, [outputToShow]);

  useEffect(() => {
    setOutputToShow(JSON.parse(output.code));
  }, [output]);
  return (
    <>
      <div className="shadow-md w-full overflow-hidden  cursor-move rounded-sm h-full">
        <div className="truncate px-5 p-3 flex space-x-5 flex-row items-center justify-between text-lg dragHandle w-full bg-[#fefefe] border-t border-x border-[#f5f5f5] shadow-sm">
          <h2 className="">{output.name ?? "Sans nom"}</h2>
          <BsFullscreen
            onClick={() => publish("show-output-full", { outputToShow })}
            className="cursor-pointer"
          />
        </div>
        <div className="w-full h-full cursor-auto">
          <div className="border-t h-full w-full">
            {typeOfRender == "simple-table" && (
              <ProjetTableView data={outputToShow.input ?? []} />
            )}
            {(typeOfRender == "chart-line" ||
              typeOfRender == "chart-column" ||
              typeOfRender == "chart-circular-fill") && (
              <ChartView
                legend={"Un titre"}
                description={"dk"}
                typeOfRender={typeOfRender}
                data={outputToShow.input ?? []}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
