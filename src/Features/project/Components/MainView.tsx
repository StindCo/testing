import { useEffect, useState } from "react";
import _ from "lodash";
import GridLayout from "react-grid-layout";
import "../styles/grid.css";
import "/node_modules/react-resizable/css/styles.css";
import View from "./View";
import {
  BsNewspaper,
  BsPlus,
  BsPlusCircle,
  BsShare,
  BsTools,
} from "react-icons/bs";
import { GiProcessor } from "react-icons/gi";
import { Link } from "react-router-dom";

type Props = {
  width: number;
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

export default function MainView({ width }: Props) {
  const [projects, setProjects] = useState([1, 2, 3]);
  const [rootValue, setRootValue] = useState(generateString(8));
  const [layout, setLayout] = useState<any>([]);

  useEffect(() => {
    let iterator: number = 1;
    let y: number = 0;
    let outputsToPut = projects.map((_: any, k: number) => {
      iterator = iterator >= 3 ? 1 : iterator + 1;
      let x = 0;
      if (iterator == 1) x = 0;
      if (iterator == 2) x = 6;

      return { i: `${rootValue}-${k}`, x, y: 0, w: 6, h: 8, minW: 4, minH: 4 };
    });
    setLayout([...outputsToPut]);
  }, [projects]);

  // useEffect(() => {
  //   setRootValue(generateString(8));
  //   let value: any = [...JSON.parse(process.outputs)];
  //   setOutputs(value);
  // }, [process]);

  // const layout = [
  //   { i: "a", x: 0, y: 0, w: 4, h: 8 },
  //   { i: "b", x: 4, y: 0, w: 4, h: 8 },
  //   { i: "c", x: 8, y: 0, w: 4, h: 8 },
  // ];

  return (
    <div className="pane-content overflow-hidden truncate w-full h-full flex flex-col justify-between">
      <div className="p-8 py-4 overflow-hidden">
        <header className="border-b truncate rounded p-6 flex  items-center justify-between">
          <div className="flex items-center space-x-5">
            <BsTools size={40} />
            <div>
              <h1 className="text-xl">Gestion des projets.</h1>
              <h4 className="text-gray-700 text-xs mt-1">
                Un utilitaire pour créer et générer des projets en toute
                simplicité.
              </h4>
            </div>
          </div>
          <div>
            <button className="btn space-x-4 btn-sm btn-outline btn-primary">
              <BsPlusCircle />
              <span>Nouveau</span>
            </button>
          </div>
        </header>
        <div className="p-4 pb-32 h-full overflow-hidden no-scrollBar overflow-y-scroll">
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            // draggableHandle=".dragHandle"
            rowHeight={30}
            width={width - 100}
          >
            {projects.map((value: any, index: any) => (
              <div key={`${rootValue}-${index}`} className="border"></div>
            ))}
          </GridLayout>
        </div>
      </div>

      {/* <div className="border-t p-2 bg-[#fefefe]">
        <Link
          to="/dashboard/process"
          state={{ process }}
          className="py-2 px-6 btn-outline float-right border rounded-lg btn btn-sm flex space-x-3"
        >
          <BsShare /> <span>Ouvrir le process</span>
        </Link>
      </div> */}
    </div>
  );
}
