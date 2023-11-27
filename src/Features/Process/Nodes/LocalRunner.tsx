import { BsCodeSquare } from "react-icons/bs";
import { Handle, Position, useStoreApi } from "reactflow";
import { TbPrompt } from "react-icons/tb";
import { useState, useEffect, useCallback, useContext } from "react";
import { publish, subscribe } from "../../../shared/hooks/events";
import alasql from "alasql";
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

export default function LocalRunnerNode({
  id,
  type,
  data,
  isConnectable,
}: any): JSX.Element {
  const [isValidate, setIsValidate] = useState(data.input != null);
  const [canSendInfo, setCanSendInfo] = useState(data.output != null);
  const [config, setConfig] = useState<any>();
  const [input, setInput] = useState<any>(data.input);
  const params = useContext(ParamsContext);

  const [output, setOutput] = useState<any>(data.output);
  const [name, setName] = useState(
    data?.config?.name ?? data.name ?? "Requête Anonyme"
  );
  const [code, setCode] = useState(data?.config?.code ?? data?.code ?? "");

  const [isAnimate, setIsAnimate] = useState(false);

  function animate() {
    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 1000);
  }


  function execute(dataInput: any) {
    try {
      let result: any = alasql(`${filterCode(code, params)}`, [
        dataInput,
        dataInput,
      ]);

      if (!Array.isArray(result))
        result = [{ valeur: result }];
      data = {
        ...data,
        output: result,
      };

      setOutput(data.output);
      setTimeout(() => {
        publish("onUpdate", {
          id,
          sourceHandle: "output",
          data: data.output,
        });
      }, 1000);
    } catch (error) {
      console.log(error, id, name, code);
    }
  }

  useEffect(() => {
    if (data.input != null) {
      console.log("updated", data.input);
      setInput(data.input);
      animate();
      setIsValidate(true);
      execute(data.input);
    }
  }, [data.input]);

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
        code: e.detail?.dataToSend?.config?.code,
      };

      setOutput(data.output);
      setConfig(data.config);
      setName(data.name);
      setCode(data.config?.code);

      setCanSendInfo(true);

      setTimeout(() => {
        publish("onUpdate", {
          id,
          sourceHandle: "output",
          data: e.detail?.dataToSend?.output,
        });
      }, 1000);
    });
  }, []);

  return (
    <div className="flex  flex-col justify-center items-center space-y-2">
      <div className="text-[8px] text-center font-[PoppinsBold]">
        <div className="mb-[-6px]">
          <span className="text-[6px]  font-[PoppinsBold]">{name}</span>
        </div>
      </div>
      <div
        className={` ${
          isAnimate ? "animatecss-headShake" : ""
        } relative text-xs p-[5px] animatecss bg-violet-800 w-9 h-9 items-center flex justify-center rounded-full text-white`}
      >
        <BsCodeSquare size={16} />

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

        <Handle
          type="source"
          position={Position.Right}
          id={"output"}
          style={{
            bottom: "auto",
            top: 15,
            right: -3,
            background: `${canSendInfo ? "#555" : "#aaa"}`,
            width: 8,
            height: 8,
          }}
          isConnectable={canSendInfo}
        />

        <div
          onDoubleClick={() => {
            if (isValidate == true) {
              data.input = input;
              data.name = name;
              data.code = code;
              publish("onConfig", { id, type, data });
            }
          }}
          className={`absolute border border-slate-white ${
            isValidate ? "bg-[#fff] hover:bg-[#eee]" : "bg-[#ccc]"
          } rounded-full no-drag cursor-pointer  w-4 h-4 items-center justify-center flex bottom-[-6px] right-[-3px] z-1 bg-[#ddd] text-slate-800  text-[10px]`}
        >
          <TbPrompt />
        </div>
      </div>
      <div className="text-[7px] text-center">
        { "Sql Runner"}
      </div>
    </div>
  );
}
