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
export default function ResultNode({ id, type, data, isConnectable }: any) {
  const [isValidate, setIsValidate] = useState((data.input != null));
  const [canSendInfo, setCanSendInfo] = useState(false);
  const [config, setConfig] = useState<any>(data.config);
  const [input, setInput] = useState<any>(data.input);
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


  }, []);

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div className={`${
          isAnimate ? "animatecss-tada" : ""
        } relative text-xs animatecss p-[5px] bg-yellow-600 w-8 h-8 items-center flex justify-center  rounded-full text-white`}>
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


      </div>
      <div className="text-[7px] text-center w-28">
          Résultat
      </div>
    </div>
  );
}
