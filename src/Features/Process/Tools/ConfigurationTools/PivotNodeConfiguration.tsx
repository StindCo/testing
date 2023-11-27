import { BsGear } from "react-icons/bs";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import { publish } from "../../../../shared/hooks/events";
import "react-reflex/styles.css";
import { useEffect, useState } from "react";
import Table from "../../../../shared/components/Table/Table";
import { AiOutlineFundView } from "react-icons/ai";

export default function PivotNodeConfiguration({ details }: any) {
  const [input, setInput] = useState<any>(details.input);

  return (
    <div>
      <header className="border-b p-3 px-5 w-full flex flex-row items-center justify-between">
        <h3 className="text-xl flex flex-row items-center space-x-4">
          <AiOutlineFundView size={30} /> <span>Visualisation des données</span>
        </h3>
        <div className="space-x-4">
          <button
            onClick={(e) => publish("closeConfigNode", {})}
            className="px-3 text-sm hover:bg-[#db3e3ed5] py-2 bg-red-600 text-white rounded-lg"
          >
            Fermer
          </button>

        </div>
      </header>

      <div className="w-full h-[550px]">
        <ReflexContainer orientation="horizontal">
          <ReflexElement className="top-pane w-full p-0 m-0">
            <div className="pane-content overflow-hidden w-full h-full">
              <div className="w-full bg-[#fafafa] h-full overflow-hidden overflow-y-scroll no-scrollBar">
                <Table data={input} />
              </div>
            </div>
          </ReflexElement>

          <ReflexSplitter propagate={true} />

          <ReflexElement
            minSize={70}
            size={70}
            className="bottom-pane h-[300px]"
          >
            <div className=" text-lg border-b p-3 px-4 bg-slate-800 text-white">
              Prévisualisation
            </div>
            <div>{/* <Table data={dataLoaded} /> */}</div>
          </ReflexElement>
        </ReflexContainer>
      </div>
    </div>
  );
}
