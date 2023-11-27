import { Handle, Position } from "reactflow";
import { TbPrompt } from "react-icons/tb";
import { useState, useEffect } from "react";
import { publish, subscribe } from "../../../shared/hooks/events";
import { MdPivotTableChart } from "react-icons/md";

const toSentenceCase = (camelCase: any) => {
  if (camelCase) {
    const result = camelCase.replace(/([A-Z])/g, " $1");
    return result[0].toUpperCase() + result.substring(1).toLowerCase();
  }
  return "";
};

const transpose = (
  data: any[],
  nameOfColumnToPivot: string,
  nameOfNewColumn: string
) => {
  let columnsKey = [nameOfNewColumn];
  data.forEach((row) => {
    if (!columnsKey.includes(row[nameOfColumnToPivot])) {
      columnsKey = [...columnsKey, row[nameOfColumnToPivot]];
    }
  });

  let rowsKey = Object.keys(data[0]).filter(
    (key) => key != nameOfColumnToPivot
  );

  let final = rowsKey.map((row) => {
    let value: any = {};

    columnsKey.forEach((column) => {
      if (column == nameOfNewColumn) {
        value[nameOfNewColumn] = toSentenceCase(row);
      } else {
        let arr = data.filter((d) => d[nameOfColumnToPivot] == column)[0];
        if (arr != null) {
          value[column] = arr[row];
        } else {
          value[column] = null;
        }
      }
    });

    return value;
  });

  return final;
};

export default function TranspositionNode({
  id,
  type,
  data,
  isConnectable,
}: any) {
  const [isValidate, setIsValidate] = useState(false);
  const [config, setConfig] = useState<any>();
  const [input, setInput] = useState<any>();
  const [output, setOutput] = useState<any>(data.output);
  const [canSendInfo, setCanSendInfo] = useState(output != null);
  const [name, setName] = useState("Requête " + id);
  const [code, setCode] = useState();
  const [columnToPivot, setColumnToPivot] = useState(
    data.config?.columnToPivot
  );
  const [nameOfNewPrincipaleColumn, setNameOfNewPrincipaleColumn] = useState(
    data.config?.nameOfNewPrincipaleColumn
  );

  const [isAnimate, setIsAnimate] = useState(false);

  const animate = () => {
    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 1000);
  };

  const execute = (dataInput: any) => {
    try {
      let result = transpose(
        dataInput,
        columnToPivot,
        nameOfNewPrincipaleColumn
      );
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
        nameOfNewPrincipaleColumn:
          e.detail?.dataToSend?.config?.nameOfNewPrincipaleColumn,
        columnToPivot: e.detail?.dataToSend?.config?.columnToPivot,
      };
      setOutput(data.output);
      setConfig(data.config);
      setName(data.name);
      setColumnToPivot(data.columnToPivot);
      setNameOfNewPrincipaleColumn(data.nameOfNewPrincipaleColumn);

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

  useEffect(() => {
    setInput(data.input);
    animate();
    setIsValidate(true);
    execute(data.input);
  }, [data]);

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div
        className={` ${
          isAnimate ? "animatecss-headShake" : ""
        } relative text-xs p-[5px] animatecss bg-emerald-800 w-9 h-8 items-center flex justify-center  rounded text-white`}
      >
        <MdPivotTableChart size={20} />

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
        {config?.tableSelected?.name || "Transpose"}
      </div>
    </div>
  );
}
