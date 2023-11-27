import { publish } from "../../../../shared/hooks/events";

import "react-reflex/styles.css";
import { useState, useEffect } from "react";
import { TbPrompt } from "react-icons/tb";

export default function OutputNodeConfiguration({ details }: any) {
  const [data, setData] = useState<any>(details.data?.input);
  const [keys, setKeys] = useState(Object.keys(details?.data?.input));
  const [name, setName] = useState<any>(details?.data?.config?.name ?? "");
  const [description, setDescription] = useState<any>(
    details?.data?.config?.description ?? ""
  );
  const [typeOfRender, setTypeOfRender] = useState<any>(
    details?.data?.config?.typeOfRender ?? "simple-table"
  );

  useEffect(() => {
    setKeys(Object.keys(data[0]));
  }, []);

  const saveConfig = () => {
    let config: any = {};
    config.isDataLoaded = true;
    config.name = name;
    config.description = description;
    config.typeOfRender = typeOfRender;

    let dataToSend: any = details.data;
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
            <span>Configuration de la sortie</span>
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
                typeOfRender == null || name == null || description == null
                  ? "cursor-not-allowed hover:bg-slate-400 bg-slate-400"
                  : "cursor-pointer hover:bg-slate-600 bg-slate-800"
              }  text-white rounded-lg`}
            >
              Sauvegarder
            </button>
          </div>
        </header>

        <div className="w-full h-[550px] overflow-hidden flex flex-row items-start">
          <div className="w-full h-full">
            <div className="pane-content overflow-hidden py-8 w-full  px-20 h-full bg-[#f5f5f5]">
              <h3 className="text-2xl">Paramètres de la sortie</h3>
              <div className="flex flex-col justify-start items-start mt-6 space-y-4">
                <div className="form-control w-full max-w-xl">
                  <label className="label">
                    <span className="label-text">Le nom de cette sortie</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Le nom de la sortie"
                    className="input input-bordered w-full max-w-2xl"
                  />
                </div>
                <div className="form-control w-full max-w-xl">
                  <label className="label">
                    <span className="label-text">Type de rendu</span>
                  </label>
                  <select
                    value={typeOfRender}
                    onChange={(e) => setTypeOfRender(e.target.value)}
                    className="select select-bordered w-full max-w-xs"
                  >
                    <option disabled>
                      Quel est le type de rendu ?
                    </option>
                    <option value="simple-table">Une simple table</option>
                    <option value="pivot-table">Une pivot table</option>
                    <option value="chart-line">Un diagramme en ligne</option>
                    <option value="chart-column">Un diagramme en colonne</option>
                    <option value="chart-circular-fill">Un diagramme en cercle plein</option>
                  </select>
                </div>
                <div className="form-control w-full max-w-2xl">
                  <label className="label">
                    <span className="label-text">
                      Une description de la sortie
                    </span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Une description de la sortie"
                    className="input input-bordered w-full max-w-2xl h-28 p-3"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
