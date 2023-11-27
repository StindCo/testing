import { useEffect, useState } from "react";
import { BsDatabaseDown, BsGear } from "react-icons/bs";
import { Handle, Position, useStoreApi } from "reactflow";
import { HiOutlineAdjustments } from "react-icons/hi";
import { publish, subscribe } from "../../../shared/hooks/events";
import { Runner } from "../../../shared/fetchers/Axios";

export default function MbouNode({ id, type, data, isConnectable }: any) {
  const [isValidate, setIsValidate] = useState(data.output != null);
  const [config, setConfig] = useState<any>(data.config ?? []);
  const [output, setOutput] = useState<any>(data.output ?? []);
  const [label, setLabel] = useState();

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
  const [isAnimate, setIsAnimate] = useState(false);

  function animate() {
    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 1000);
  }

  async function getDatas() {
    try {
      if (config != null) {
        let response;

        response = await Runner.get(
          `/mbou${data.config?.operateur == null
            ? ""
            : "?operateurTag=" + data.config?.operateur?.tag}`
        );

        let result = response.data;
        result = result.map((item: any) => {
          Object.keys(item).forEach((key) => {
            if (key.includes("total") ||
              key.includes("arpu") ||
              key.includes("month"))
              item[key] = parseFloat(item[key]);
          });
          if (item.trimester != null && item.month != 0) {
            item.type = "Mois";
            item.name = mois[parseInt(item.month) - 1];
          } else if (item.trimester != null && item.month == 0) {
            item.type = "Trimestre";
            item.name = item.trimester + " - " + item.year;
          } else if (item.trimester == null) {
            item.type = "Année";
            item.name = item.year;
          }
          return item;
        });

        data = {
          ...data,
          output: result,
        };
        setOutput(data);
        setTimeout(() => {
          publish("onUpdate", {
            id,
            sourceHandle: "output",
            data: data.output,
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
    <div className="flex flex-col justify-center items-center">
      <div className="text-[9px] mb-1 text-center font-[PoppinsBold]">
        {config?.tableSelected?.name || "M.B.O.U"}
        <div className="mt-[-3px]">
          <span className="text-[6px] font-[Poppins]">
            {config?.operateur?.tag || ""}{" "}
          </span>
        </div>
      </div>
      <div
        className={`${
          isAnimate ? "animatecss-rubberBand" : ""
        } animatecss relative text-sm p-2 bg-slate-100  w-16 h-10 items-center flex justify-center rounded text-slate-800 border border-slate-700`}
      >
        <BsDatabaseDown size={20} />

        <Handle
          type="source"
          position={Position.Right}
          id={"output"}
          style={{
            bottom: "auto",
            top: 15,
            right: -4,
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
          className="absolute rounded no-drag cursor-pointer hover:bg-red-700 w-6 h-4 items-center justify-center flex bottom-[-11px] right-[18px] z-1 bg-red-600 text-slate-800  text-xs"
        >
          <HiOutlineAdjustments className="transform rotate-90" />
        </div>
      </div>
    </div>
  );
}
