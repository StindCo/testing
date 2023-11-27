import { BsFolder2Open, BsGear } from "react-icons/bs";
import { MdOutlineSettingsPhone } from "react-icons/md";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import { publish } from "../../../../shared/hooks/events";

import "react-reflex/styles.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getOperateurs } from "../../../../shared/reducers/operateurs";
import { getSchema } from "../../../../shared/reducers/schema";
import {
  loadData,
  loadDataFromOperateur,
} from "../../../DataTool/services/ImportationService";
import Table from "../../../../shared/components/Table/Table";
import { ProjectManager } from "../../../../shared/fetchers/Axios";

export default function ImportProcessNodeConfiguration({ details }: any) {
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

  let operateurs: any = useSelector(getOperateurs);
  const [step, setStep] = useState(1);
  const [sizeOfPreview, setSizeOfPreview] = useState(70);
  let [dataSchema, setDataSchema] = useState<any>([]);
  const [tableSelected, setTableSelected] = useState<any>();
  let [dataSchemaFilter, setDataSchemaFilter] = useState([]);
  const [operateurSelected, setOperateurSelected] = useState<any>(null);
  const [canSave, setCanSave] = useState(false);
  const [dataLoaded, setDataLoaded] = useState<any[]>();

  useEffect(() => {
    ProjectManager.get("/process").then(({ data }) => {
      setDataSchema(data);
      setDataSchemaFilter(data);
    });
  }, []);

  const saveConfig = () => {
    let config: any = {};
    config.tableSelected = tableSelected;
    config.operateur = operateurSelected;
    config.isDataLoaded = true;

    let dataToSend: any = details.data;
    dataToSend.output = dataLoaded;
    dataToSend.config = config;

    publish("onSaveConfig-" + details.id, { dataToSend });
    publish("closeConfigNode", {});
  };

  const filterSchema = (e: any) => {
    setDataSchemaFilter(
      dataSchema.filter((table: any) => {
        return (
          table.label.includes(e.target.value) ||
          table.label.toLowerCase().includes(e.target.value)
        );
      })
    );
  };

  const getDatas = async () => {};

  return (
    <div>
      <header className="border-b p-3 px-4 w-full flex flex-row items-center justify-between">
        <h3 className="text-xl flex flex-row items-center space-x-4">
          {" "}
          <BsGear size={30} /> <span>Configuration de l'outil</span>{" "}
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

      <div className="w-full h-[550px]">
        <ReflexContainer orientation="horizontal">
          <ReflexElement className="top-pane">
            <div className="pane-content overflow-hidden flex flex-row items-start h-full pl-5 ">
              <div className="items-center h-full flex flex-col pt-36">
                <ul className="steps steps-vertical">
                  <li
                    onClick={(e) => {
                      if (step >= 1) setStep(1);
                    }}
                    className={`step  cursor-pointer ${
                      step >= 1 ? "step-primary" : ""
                    }`}
                  ></li>
                  <li
                    onClick={(e) => {
                      if (step >= 2) setStep(2);
                    }}
                    className={`step  cursor-pointer ${
                      step >= 2 ? "step-primary" : ""
                    }`}
                  ></li>
                  <li
                    onClick={(e) => {
                      if (step >= 3) setStep(3);
                    }}
                    className={`step  cursor-pointer ${
                      step >= 3 ? "step-primary" : ""
                    }`}
                  ></li>
                </ul>
              </div>
              <div className="w-full bg-[#fafafa] h-full overflow-hidden overflow-y-scroll no-scrollBar">
                {step == 1 && (
                  <div
                    className="justify-center items-center flex-col flex "
                    id="choixSchema"
                  >
                    <h3 className="text-center text-xl mt-5">
                      Choix du process
                    </h3>
                    <input
                      onChange={(e) => filterSchema(e)}
                      type="text"
                      placeholder="Rechercher un modèle de traitement"
                      className="input input-bordered max-w-xs input-sm bg-[#fafafa] mt-5"
                    />
                    <div className="grid grid-cols-3 gap-14 w-3/4 select-none p-8">
                      {dataSchemaFilter.map((value: any, index: any) => (
                        <div
                          onClick={(e) => {
                            setTableSelected(value);
                            setTimeout(() => setStep(2), 1000);
                          }}
                          key={index}
                          className={`border rounded-lg ${
                            tableSelected?.label == value?.label
                              ? "bg-[#fff] border-[#0099cc]"
                              : "bg-[#fcfcfc]"
                          }  text-slate-800 border-[#e5e9f0]`}
                        >
                          <div className="clear-both cursor-pointer overflow-hidden text-ellipsis flex flex-col items-center space-y-4 py-8 px-4">
                            <BsFolder2Open className="text-7xl text-slate-800" />
                            <p className="text-ellipsis text-sm">
                              {value.label}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step == 2 && (
                  <div className="justify-center items-center flex-col flex ">
                    <h3 className="text-center text-xl p-3 bg-[#fefefe] border-b w-full">
                      Choix de l'operateur
                    </h3>

                    <div className="grid grid-cols-4 gap-10 select-none px-20 pt-8 w-full mt-8">
                      {operateurs.map((value: any, index: any) => (
                        <div
                          onClick={(e) => {
                            setOperateurSelected(value);
                            setTimeout(() => setStep(3), 1000);
                          }}
                          key={index}
                          className={`border rounded-lg ${
                            operateurSelected?.tag == value?.tag
                              ? "bg-[#fff] border-[#0099cc]"
                              : "bg-[#fcfcfc]"
                          }  text-slate-800 border-[#e5e9f0]`}
                        >
                          <div className="clear-both cursor-pointer overflow-hidden text-ellipsis flex flex-col items-center space-y-4 py-8 px-4">
                            <MdOutlineSettingsPhone className="text-7xl text-slate-800" />
                            <p className="text-ellipsis text-sm">
                              {value.name}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div
                        onClick={(e) => {
                          setOperateurSelected(null);
                          setTimeout(() => setStep(3), 1000);
                        }}
                        className={`border rounded-lg ${
                          operateurSelected == null
                            ? "bg-[#fff] border-[#0099cc]"
                            : "bg-[#fcfcfc]"
                        }  text-slate-800 border-[#e5e9f0]`}
                      >
                        <div className="clear-both cursor-pointer overflow-hidden text-ellipsis flex flex-col items-center space-y-4 py-8 px-4">
                          <MdOutlineSettingsPhone className="text-7xl text-slate-800" />
                          <p className="text-ellipsis text-sm">Tous réseaux</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step == 3 && (
                  <div
                    className="justify-center items-start flex-col flex px-14 py-14"
                    id="choixSchema"
                  >
                    <h2 className="text-2xl">
                      Lancement du téléchargement des données
                    </h2>
                    <div className="grid w-full grid-cols-3 gap-10 mt-6 p-6">
                      <div
                        className={`border rounded-lg  bg-[#fcfcfc]  text-slate-800 border-[#e5e9f0]`}
                      >
                        <div className="clear-both cursor-pointer overflow-hidden text-ellipsis flex flex-col items-center space-y-4 py-8 px-4">
                          <p className="text-ellipsis text-lg font-[PoppinsBold]">
                            Table
                          </p>
                          <BsFolder2Open className="text-5xl text-slate-800" />
                          <p className="text-ellipsis text-sm">
                            {tableSelected?.name}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`border rounded-lg  bg-[#fcfcfc]  text-slate-800 border-[#e5e9f0]`}
                      >
                        <div className="clear-both cursor-pointer overflow-hidden text-ellipsis flex flex-col items-center space-y-4 py-8 px-4">
                          <p className="text-ellipsis text-lg font-[PoppinsBold]">
                            Opérateur
                          </p>
                          <MdOutlineSettingsPhone className="text-5xl text-slate-800" />
                          <p className="text-ellipsis text-sm">
                            {operateurSelected == null
                              ? "Tous Réseaux"
                              : operateurSelected?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => getDatas()}
                      className="px-28 py-3 btn mt-6 ml-6"
                    >
                      Executer le chargement des données
                    </button>
                  </div>
                )}
              </div>
            </div>
          </ReflexElement>

          <ReflexSplitter propagate={true} />

          <ReflexElement
            minSize={70}
            size={sizeOfPreview}
            className="bottom-pane h-[300px]"
          >
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
  );
}
