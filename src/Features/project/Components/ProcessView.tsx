import { useEffect, useState } from "react";
import _ from "lodash";
import GridLayout from "react-grid-layout";
import "../styles/grid.css";
import "/node_modules/react-resizable/css/styles.css";
import View from "./View";

type Props = {
  outputs: any;
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

export default function ProcessView({ outputs }: Props) {
  const [rootValue, setRootValue] = useState<any>();
  const [layout, setLayout] = useState<any>([]);

  useEffect(() => {
    if (rootValue == null) return;
    let iterator: number = 1;
    let y: number = 0;
    let outputsToPut = outputs.map((_: any, k: number) => {
      iterator = iterator >= 2 ? 1 : iterator + 1;
      let x = 0;
      if (iterator == 1) x = 0;
      if (iterator == 2) x = 6;

      return {
        i: `${rootValue}-${k}`,
        x: 12,
        y: k * 10,
        w: 12,
        h: 10,
        minW: 4,
        minH: 4,
      };
    });
    setLayout([...outputsToPut]);
  }, [rootValue]);

  useEffect(() => {
    setRootValue(generateString(8));
  }, [outputs]);

  return (
    <>
      <div className="pane-content overflow-hidden truncate w-full h-full flex flex-col justify-between">
        <div className="overflow-hidden truncate ">
          <div className="p-2 pb-32 h-full overflow-hidden no-scrollBar overflow-y-scroll">
            <GridLayout
              className="layout"
              layout={layout}
              cols={12}
              draggableHandle=".dragHandle"
              rowHeight={30}
              width={580}
            >
              {outputs?.map((value: any, index: any) => (
                <div key={`${rootValue}-${index}`}>
                  <View output={value} key={index} />
                </div>
              ))}
            </GridLayout>
          </div>
        </div>
      </div>
    </>
  );
}
