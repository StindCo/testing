import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { publish, subscribe } from "../../../shared/hooks/events";
import { MdPivotTableChart, MdTableChart } from "react-icons/md";
import { AiOutlineFundView } from "react-icons/ai";

export default function PivotNode({ id, type, data }: any) {
  const [isValidate, setIsValidate] = useState(data.input != null);
  const [config, setConfig] = useState<any>(data.config);
  const [input, setInput] = useState<any>(data.input);
  const [label, setLabel] = useState();
  const [isAnimate, setIsAnimate] = useState(false);


  const animate = () => {
    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 1000);
  };

  useEffect(() => {
    data.input = input;
  }, [input]);

  useEffect(() => {
    subscribe("onConnect_" + id + "_input", (e: any) => {
      data = { ...data, input: e.detail };
      setInput(data.input);
      setIsValidate(true);
      animate();
    });
  }, []);

  useEffect(() => {
    setInput(data.input);
    animate();
    setIsValidate(true);
  }, [data]);


  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div
        className={`${
          isAnimate ? "animatecss-tada" : ""
        } relative text-sm p-2 bg-orange-700 w-8 h-8 items-center flex justify-center rounded-lg  text-white animatecss`}
      >
        <MdTableChart className="" size={20} />

        <Handle
          type="target"
          position={Position.Left}
          id={"input"}
          style={{
            background: "#555",
            width: 8,
            height: 8,
          }}
          isConnectable={true}
        />

        <div
          onDoubleClick={() => {
            if (isValidate == true) {
              publish("onConfig", { id, type, input });
            }
          }}
          className={`absolute rounded-full no-drag cursor-pointer ${
            isValidate ? "bg-[#eee] hover:bg-[#ccc]" : "bg-[#ccc]"
          }  w-4 h-4 items-center justify-center flex right-[-7px] bottom-[-3px] z-1  text-slate-800  text-[10px]`}
        >
          <AiOutlineFundView className="" />
        </div>
      </div>
      <div className="text-[7px] text-center">
        {config?.tableSelected?.name || "Data Table"}
      </div>
    </div>
  );
}
