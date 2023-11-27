import { BsFolder2Open, BsGear } from "react-icons/bs";
import {
  MdOutlineMobileScreenShare,
  MdOutlineSettingsPhone,
  MdSettingsVoice,
  MdSignalCellular3Bar,
  MdSignalCellularConnectedNoInternet4Bar,
} from "react-icons/md";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import { publish } from "../../../../shared/hooks/events";

import "react-reflex/styles.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getOperateurs } from "../../../../shared/reducers/operateurs";
import Table from "../../../../shared/components/Table/Table";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { Runner } from "../../../../shared/fetchers/Axios";

export default function ArpuNodeConfiguration({ details }: any) {
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
  const [arpuType, setArpuType] = useState("voix");
  const [operateurSelected, setOperateurSelected] = useState<any>(null);
  const [canSave, setCanSave] = useState(false);
  const [dataLoaded, setDataLoaded] = useState<any[]>();

  const saveConfig = () => {
    let config: any = {};
    // config.tableSelected = tableSelected;
    config.operateur = operateurSelected;
    config.arpuType = arpuType;
    config.isDataLoaded = true;

    let dataToSend: any = details.data;
    dataToSend.output = dataLoaded;
    dataToSend.config = config;

    publish("onSaveConfig-" + details.id, { dataToSend });
    publish("closeConfigNode", {});
  };

  const getDatas = async () => {
    setSizeOfPreview(300);
    try {
      let response;

      response = await Runner.get(
        `/arpu-${arpuType}${
          operateurSelected == null
            ? ""
            : "?operateurTag=" + operateurSelected?.tag
        }`
      );

      let data = response.data;
      data = data.map((item: any) => {
        Object.keys(item).forEach((key) => {
          if (
            key.includes("total") ||
            key.includes("arpu") ||
            key.includes("month")
          )
            item[key] = parseFloat(item[key]);
        });
        if (item.trimester != null && item.month != 0) {
          item.periodType = "Mois";
          item.name = mois[parseInt(item.month) - 1];
        } else if (item.trimester != null && item.month == 0) {
          item.periodType = "Trimestre";
          item.name = item.trimester + " - " + item.year;
        } else if (item.trimester == null) {
          item.periodType = "Année";
          item.name = item.year;
        }
        return item;
      });

      setDataLoaded(data);
      setCanSave(true);
    } catch (e) {}
  };

  return (
    <div>
      <header className="border-b p-3 px-4 w-full flex flex-row items-center justify-between">
        <h3 className="text-xl flex flex-row items-center space-x-4">
          {" "}
          <BsGear size={30} /> <span>Préparation du calcul de l'A.R.P.U</span>{" "}
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
              <div className="w-full bg-[#fafafa] h-full overflow-hidden overflow-y-scroll no-scrollBar pb-10">
                {step == 1 && (
                  <div className="justify-center items-center flex-col flex ">
                    <h3 className="text-center text-xl p-3 bg-[#fefefe] border-b w-full">
                      Choix du type d'A.R.P.U
                    </h3>

                    <div className="grid grid-cols-3 gap-10 select-none px-20 pt-8 w-full mt-8">
                      <div
                        onClick={(e) => {
                          setArpuType("voix");
                          setStep(2);
                          // setTimeout(() => setStep(2), 1000);
                        }}
                        className={`border rounded-lg ${
                          arpuType == "voix"
                            ? "bg-[#fff] border-[#0099cc]"
                            : "bg-[#fcfcfc]"
                        }  text-slate-800 border-[#e5e9f0]`}
                      >
                        <div className="clear-both cursor-pointer overflow-hidden text-ellipsis flex flex-col items-center space-y-4 py-8 px-4">
                          <MdSettingsVoice className="text-7xl text-slate-800" />
                          <p className="text-ellipsis text-sm">ARPU voix</p>
                        </div>
                      </div>
                      <div
                        onClick={(e) => {
                          setArpuType("internet-mobile");
                          setStep(2);
                          // setTimeout(() => setStep(2), 1000);
                        }}
                        className={`border rounded-lg cursor-pointer ${
                          arpuType == "internet-mobile"
                            ? "bg-[#fff] border-[#0099cc]"
                            : "bg-[#fcfcfc]"
                        }  text-slate-800 border-[#e5e9f0]`}
                      >
                        <div className="clear-both cursor-pointer overflow-hidden text-ellipsis flex flex-col items-center space-y-4 py-8 px-4">
                          <MdSignalCellular3Bar className="text-7xl text-slate-800" />
                          <p className="text-ellipsis text-sm">
                            ARPU Internet Mobile
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={(e) => {
                          setArpuType("mobile-money");
                          setTimeout(() => setStep(2), 1000);
                        }}
                        className={`border rounded-lg  cursor-pointer ${
                          arpuType == "mobile-money"
                            ? "bg-[#fff] border-[#0099cc]"
                            : "bg-[#fcfcfc]"
                        }  text-slate-800 border-[#e5e9f0]`}
                      >
                        <div className="clear-both cursor-pointer overflow-hidden text-ellipsis flex flex-col items-center space-y-4 py-8 px-4">
                          <MdOutlineMobileScreenShare className="text-7xl text-slate-800" />
                          <p className="text-ellipsis text-sm">
                            ARPU Mobile Money
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={(e) => {
                          setArpuType("global");
                          setTimeout(() => setStep(2), 1000);
                        }}
                        className={`border rounded-lg   ${
                          arpuType == "global"
                            ? "bg-[#fff] border-[#0099cc]"
                            : "bg-[#fcfcfc]"
                        }  text-slate-800 border-[#e5e9f0]`}
                      >
                        <div className="clear-both cursor-pointer overflow-hidden text-ellipsis flex flex-col items-center space-y-4 py-8 px-4">
                          <HiOutlineGlobeAlt className="text-7xl text-slate-800" />
                          <p className="text-ellipsis text-sm">ARPU Global</p>
                        </div>
                      </div>
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
                            Type
                          </p>
                          {arpuType == "voix" && (
                            <>
                              <MdSettingsVoice className="text-5xl text-slate-800" />
                              <p className="text-ellipsis text-sm">Arpu voix</p>
                            </>
                          )}
                          {arpuType == "internet-mobile" && (
                            <>
                              <MdSignalCellular3Bar className="text-5xl text-slate-800" />
                              <p className="text-ellipsis text-sm">
                                Arpu Internet Mobile
                              </p>
                            </>
                          )}
                          {arpuType == "mobile-money" && (
                            <>
                              <MdOutlineMobileScreenShare className="text-5xl text-slate-800" />
                              <p className="text-ellipsis text-sm">
                                Arpu Mobile Money
                              </p>
                            </>
                          )}

                          {arpuType == "global" && (
                            <>
                              <HiOutlineGlobeAlt className="text-5xl text-slate-800" />
                              <p className="text-ellipsis text-sm">
                                Arpu Global
                              </p>
                            </>
                          )}
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
