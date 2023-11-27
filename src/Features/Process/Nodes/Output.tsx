import { Handle, Position, useStoreApi } from "reactflow";
import { TbPrompt } from "react-icons/tb";
import { useState, useEffect, useContext } from "react";
import { publish, subscribe } from "../../../shared/hooks/events";
import { MdOutput, MdPivotTableChart } from "react-icons/md";
import { BsGear } from "react-icons/bs";
import { ParamsContext } from "../ParamsContext";


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
export default function OutputNode({ id, type, data, isConnectable }: any) {
  const [isValidate, setIsValidate] = useState((data.input != null));
  const [canSendInfo, setCanSendInfo] = useState(false);
  const [config, setConfig] = useState<any>(data.config);
  const [input, setInput] = useState<any>(data.input);
  const store = useStoreApi();
  const [output, setOutput] = useState<any>();
  const [name, setName] = useState("");
  const [code, setCode] = useState();
  const params = useContext(ParamsContext);


  const [isAnimate, setIsAnimate] = useState(false);

  function animate() {
    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 1000);
  }

  useEffect(() => {
    setInput(data.input);
    animate();
    setIsValidate(true);
  }, [data]);


  useEffect(() => {
    subscribe("onConnect_" + id + "_input", (e: any) => {
      data = { ...data, input: e.detail };

      setInput(data.input);
      setIsValidate(true);
      animate();
    });
    subscribe("onSaveConfig-" + id, (e: any) => {
      data = {
        ...data,
        output: e.detail?.dataToSend?.output,
        config: e.detail?.dataToSend?.config,
        name: e.detail?.dataToSend?.config?.name,
      };
      setOutput(data.output);
      setConfig(data.config);
      setName(data.name);
      setCanSendInfo(true);

      publish("onUpdate", {
        id,
        sourceHandle: "output",
        data: e.detail?.dataToSend?.output,
      });
    });

  }, []);

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div className={`${
          isAnimate ? "animatecss-tada" : ""
        } relative text-xs animatecss p-[5px] bg-fuchsia-800 w-8 h-8 items-center flex justify-center  rounded-full text-white`}>
        <MdOutput size={16} />

        <Handle
          type="target"
          position={Position.Left}
          id={"input"}
          style={{
            background: "#555",
            width: 7,
            height: 7,
          }}
          isConnectable={isConnectable}
        />

        <div
          onDoubleClick={() => {
            if (isValidate == true) {
              data.input = input;
              data.name = name;
              data.config = config;
              data.code = code;
              publish("onConfig", { id, type, data });
            }
          }}
          className={`absolute border border-slate-white ${
            isValidate ? "bg-[#fff] hover:bg-[#eee]" : "bg-[#ccc]"
          } rounded-full no-drag cursor-pointer  w-4 h-4 items-center justify-center flex bottom-[-6px] right-[-3px] z-1 bg-[#ddd] text-slate-800  text-[10px]`}
        >
          <BsGear />
        </div>
      </div>
      <div className="text-[7px] text-center w-28">
        {config?.name != null ? filterCode(config?.name, params) : "Output"}
      </div>
    </div>
  );
}
