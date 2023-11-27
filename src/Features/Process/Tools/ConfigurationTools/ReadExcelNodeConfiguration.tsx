import { BsCalendar2Plus, BsFolder2Open, BsGear } from "react-icons/bs";
import { MdOutlineSettingsPhone } from "react-icons/md";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import { publish } from "../../../../shared/hooks/events";
import { read, utils } from "xlsx";

import "react-reflex/styles.css";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { getOperateurs } from "../../../../shared/reducers/operateurs";
import { getSchema } from "../../../../shared/reducers/schema";
import {
  loadData,
  loadDataFromOperateur,
} from "../../../DataTool/services/ImportationService";
import Table from "../../../../shared/components/Table/Table";
import Dropzone, { useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  FlexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 80,
  border: "1px dashed #aaa",
  borderWidth: 4,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function ReadExcelNodeConfiguration({ details }: any) {
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
  let dataSchema = useSelector(getSchema);
  const [tableSelected, setTableSelected] = useState<any>();
  let [dataSchemaFilter, setDataSchemaFilter] = useState([]);
  const [operateurSelected, setOperateurSelected] = useState<any>(null);
  const [canSave, setCanSave] = useState(false);
  const [dataLoaded, setDataLoaded] = useState<any[]>();

  const [file, setFile] = useState<any>();
  const [fileData, setFileData] = useState<any>();
  const [fileName, setFileName] = useState<any>();
  const [sheetName, setSheetName] = useState<any>();
  const [arrayData, setArrayData] = useState<any>();
  const [headerRowIndex, setHeaderRowIndex] = useState<any>(0);
  const [headerRow, setHeaderRow] = useState<any>();

  useEffect(() => {
    setDataSchemaFilter(dataSchema);
  }, [dataSchema]);

  const loadFileData = async () => {
    const data = await file.arrayBuffer();
    /* data is an ArrayBuffer */
    const workbook = read(data);
    setFileName(file?.name);
    setFileData(workbook);
    setStep(2);
  };

  const convertDataToArray = () => {
    let aoa = utils.sheet_to_json(fileData.Sheets[sheetName], {
      header: 1,
    });

    setArrayData(aoa);
    setHeaderRow(aoa[headerRowIndex]);

    setStep(3);
  };
  const convertData = () => {
    let data: any = arrayData
      .filter((value: any, index: number) => index != headerRowIndex)
      .map((value: any, index: number) => {
        let newValue: any = {};
        newValue["depRef"] = index + 1;
        value.map((indexValue: any, i: number) => {
          newValue[headerRow[i]] = indexValue;
        });
        return newValue;
      });
    setDataLoaded(data);
    setCanSave(true);
  };

  useEffect(() => {
    if (file != null) {
      loadFileData();
    }
  }, [file]);

  const saveConfig = () => {
    let config: any = {};
    config.headerRow = headerRow;
    config.sheetName = sheetName;
    config.fileName = fileName;
    config.headerRowIndex = headerRowIndex;
    config.isDataLoaded = true;

    let dataToSend: any = details.data;
    dataToSend.output = dataLoaded;
    dataToSend.config = config;

    publish("onSaveConfig-" + details.id, { dataToSend });
    publish("closeConfigNode", {});
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone();

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const onDrop: any = (files: any) => {
    setFile(files[0]);
  };

  return (
    <div>
      <header className="border-b p-3 px-4 w-full flex flex-row items-center justify-between">
        <h3 className="text-xl flex flex-row items-center space-x-4">
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
                      Importer le fichier
                    </h3>

                    <div className="p-10 px-24 w-full">
                      <Dropzone onDrop={onDrop}>
                        {({ getRootProps, getInputProps }) => (
                          <section className="container">
                            <div {...getRootProps({ style })}>
                              <input {...getInputProps()} />
                              <p>
                                Drag 'n' drop some files here, or click to
                                select files
                              </p>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </div>
                  </div>
                )}

                {step == 2 && (
                  <div className="justify-center items-center flex-col flex ">
                    <h3 className="text-center text-xl p-3 bg-[#fefefe] border-b w-full">
                      Choisir la feuille de calcul
                    </h3>

                    <div className="p-16 w-3/4 space-y-8">
                      <div>
                        <label>Feuille de calcul</label>
                        <select
                          defaultValue={sheetName}
                          onChange={(e) => setSheetName(e.target.value)}
                          className="select select-bordered w-full my-2"
                        >
                          <option disabled selected>
                            Sélectionner la feuille de calcul
                          </option>
                          {fileData?.SheetNames.map((value: any) => (
                            <option value={value}>{value}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label>Numéro de la ligne de titre</label>
                        <input
                          type="number"
                          defaultValue={headerRowIndex}
                          placeholder="Quelle est la ligne qui sera utiliser comme titre ?"
                          onChange={(e) => setHeaderRowIndex(e.target.value)}
                          className="input input-bordered w-full my-2"
                        />
                      </div>

                      <button
                        disabled={sheetName == null || sheetName == ""}
                        onClick={() =>
                          sheetName != null && sheetName != ""
                            ? convertDataToArray()
                            : ""
                        }
                        className="btn rounded-lg px-8"
                      >
                        suivant
                      </button>
                    </div>
                  </div>
                )}

                {step == 3 && (
                  <div
                    className="justify-center items-start flex-col flex w-full"
                    id="choixSchema"
                  >
                    <h3 className="text-center text-xl p-3 bg-[#fefefe] border-b w-full">
                      Configuration du titre
                    </h3>
                    <div className="w-full">
                      <div className="overflow-x-auto w-full flex items-center justify-between h-full flex-col p-8">
                        <table className="table table-hover rounded-0 text-center w-full">
                          <tbody className="border-b">
                            <tr className="h-6">
                              {Object.keys(headerRow).map(
                                (key: any, column: number) => (
                                  <th
                                    key={column}
                                    className={`border-x p-0 ${
                                      column == 0
                                        ? "bg-blue-200 border-0 z-10 overflow-hidden"
                                        : ""
                                    } `}
                                  >
                                    <input
                                      name={key}
                                      defaultValue={
                                        headerRow[key] == 0
                                          ? ""
                                          : headerRow[key]
                                      }
                                      onChange={(e) =>
                                        setHeaderRow((values: any) => {
                                          values[key] = e.target.value;
                                          return values;
                                        })
                                      }
                                      className={`m-0 w-full  border-t border-x-1/2 outline-none h-12 min-w-[20px]  text-center focus:border-blue-400 focus:border-2`}
                                    />
                                  </th>
                                )
                              )}
                            </tr>
                          </tbody>
                        </table>
                        <div className="alert alert-secondary mt-10 text-sm text-gray-900">
                          Le titre doit être en miniscule, sans espace, ni
                          caractères spéciaux, sans accents!
                          <br />
                          <br />
                          Au risque d'avoir des soucis lors du traitement.
                        </div>
                        <div className="clear-both">
                          <button
                            onClick={() => convertData()}
                            className="btn mt-10 btn-lg btn-primary float-right px-8 w-full rounded-lg"
                          >
                            Importer mon fichier
                          </button>
                        </div>
                      </div>
                    </div>
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
