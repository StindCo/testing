import { BsCodeSquare } from "react-icons/bs";
import { Handle, Position, useStoreApi } from "reactflow";
import { TbPrompt } from "react-icons/tb";
import { useState, useEffect, useContext } from "react";
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

export default function LocalMultiRunnerNode({
  id,
  type,
  data,
  isConnectable,
}: any) {
  const [isValidate, setIsValidate] = useState(false);
  const [config, setConfig] = useState<any>();
  const [input_a, setInput_a] = useState<any>(data.input_a);
  const [input_b, setInput_b] = useState<any>(data.input_b);
  const [output, setOutput] = useState<any>(data.output);
  const [canSendInfo, setCanSendInfo] = useState(output != null);
  const store = useStoreApi();
  const [name, setName] = useState(data.name ?? "Requête Anonyme");
  const [code, setCode] = useState(data?.config?.code ?? data?.code  ?? "");
  const params = useContext(ParamsContext);


  const [label, setLabel] = useState();
  const [isAnimate, setIsAnimate] = useState(false);

  const animate = () => {
    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 1000);
  };

  const executeA = (dataInput: any) => {
    try {
      let result: any = alasql(`${filterCode(code, params)}`, [dataInput, data.input_b]);

      if (!Array.isArray(result)) result = [{ valeur: result }];
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
      console.log(error);
    }
  };

  const executeB = (dataInput: any) => {
    try {
      let result: any = alasql(`${filterCode(code, params)}`, [data?.input_a, dataInput]);

      if (!Array.isArray(result)) result = [{ valeur: result }];
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
      console.log(error);
    }
  };


  useEffect(() => {
    if(data.input_a != null && data.input_b != null) {
      setInput_a(data.input_a);
      setInput_b(data.input_b);
      animate();
    }
  }, [data.input_a, data.input_b]);


  useEffect(() => {
       setIsValidate(true);
      executeA(input_a);
  }, [input_a]);

  useEffect(() => {
    setIsValidate(true);
    executeB(input_b);
  }, [input_b]);

  useEffect(() => {
    subscribe("onConnect_" + id + "_input_b", (e: any) => {
      data = { ...data, input_b: e.detail };
      setInput_b(data.input_b);
      animate();
    });
    subscribe("onConnect_" + id + "_input_a", (e: any) => {
      data = { ...data, input_a: e.detail };
      setInput_a(data.input_a);

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
      setCode(data.code);
      setCanSendInfo(true);
      setTimeout(() => {
        publish("onUpdate", {
          id,
          sourceHandle: "output",
          data: data.output,
        });
      }, 1000);
    });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div className="text-[8px] text-center font-[PoppinsBold]">
        <div className="mb-[-6px]">
          <span className="text-[6px]  font-[PoppinsBold]">{name}</span>
        </div>
      </div>
      <div
        className={`${
          isAnimate ? "animatecss-headShake" : ""
        } relative text-xs p-[5px] animatecss bg-pink-800 w-16 h-9 items-center flex justify-center rounded-md text-white`}
      >
        <BsCodeSquare size={16} />
        <Handle
          type="target"
          position={Position.Left}
          id={"input_a"}
          style={{
            background: "#555",
            width: 7,
            height: 7,
            top: 10,
          }}
          isConnectable={isConnectable}
        />

        <Handle
          type="target"
          position={Position.Left}
          id={"input_b"}
          style={{
            background: "#555",
            width: 7,
            height: 7,
            left: -4,
            top: 27,
          }}
          isConnectable={isConnectable}
        />

        <Handle
          type="source"
          position={Position.Right}
          id={"output"}
          style={{
            bottom: "auto",
            background: `${canSendInfo ? "#555" : "#aaa"}`,
            width: 8,
            height: 8,
          }}
          isConnectable={canSendInfo}
        />

        <div
          onDoubleClick={() => {
            if (input_a != null && input_b != null) {
              data.input_a = input_a;
              data.input_b = input_b;
              data.name = name;
              data.code = code;
              publish("onConfig", { id, type, data });
            }
          }}
          className={`absolute border border-slate-white ${
            input_a != null && input_b != null
              ? "bg-violet-50 hover:bg-[#eee]"
              : "bg-[#ccc]"
          } rounded no-drag cursor-pointer  w-5 h-4 items-center justify-center flex bottom-[-9px] right-[22px] z-1 bg-[#ddd] text-slate-800  text-[10px]`}
        >
          <TbPrompt />
        </div>
      </div>
      <div className="text-[7px] pt-1 text-center">
        {"Sql runner two entry"}
      </div>
    </div>
  );
}
