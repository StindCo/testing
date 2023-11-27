import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import GridLayout from "react-grid-layout";
import "../styles/grid.css";
import "react-reflex/styles.css";
import { CombSpinner } from "react-spinners-kit";
import "/node_modules/react-resizable/css/styles.css";
import projet1 from "../../../assets/images/projet1.jpg";
import projet2 from "../../../assets/images/projet2.jpg";
import bannerImage from "../../../assets/images/workspace.svg";
import projet3 from "../../../assets/images/projet3.jpg";
import {
  BsArrowLeft,
  BsArrowRight,
  BsNewspaper,
  BsPlus,
  BsPlusCircle,
  BsShare,
  BsTools,
} from "react-icons/bs";
import { PatternsContext } from "../../Dashboard/PatternsContext";
import { ProjectManager } from "../../../shared/fetchers/Axios";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import { FallingLines, ProgressBar } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { getUser } from "../../../shared/reducers/login";
import ProcessRunner from "./ProcessRunner";
import React from "react";
import { publish } from "../../../shared/hooks/events";

type Props = {
  width: number;
};

function generatePeriodParams(periodArray: any) {
  let params: any = {};
  periodArray.forEach((item: any, index: number) => {
    let prefix = "p" + (index + 1);
    params[prefix + "name"] = item.trimester + " - " + item.year;
    params[prefix + "year"] = item.year;
    params[prefix + "trimester"] = item.trimester;
    if (item.trimester == "T1") {
      params[prefix + "firstMonth"] = "Janvier";
      params[prefix + "secondMonth"] = "Février";
      params[prefix + "lastMonth"] = "Mars";
    } else if (item.trimester == "T2") {
      params[prefix + "firstMonth"] = "Avril";
      params[prefix + "secondMonth"] = "Mai";
      params[prefix + "lastMonth"] = "Juin";
    } else if (item.trimester == "T3") {
      params[prefix + "firstMonth"] = "Juillet";
      params[prefix + "secondMonth"] = "Aôut";
      params[prefix + "lastMonth"] = "Septembre";
    } else if (item.trimester == "T4") {
      params[prefix + "firstMonth"] = "Octobre";
      params[prefix + "secondMonth"] = "Novembre";
      params[prefix + "lastMonth"] = "Décembre";
    }
  });
  return params;
}

function generateVars(item: any, index: number) {
  let params: any = {};
  let prefix = "p" + index;
  params[prefix + "name"] = item.trimester + " - " + item.year;
  params[prefix + "year"] = item.year;
  params[prefix + "trimester"] = item.trimester;
  if (item.trimester == "T1") {
    params[prefix + "firstMonth"] = "Janvier";
    params[prefix + "secondMonth"] = "Février";
    params[prefix + "lastMonth"] = "Mars";
  } else if (item.trimester == "T2") {
    params[prefix + "firstMonth"] = "Avril";
    params[prefix + "secondMonth"] = "Mai";
    params[prefix + "lastMonth"] = "Juin";
  } else if (item.trimester == "T3") {
    params[prefix + "firstMonth"] = "Juillet";
    params[prefix + "secondMonth"] = "Aôut";
    params[prefix + "lastMonth"] = "Septembre";
  } else if (item.trimester == "T4") {
    params[prefix + "firstMonth"] = "Octobre";
    params[prefix + "secondMonth"] = "Novembre";
    params[prefix + "lastMonth"] = "Décembre";
  }
  return params;
}

function generateLastPeriod(item: any) {
  let newItem: any = { ...item };
  if (newItem.trimester == "T1") {
    newItem.year = newItem.year - 1;
    newItem.trimester = "T4";
  } else if (newItem.trimester == "T2") {
    newItem.trimester = "T1";
  } else if (newItem.trimester == "T3") {
    newItem.trimester = "T2";
  } else if (newItem.trimester == "T4") {
    newItem.trimester = "T3";
  }

  return { ...newItem };
}

const hexCharacters = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];

function getCharacter(index: number) {
  return hexCharacters[index];
}

function generateNewColor() {
  let hexColorRep = "#";

  for (let index = 0; index < 6; index++) {
    const randomPosition = Math.floor(Math.random() * hexCharacters.length);
    hexColorRep += getCharacter(randomPosition);
  }

  return hexColorRep;
}

export const RunningContext: any = React.createContext({});

export default function CreateProject({ width }: Props) {
  let userLogged: any = useSelector(getUser).user;
  const [step, setStep] = useState(1);
  const [periodParams, setPeriodParams] = useState<any>([]);
  const [typeAnalyse, setTypeAnalyse] = useState(1);
  const [params, setParams] = useState<any>({});
  const [resume, setResume] = useState("");
  const [name, setName] = useState("");
  const [paramsKey, setParamsKey] = useState([""]);
  const [firstYearPeriod, setFirstYearPeriod] = useState<number>();
  const [firstTrimesterPeriod, setFirstTrimesterPeriod] = useState<string>();
  const [secondYearPeriod, setSecondYearPeriod] = useState<number>();
  const [secondTrimesterPeriod, setSecondTrimesterPeriod] = useState<string>();
  const [phaseName, setPhaseName] = useState<any>("Default phase of project !");

  const processList: any[] = useContext(PatternsContext);
  const [projetSaved, setProjetSaved] = useState();
  const [processesSelected, setProcessesSelected] = useState<any>([]);
  const [processToShow, setProcessToShow] = useState(processList);
  const [canRun, setCanRun] = useState(false);

  const createProjet: any = () => {
    setPhaseName("Création du projet");
    let envars = JSON.stringify(params);

    ProjectManager.post("/projets", {
      name,
      resume,
      colorRef: generateNewColor(),
      envars,
      type: typeAnalyse,
      typeAnalyse,
      createdBy: userLogged,
    }).then((response: any) => {
      setTimeout(() => {
        setPhaseName("Lancement d'execution des modèles de traitement");
        setProjetSaved(response.data);

        processesSelected.forEach((process: any) => {
          setTimeout(() => {
            publish("launchRunner" + process.id, {});
          }, 500);
        });
        // setCanRun(true);
        // if (processesSelected[0] != null) addProcesses(0, response.data);
      }, 300);
    });
  };

  const onChangeFilterInput = (text: string) => {
    setProcessToShow(
      processList.filter((value: any) =>
        value.label.toLowerCase().includes(text)
      )
    );
  };

  const isProcessSelected = (process: any) => {
    // console.log(Process)
    return processesSelected.filter((p: any) => p.id == process.id).length != 0;
  };

  const toggleProcessInSelection = (process: any) => {
    if (processesSelected.filter((p: any) => p.id == process.id).length == 0) {
      setProcessesSelected((p: any) => [...p, process]);
    } else {
      setProcessesSelected((p: any) =>
        p.filter((p: any) => p.id != process.id)
      );
    }

    // console.log(processesSelected);
  };

  const generateSecondPeriodVars = () => {
    let firstPeriod = {};
    let secondPeriod = {};
    if (typeAnalyse == 1) {
      secondPeriod = {
        year: secondYearPeriod,
        trimester: secondTrimesterPeriod,
      };
      firstPeriod = generateLastPeriod(secondPeriod);
      let paramsUpdated = {
        ...params,
        ...generateVars(firstPeriod, 1),
        ...generateVars(secondPeriod, 2),
      };
      setParamsKey(Object.keys(paramsUpdated));
      setParams(paramsUpdated);
    }

    // console.log(generateVars(secondPeriod, 2));
  };

  const generateTwoPeriodVars = () => {
    let firstPeriod = {};
    let secondPeriod = {};
    if (typeAnalyse == 2) {
      secondPeriod = {
        year: secondYearPeriod,
        trimester: secondTrimesterPeriod,
      };

      firstPeriod = {year: firstYearPeriod, trimester: firstTrimesterPeriod };

      let paramsUpdated = {
        ...params,
        ...generateVars(firstPeriod, 1),
        ...generateVars(secondPeriod, 2),
      };
      console.log(paramsUpdated);
      setParamsKey(Object.keys(paramsUpdated));
      setParams(paramsUpdated);
    }

    // console.log(generateVars(secondPeriod, 2));
  };

  useEffect(() => {
    ProjectManager.get("/process").then(({ data }) => {
      setProcessToShow(data);
    });
  }, [userLogged]);

  return (
    <div className="pane-content overflow-hidden truncate w-full h-full flex flex-col justify-between">
      <div className="p-5 py-4 h-full">
        <header className="border-b truncate rounded p-3 flex  items-center justify-between">
          <div className="flex items-center space-x-5">
            <BsTools size={40} />
            <div>
              <h1 className="text-xl">Nouveau projet</h1>
              <h4 className="text-gray-700 text-xs mt-1">
                Un utilitaire pour créer et générer des projets en toute
                simplicité.
              </h4>
            </div>
          </div>
        </header>
        <div className="relative w-full overflow-hidden flex flex-row  justify-center items-center h-full pl-3 ">
          <div className="items-center h-full flex flex-col pt-32">
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
              <li
                onClick={(e) => {
                  if (step >= 4) setStep(4);
                }}
                className={`step  cursor-pointer ${
                  step >= 4 ? "step-primary" : ""
                }`}
              ></li>
              <li
                onClick={(e) => {
                  if (step >= 5) setStep(5);
                }}
                className={`step  cursor-pointer ${
                  step >= 5 ? "step-primary" : ""
                }`}
              ></li>
            </ul>
          </div>
          <div className="w-full  h-full overflow-hidden overflow-y-scroll no-scrollBar p-8 ">
            {step == 1 && (
              <div className="flex flex-row items-center justify-between w-full">
                <div className="w-2/4">
                  <div>
                    <h3 className="py-5 text-2xl">
                      Quel est le nom du projet ?
                    </h3>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ex: Rapport observatoire de marché T4 2022"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="pt-8">
                    <h3 className="py-5 text-2xl">
                      En quelques lignes, de quoi s'agit-il ?
                    </h3>
                    <textarea
                      rows={6}
                      value={resume}
                      onChange={(e) => setResume(e.target.value)}
                      className="textarea textarea-bordered w-full"
                      placeholder="Ecrivez le résumé "
                    ></textarea>
                  </div>
                  <div className="pt-8">
                    <button
                      onClick={() => setStep(2)}
                      className="btn w-48 rounded-lg flex space-x-8"
                    >
                      Suivant
                      <BsArrowRight className="" />
                    </button>
                  </div>
                </div>
                <div className="w-2/4 flex items-center justify-center">
                  <img src={projet1} className="w-4/5" />
                </div>
              </div>
            )}
            {step == 2 && (
              <div className="flex flex-row items-center justify-between w-full">
                <div className="w-2/4">
                  <div>
                    <h3 className="py-5 text-3xl">
                      Quel type d'analyse, faites-vous ?
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-8 my-3 ">
                    <div
                      onClick={() => setTypeAnalyse(1)}
                      className={`${
                        typeAnalyse == 1
                          ? "scale-[1.15]  shadow-lg font-[PoppinsBold] text-slate-800"
                          : ""
                      } bg-[#eee]  ease-in duration-200  border-2 rounded-lg h-36 p-5 flex items-center justify-center cursor-pointer `}
                    >
                      <h3 className="text-2xl">Chronologique</h3>
                    </div>
                    <div
                      onClick={() => setTypeAnalyse(2)}
                      className={`bg-[#eee] ${
                        typeAnalyse == 2
                          ? "scale-[1.15] shadow-lg   font-[PoppinsBold] text-slate-800"
                          : ""
                      } border-2  rounded-lg h-36 p-5 ease-in duration-200 flex items-center justify-center cursor-pointer`}
                    >
                      <h3 className="text-2xl">Comparative</h3>
                    </div>
                    <div
                      onClick={() => setTypeAnalyse(3)}
                      className={`${
                        typeAnalyse == 3
                          ? "scale-[1.15]  shadow-lg font-[PoppinsBold] text-slate-800"
                          : ""
                      } bg-[#eee] border-2  rounded-lg h-36 p-5 ease-in duration-200 flex items-center justify-center cursor-pointer`}
                    >
                      <h3 className="text-2xl">Prédictive</h3>
                    </div>
                    <div
                      onClick={() => setTypeAnalyse(4)}
                      className={`${
                        typeAnalyse == 4
                          ? "scale-[1.15]  shadow-lg font-[PoppinsBold] text-slate-800"
                          : ""
                      } bg-[#eee] border-2  rounded-lg h-36 p-5 ease-in duration-200  flex items-center justify-center cursor-pointer`}
                    >
                      <h3 className="text-2xl">Autres</h3>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => setStep(3)}
                      className="btn w-48 rounded-lg flex space-x-8"
                    >
                      Suivant
                      <BsArrowRight className="" />
                    </button>
                  </div>
                </div>
                <div className="w-2/4 flex items-center justify-center">
                  <img src={projet2} className="w-4/5" />
                </div>
              </div>
            )}

            {step == 3 && (
              <div className="justify-between w-full">
                <div className="py-2 w-full">
                  <h3 className=" text-2xl flex flex-row justify-between items-center">
                    <span>Quels sont les modèles qui seront compilés ?</span>
                    <button
                      onClick={() => setStep(4)}
                      className="btn w-48 rounded-lg flex space-x-8"
                    >
                      Suivant
                      <BsArrowRight className="" />
                    </button>
                  </h3>
                  <input
                    type="text"
                    placeholder="Rechercher un modèle"
                    defaultValue={""}
                    onChange={(e) => onChangeFilterInput(e.target.value)}
                    className="input input-bordered rounded-sm mt-3  w-full"
                  />
                </div>
                <div className="grid grid-cols-3 break-all gap-8 p-4 pb-28">
                  {processToShow.map((value) => (
                    <div
                      key={Math.random()}
                      onClick={() => toggleProcessInSelection(value)}
                      className={` ${
                        processesSelected.filter((p: any) => p.id == value.id)
                          .length != 0
                          ? "border-blue-500"
                          : ""
                      } bg-[#fafafa] cursor-pointer rounded-lg  border-2 w-full  flex flex-col items-center justify-center  h-52 p-1 text-center`}
                    >
                      <div className="w-full break-all ">
                        <h3 className="text-lg p-4 w-full truncate font-[PoppinsBold]">
                          {value.label}
                        </h3>
                        <h5 className="text-sm">
                          {" "}
                          {value.createdBy.username}{" "}
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step == 4 && (
              <div className="justify-between w-full">
                <div className="py-1 w-full">
                  <h3 className=" text-2xl flex flex-row justify-between items-center">
                    <span>Définition des variables d'environnement.</span>
                    <button
                      onClick={() => {
                        setStep(5);
                        if(typeAnalyse == 1) generateSecondPeriodVars();
                        if(typeAnalyse == 2) generateTwoPeriodVars();

                        createProjet();
                      }}
                      className="btn w-48 rounded-lg flex space-x-8"
                    >
                      Suivant
                      <BsArrowRight className="" />
                    </button>
                  </h3>
                </div>
                <div className="w-full h-screen mt-5">
                  <ReflexContainer orientation="vertical">
                    <ReflexElement className="left-pane">
                      <div className="pane-content">
                        <h1 className="font-[PoppinsBold] text-lg">
                          Variables Temporelles
                        </h1>
                        <hr />

                        <div className="p-3">
                          <div className="flex flex-row items-center justify-between w-full">
                            <div className="w-2/4 p-2">
                              {(typeAnalyse == 1 || typeAnalyse == 3) && (
                                <div className="flex items-center justify-center">
                                  <img src={projet3} className="w-4/5" />
                                </div>
                              )}
                              {!(typeAnalyse == 1 || typeAnalyse == 3) && (
                                <div>
                                  <div className="w-14 mb-5 rounded-full h-14 text-lg bg-slate-800 mx-auto  text-white flex items-center justify-center">
                                    1
                                  </div>
                                  <div>
                                    <h3 className="py-2 text-lg">
                                      Quelle année ?
                                    </h3>
                                    <input
                                      onChange={(e) =>
                                        setFirstYearPeriod(
                                          parseInt(e.target.value)
                                        )
                                      }
                                      value={firstYearPeriod}
                                      type="number"
                                      min="1900"
                                      max="2099"
                                      step="1"
                                      placeholder="inserez l'année"
                                      className="input input-bordered w-full"
                                    />
                                  </div>

                                  <div className="pt-3">
                                    <h3 className="py-2 text-lg">
                                      Quel trimestre ?
                                    </h3>
                                    <select
                                      value={firstTrimesterPeriod}
                                      onChange={(e) =>
                                        setFirstTrimesterPeriod(e.target.value)
                                      }
                                      className="select select-bordered w-full max-w-xs"
                                    >
                                      <option disabled selected>
                                        choisir un trimestre
                                      </option>
                                      <option value="T1">
                                        Premier trimestre
                                      </option>
                                      <option value="T2">
                                        Second trimestre
                                      </option>
                                      <option value="T3">
                                        Troisième trimestre
                                      </option>
                                      <option value="T4">
                                        Quatrième trimestre
                                      </option>
                                    </select>
                                  </div>

                                </div>
                              )}
                            </div>
                            <div className="w-2/4 p-2 ">
                              <div className="flex items-center justify-center">
                                {/* <img src={projet1} className="w-4/5" /> */}
                              </div>
                              <div>
                                <div className="w-14 mb-5 rounded-full h-14 text-lg bg-slate-800 mx-auto  text-white flex items-center justify-center">
                                  2
                                </div>
                                <div>
                                  <h3 className="py-2 text-lg">
                                    Quelle année ?
                                  </h3>
                                  <input
                                    onChange={(e) =>
                                      setSecondYearPeriod(
                                        parseInt(e.target.value)
                                      )
                                    }
                                    value={secondYearPeriod}
                                    type="number"
                                    min="1900"
                                    max="2099"
                                    step="1"
                                    placeholder="inserez l'année"
                                    className="input input-bordered w-full"
                                  />
                                </div>

                                <div className="pt-3">
                                  <h3 className="py-2 text-lg">
                                    Quel trimestre ?
                                  </h3>
                                  <select
                                    onChange={(e) =>
                                      setSecondTrimesterPeriod(e.target.value)
                                    }
                                    value={secondTrimesterPeriod}
                                    className="select select-bordered w-full max-w-xs"
                                  >
                                    <option disabled selected>
                                      choisir un trimestre
                                    </option>
                                    <option value="T1">
                                      Premier trimestre
                                    </option>
                                    <option value="T2">Second trimestre</option>
                                    <option value="T3">
                                      Troisième trimestre
                                    </option>
                                    <option value="T4">
                                      Quatrième trimestre
                                    </option>
                                  </select>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ReflexElement>

                    <ReflexSplitter />

                    <ReflexElement className="right-pane" size={30}>
                      <div className="pane-content px-2">
                        <h1 className="font-[PoppinsBold] text-lg">
                          Tous les variables
                        </h1>
                        <hr />
                        <div className="h-full truncate w-full items-start mt-8">
                          <div className="px-3 w-full m-auto">
                            <div className="flex flex-row w-full  pb-1 text-sm">
                              <p className="w-1/2 text-center">Clé</p>
                              <p className="w-1/2 text-center">Valeur</p>
                            </div>
                            {paramsKey.map((value: any, index: number) => (
                              <div
                                key={Math.random()}
                                className="flex pl-2 w-full text-center space-x-4 flex-row items-center justify-around py-2"
                              >
                                <input
                                  type="text"
                                  defaultValue={value}
                                  onChange={(e) => {
                                    setParamsKey((params: any) => {
                                      params[index] = e.target.value;
                                      return params;
                                    });
                                  }}
                                  className="input bg-[#fcfcfc] text-center rounded-lg w-1/2 input-bordered input-sm"
                                />
                                <input
                                  type="text"
                                  defaultValue={params[paramsKey[index]]}
                                  onChange={(e) => {
                                    setParams((params: any) => {
                                      params[paramsKey[index]] = e.target.value;
                                      return params;
                                    });
                                  }}
                                  className="input bg-[#fcfcfc] rounded-lg text-center  w-1/2 input-bordered input-sm"
                                />
                                <hr />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ReflexElement>
                  </ReflexContainer>
                </div>
              </div>
            )}

            {step == 5 && (
              <div className="overflow-hidden h-full">
                <div className=" shadow-lg overflow-hidden flex flex-row items-center justify-between border w-full h-[300px] rounded-lg p-16  font-[PoppinsBold]">
                  <div className="w-2/5 text-ellipsis space-y-6">
                    <h1 className="text-5xl w-1/6">
                      Prenez <br /> votre café en paix.
                    </h1>
                    <h1 className="text-xl ">
                      Nous prenons les choses <br /> en main.
                    </h1>
                  </div>
                  <div className="w-1/2 h-[155px] mt-[-190px] mr-[-8%]">
                    <img src={bannerImage} className="w-full  h-auto" />
                  </div>
                </div>
                <div className="text-center p-8 mt-3 h-screen no-scrollBar pb-[500px] overflow-y-scroll">
                  <h1 className="font-[PoppinsBold] mb-6">{phaseName}</h1>
                  <RunningContext.Provider value={canRun}>
                    {processesSelected.map((process: any, index: number) => (
                      <ProcessRunner
                        project={projetSaved}
                        paramsInput={params}
                        key={Math.random()}
                        process={process}
                      />
                    ))}
                  </RunningContext.Provider>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
