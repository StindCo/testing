import { useEffect, useState } from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import { Handle, Position } from "reactflow";
import { HiOutlineAdjustments } from "react-icons/hi";
import { publish, subscribe } from "../../../shared/hooks/events";

export default function ReadExcelNode({ id, type, data, isConnectable }: any) {
  const [isValidate, setIsValidate] = useState(data.config != null);
  const [config, setConfig] = useState<any>(data.config);
  const [output, setOutput] = useState<any>(data.output);

  const [isAnimate, setIsAnimate] = useState(false);

  function animate() {
    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 1000);
  }

  async function getDatas() {
    setTimeout(() => {
      publish("onUpdate", {
        id,
        sourceHandle: "output",
        data: data.output,
      });
    }, 1000);
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
        } animatecss relative text-sm p-2 bg-green-800 w-10 h-10 items-center flex justify-center rounded-full text-white`}
      >
        <SiMicrosoftexcel size={20} />

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
          className="absolute rounded-sm no-drag cursor-pointer hover:bg-[#ccc] w-4 h-4 items-center justify-center flex bottom-[-6px] right-[-3px] z-1 bg-[#ddd] text-slate-800  text-xs"
        >
          <HiOutlineAdjustments />
        </div>
      </div>
      <div className="text-[7px] text-center">
        {config?.fileName || "Fichier Excel"}
        <br />
        {config?.sheetName || ""}
      </div>
    </div>
  );
}
