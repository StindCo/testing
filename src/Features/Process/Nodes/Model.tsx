import { useEffect, useState } from "react";
import { BsDatabaseDown, BsGear } from "react-icons/bs";
import { Handle, Position, useStoreApi } from "reactflow";
import { HiOutlineAdjustments } from "react-icons/hi";
import { publish, subscribe } from "../../../shared/hooks/events";
import {
  loadData,
  loadDataFromOperateur,
} from "../../DataTool/services/ImportationService";

export default function ModelNode({ id, type, data, isConnectable }: any) {
  const [mois, setMois] = useState([
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aôut",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]);
  const [isValidate, setIsValidate] = useState(data.config != null);
  const [config, setConfig] = useState<any>(data.config);
  const [output, setOutput] = useState<any>(data.output);

  const [isAnimate, setIsAnimate] = useState(false);

  function animate() {
    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 1000);
  }

  async function getDatas() {
    try {

      if (data.config != null) {
        let response;
        if (data.config.operateur == null) {
          response = await loadData(data.config?.tableSelected);
        } else {
          response = await loadDataFromOperateur(
            data.config?.tableSelected,
            data.config?.operateur
          );
        }
        let result = response.data.map((item: any) => {
          (item.periodDesc = item.period?.trimester + "-" + item?.period?.year),
            (item.periodMonth = item?.period?.month),
            (item.periodTrimester = item?.period?.trimester),
            (item.periodYear = item?.period?.year);
          (item.periodName = mois[parseInt(item.periodMonth) - 1]),
            (item.period = null);
          return item;
        });

        data = {
          ...data,
          output: result,
        };
        setOutput(result);
        setTimeout(() => {
          publish("onUpdate", {
            id,
            sourceHandle: "output",
            data: result,
          });
        }, 1000);
      }
    } catch (e) { }
  }

  useEffect(() => {
    subscribe("onSaveConfig-" + id, (e: any) => {
      data = {
        ...data,
        output: e.detail?.dataToSend?.output,
        config: e.detail?.dataToSend?.config,
      };

      setOutput(data.output);
      setConfig(data.config);

      setIsValidate(true);
      setTimeout(() => {
        publish("onUpdate", {
          id,
          sourceHandle: "output",
          data: e.detail?.dataToSend?.output,
        });
      }, 1000);
    });

    subscribe("onRun", (e: any) => {
      animate();
      getDatas();
    });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div
        className={`${
          isAnimate ? "animatecss-rubberBand" : ""
        } animatecss relative text-sm p-2 bg-slate-800 w-10 h-10 items-center flex justify-center rounded-full text-white`}
      >
        <BsDatabaseDown size={20} />

        <Handle
          type="source"
          position={Position.Right}
          id={"output"}
          style={{
            bottom: "auto",
            background: `${isValidate ? "#555" : "#aaa"}`,
            width: 8,
            height: 8,
          }}
          isConnectable={isValidate}
        />

        <div
          onDoubleClick={(e) => {
            publish("onConfig", { id, type, data });
          }}
          className="absolute rounded-full no-drag cursor-pointer hover:bg-[#ccc] w-4 h-4 items-center justify-center flex bottom-[-6px] right-[-3px] z-1 bg-[#ddd] text-slate-800  text-xs"
        >
          <HiOutlineAdjustments />
        </div>
      </div>
      <div className="text-[7px] text-center">
        {config?.tableSelected?.name || "Modèle de données"}
        <br />
        {config?.operateur?.tag || ""}
      </div>
    </div>
  );
}
