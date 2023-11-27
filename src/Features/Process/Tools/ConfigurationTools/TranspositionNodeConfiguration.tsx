import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import { publish } from "../../../../shared/hooks/events";

import "react-reflex/styles.css";
import { useState, useEffect, useCallback, useRef } from "react";
import Table from "../../../../shared/components/Table/Table";
import { TbPrompt } from "react-icons/tb";

import Editor from "@monaco-editor/react";
import { BsPlay } from "react-icons/bs";
import alasql from "alasql";

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

export default function TranspositionNodeConfiguration({ details }: any) {
  const [tableSelected, setTableSelected] = useState<any>();
  const [operateurSelected, setOperateurSelected] = useState<any>(null);
  const [canSave, setCanSave] = useState(false);
  const [isNameModalShow, setIsNameModalShow] = useState(false);
  const [data, setData] = useState<any>(details.data?.input);
  const [keys, setKeys] = useState(Object.keys(details?.data?.input));
  const [dataLoaded, setDataLoaded] = useState<any[]>(data);
  const [isAnimate, setIsAnimate] = useState(false);
  const [columnToPivot, setColumnToPivot] = useState("");
  const [nameOfNewPrincipaleColumn, setNameOfNewPrincipaleColumn] =
    useState("");
  const [name, setName] = useState(
    details.data?.name ?? "Requête " + details.id
  );

  const [code, setCode] = useState<any>(details.data?.code ?? "");

  const animate = () => {
    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 1000);
  };

  useEffect(() => {
    if (data.length != 0) {
      setKeys(Object.keys(data[0]));
    }
  }, []);

  const execute = () => {
    try {
      setDataLoaded(transpose(data, columnToPivot, nameOfNewPrincipaleColumn));
      animate();
      setCanSave(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = useCallback((e: any) => {
    setCode(e);
  }, []);

  const onSave = () => {
    setIsNameModalShow(true);
  };

  const saveConfig = () => {
    let config: any = {};
    config.name = name;
    config.columnToPivot = columnToPivot;
    config.nameOfNewPrincipaleColumn = nameOfNewPrincipaleColumn;

    let dataToSend: any = details.data;
    dataToSend["output"] = dataLoaded;
    dataToSend.config = config;

    publish("onSaveConfig-" + details.id, { dataToSend });
    publish("closeConfigNode", {});
  };

  return (
    <>
      <div>
        <header className="border-b border-slate-200 p-2 px-3 w-full flex flex-row items-center justify-between">
          <h3 className="text-xl flex flex-row items-center space-x-4">
            <span className="p-2 px-3 border bg-slate-700 text-white rounded-xl">
              <TbPrompt size={25} />
            </span>
            <span>Transposition d'une table</span>
          </h3>
          <div className="space-x-4">
            <button
              onClick={(e) => publish("closeConfigNode", {})}
              className="px-3 text-sm hover:bg-[#db3e3ed5] py-2 bg-red-600 text-white rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={(e) => saveConfig()}
              className={`px-3 text-sm  py-2 ${
                !canSave
                  ? "cursor-not-allowed hover:bg-slate-400 bg-slate-400"
                  : "cursor-pointer hover:bg-slate-600 bg-slate-800"
              }  text-white rounded-lg`}
            >
              Sauvegarder
            </button>
          </div>
        </header>

        <div className="w-full h-[550px] overflow-hidden flex flex-row items-start">
          <div className="items-center h-full flex flex-col w-20 bg-white border-r py-3">
            <div
              onClick={(e) => execute()}
              className={`animatecss ${
                isAnimate
                  ? "animatecss-tada bg-red-400 text-white"
                  : "text-red-400"
              } bg-white border shadow-md cursor-pointer  p-1 rounded-lg `}
            >
              <BsPlay className="text-xl" size={40} />
            </div>
          </div>
          <div className="w-full h-full">
            <ReflexContainer orientation="horizontal">
              <ReflexElement className="top-pane" minSize={70} size={200}>
                <div className="pane-content overflow-hidden p-6 w-full flex flex-col items-center  h-full bg-[#f5f5f5]">
                  <h3 className="text-xl">Les paramètres de transposition</h3>
                  <div className="flex flex-row items-center justify-center mt-10 space-x-6">
                    <select
                      onChange={(e) => setColumnToPivot(e.target.value)}
                      className="select select-bordered w-full max-w-xs "
                    >
                      <option disabled selected>
                        Sélectionner la colonne à pivoter
                      </option>
                      {keys.map((value, index) => (
                        <option key={index}>{value}</option>
                      ))}
                    </select>
                    <input
                      className="input input-bordered "
                      type="text"
                      onChange={(e) =>
                        setNameOfNewPrincipaleColumn(e.target.value)
                      }
                      placeholder="Le nom de la propriété principale"
                    />
                    <button onClick={(e) => execute()} className="btn">
                      transposer
                    </button>
                  </div>
                </div>
              </ReflexElement>

              <ReflexSplitter propagate={true} />

              <ReflexElement minSize={70} className="bottom-pane h-[500px]">
                <div className=" text-lg border-b p-3 px-4 bg-slate-800 text-white">
                  Prévisualisation
                </div>
                <div>
                  <Table data={dataLoaded} />
                </div>
              </ReflexElement>
            </ReflexContainer>
          </div>
        </div>
      </div>
      <div>
        <div className={`modal ${isNameModalShow && "modal-open"}`}>
          <div className="modal-box no-scrollBar  w-3/5 max-w-2xl">
            <div className="flex flex-row px-2 items-center justify-between">
              <h3 className="text-xl font-bold">
                Définir le nom de la requête
              </h3>
              <label
                htmlFor="my-modal-3"
                onClick={(e) => setIsNameModalShow(false)}
                className="btn btn-sm btn-circle"
              >
                ✕
              </label>
            </div>
            <div className=" mt-2 p-3">
              <form
                onSubmit={(e) => {
                  saveConfig();
                  setIsNameModalShow(false);
                  e.preventDefault();
                }}
              >
                <div className="">
                  <input
                    defaultValue={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Insérer le nom de la requête"
                    className="w-full input input-bordered"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
