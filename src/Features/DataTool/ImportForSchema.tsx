import { useEffect, useMemo, useRef, useState } from "react";
import Dropzone, { useDropzone } from "react-dropzone";
import { RiFileExcel2Fill } from "react-icons/ri";
import { RotatingLines } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { read, utils } from "xlsx";
import { getUser } from "../../shared/reducers/login";
import {
  getOperateurs,
  getCurrentOperateurIndex,
} from "../../shared/reducers/operateurs";
import { getSchema } from "../../shared/reducers/schema";
import { importData } from "./services/ImportationService";

type Props = {
  data: any;
};

const baseStyle = {
  flex: 1,
  display: "flex",
  FlexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 40,
  border: "1px dashed #ccc",
  borderWidth: 2,
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

/**
 * Ce component doit être réecrit,
 * Les fonctions métiers doivent être exlu vers un autre dossier
 */

export default function ImportForSchema({}: Props): JSX.Element {
  let [currentFile, setCurrentFile] = useState<any>();
  let user: any = useSelector(getUser).user;

  const refLogger = useRef<any>(null);

  let operateurs: any = useSelector(getOperateurs);
  let currentoperateurIndex: any = useSelector(getCurrentOperateurIndex);
  const [logMessage, setLogMessage] = useState<any>([]);
  const [errorFiles, setErrorsFiles] = useState<any>([]);

  let dataSchema = useSelector(getSchema);
  const [files, setFiles] = useState([]);
  const [workList, setWorkList] = useState<any>([]);
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

  const writeError = (errorMessage: string) => {
    setLogMessage((message: string) => [
      ...message,
      <div key={Math.random()} className="text-xs text-red-800 p-1">
        ={">"} {errorMessage}
      </div>,
    ]);
  };

  const writeMessage = (errorMessage: string) => {
    setLogMessage((message: string) => [
      ...message,
      <div key={Math.random()} className="text-xs text-green-500 p-1">
        ={">"} {errorMessage}
      </div>,
    ]);
  };

  useEffect(() => {
    if (refLogger != null) {
      refLogger.current?.scrollTo({ behavior: "smooth", bottom: -10 });
    }
  }, [logMessage]);

  const onDrop: any = (files: any) => {
    setFiles(files);
    setWorkList([]);
  };

  // Affichage de tous les fichiers
  const filesShow = files.map((file: any) => {
    let desc = "";
    let changeDesc = (description: string) => {
      desc = description;
      setFiles((files: any) => {
        files = files.map((item: any, index: number) => {
          if (item == file) {
            item.description = description;
          }
          return item;
        });

        return files;
      });

      setWorkList((files: any) => {
        files = files.map((item: any, index: number) => {
          if (item == file) {
            item.description = description;
          }
          return item;
        });
        return files;
      });
    };
    return (
      <div
        key={file.name}
        className={`pb-6 px-6 border rounded-md hover:bg-[#fefefe] hover:border-green-800 ${
          workList.includes(file) && !errorFiles.includes(file)
            ? "border-green-800 bg-green-50 hover:bg-green-50"
            : ""
        } ${errorFiles.includes(file) ? "bg-red-300 hover:bg-red-300" : ""}`}
      >
        <div className="flex flex-row-reverse mt-2">
          <label className="label cursor-pointer flex-row flex space-x-4">
            <input
              placeholder="airtel-05-T3-2022"
              onChange={(e) => {
                changeDesc(e.target.value);
              }}
              className="input input-xs w-full input-bordered"
            />

            {workList.filter(
              (value: any) =>
                value.name == file.name &&
                value.lastModified == file.lastModified
            ).length != 0 && (
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="30"
                visible={true}
              />
            )}
            <input
              onChange={(e) =>
                !workList.includes(file)
                  ? setWorkList((workList: any) => [...workList, file])
                  : setWorkList(workList.filter((value: any) => value != file))
              }
              type="checkbox"
              className="checkbox checkbox-success"
            />
          </label>
        </div>
        <div className="p-3">
          <RiFileExcel2Fill className="mx-auto text-green-800" size={50} />
        </div>
        <div className="text-center text-sm font-[PoppinsBold]">
          {file.name}
        </div>
        <div className="text-center text-xs mt-2">{file.size / 1000} Kb</div>
      </div>
    );
  });

  /**
   * L'importation des fichiers se fait en 3 fonctions
   * La première a pour but de selectionner et d'orchestrer les actions des deux autres
   *
   */

  const startImportation = async () => {
    let workL = workList;

    const importation = async (index: number) => {
      let file = workL[index];
      setCurrentFile(file);
      setLogMessage((message: string) => [
        ...message,
        <div key={Math.random()} className="text-sm p-1">
          **** Traitement du fichier "
          <span className="underline">{file.name}</span>" ****
        </div>,
      ]);
      let informations: any;

      if ((informations = checkDescription(file)) != null) {
        setLogMessage((message: string) => [
          ...message,
          <div key={Math.random()} className="text-xs text-green-500  p-1">
            ={">"} Description valide
          </div>,
        ]);
        fileParser(file, informations).then((data) => {
          console.log("Je suis là");
          if(workL[index+1] != null) {
            setTimeout(() => {
              setLogMessage("");
              importation(index + 1);
            }, 200)
          }

          // setTimeout(() => {
          //   if (workL.length < index + 1) {
          //     setLogMessage("");
          //   }
          // }, 200);
        });
      }
    };

    importation(0);
  };

  /**
   * Cette fonction a pour but, la vérification de la lisibilité du fichier, et la gestion des erreurs y afférantes
   * En outre, il vérifie aussi la nomemclature
   * J'ai conscience qu'il doit être réécrite, Je planifie pour la première mise à jour
   */

  const checkDescription = (file: any) => {
    const trimester = ["T1", "T2", "T3", "T4"];
    if (!file.name.includes("xlsx")) {
      writeError("Format non pris en charge");
      setErrorsFiles((files: any) => {
        return [...files, file];
      });
      return;
    }
    if (file.description == null || file.description == "") {
      writeError("La description n'est pas spécifiée");
      setErrorsFiles((files: any) => {
        return [...files, file];
      });
      return;
    }

    let description: any = file.description.split("-");
    if (description.length != 4) {
      writeError("Le format de la description n'est pas respecté");
      setErrorsFiles((files: any) => {
        return [...files, file];
      });
      return;
    }

    if (
      operateurs.filter((operateur: any) => operateur.tag == description[0])
        .length == 0
    ) {
      writeError("Cet opérateur n'existe pas");
      setErrorsFiles((files: any) => {
        return [...files, file];
      });
      return;
    }

    if (parseInt(description[1]) > 12 || parseInt(description[1]) < 1) {
      writeError("Ce mois n'existe pas");
      setErrorsFiles((files: any) => {
        return [...files, file];
      });
      // writeMessage(
      //   arrayOfValue.length + " / " + dataSchema.length + " tables lues"
      // );
      return;
    }

    if (!trimester.includes(description[2].toUpperCase())) {
      writeError("Ce trimestre n'existe pas");
      setErrorsFiles((files: any) => {
        return [...files, file];
      });
      return;
    }

    if (parseInt(description[3]) >= 2100 || parseInt(description[3]) <= 2000) {
      writeError("Cette année n'est pas viable");
      setErrorsFiles((files: any) => {
        return [...files, file];
      });

      return;
    }

    setErrorsFiles(errorFiles.filter((item: any) => item.name != file.name));

    return {
      operateur: operateurs.filter(
        (operateur: any) => operateur.tag == description[0]
      )[0],
      period: {
        month: parseInt(description[1]),
        trimester: description[2].toUpperCase(),
        year: parseInt(description[3]),
      },
    };
  };

  /**
   * Cette fonction Va lire, interpreter et charger les données selon les modèles
   * à Réecrire
   *
   */
  const fileParser = async (file: any, informations: any) => {
    const data = await file.arrayBuffer();
    return new Promise((myResolve, myReject) => {
      /* data is an ArrayBuffer */
      const workbook = read(data);
      let aoa = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
        header: 1,
      });

      let arrayOfValue: any = [];

      for (let i = 0; i < aoa.length; i++) {
        let item: any = aoa[i];
        if (
          dataSchema.filter((value: any) => value.name == item[0]).length != 0
        ) {
          arrayOfValue.push([item, aoa[i + 1]]);
        }
      }

      writeMessage(
        arrayOfValue.length + " / " + dataSchema.length + " tables lues"
      );

      let schemaValue = arrayOfValue.map((value: any, index: any) => {
        let item: any = {};
        item[value[0][0]] = value[0].reduce(
          (previous: any, valeur: any, index: number) => {
            let element: any = {};
            if (index != 0) {
              element[valeur] = value[1][index];
            }

            return { ...previous, ...element };
          },
          { period: informations.period }
        );

        let table =
          dataSchema.filter((table: any) => table.name == value[0][0])[0] ??
          undefined;

        if (table != null) {
          return {
            table,
            user,
            operateur: informations.operateur,
            data: item[value[0][0]],
          };
        }
      });
      schemaValue;

      const insertMany = (indexValue: number) => {
        if (schemaValue[indexValue] != null) {
          importData(
            schemaValue[indexValue]["table"],
            schemaValue[indexValue]["user"],
            schemaValue[indexValue]["operateur"],
            schemaValue[indexValue]["data"]
          ).then((data: any) => {
            setTimeout(() => {
              writeMessage(schemaValue[indexValue]["table"].name + " inséré !");
              insertMany(indexValue + 1);
            }, 500);
          });
        } else {
          myResolve({});

          return true;
        }
      };
      insertMany(0);
    });
  };

  return (
    <div className="w-full h-screen pb-64 space">
      <h1 className="text-xl  text-center p-6 text-white  bg-slate-900">
        Importation des fichiers
        <a
          href={"https://docs.google.com/spreadsheets/d/1rqDJmXe4gZ-9nHqiwHdhWTM4S0VT3y6Q/edit?usp=drive_link&ouid=108974077205214049585&rtpof=true&sd=true"}
          download="Model de fichier"
          target="_blank"
          rel="noreferrer"
          className="text-sm btn btn-sm btn-warning float-right"
        >
          Télécharger le modèle
        </a>
      </h1>
      <div className="flex flex-row justify-between items-start">
        <div className="p-10 w-3/4">
          <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <section className="container">
                <div {...getRootProps({ style })}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                <aside>
                  <h4 className="my-6 w-full text-center p-3 border rounded">
                    Prévisualisation
                  </h4>
                  <div className="px-8 grid grid-cols-3 gap-8 select-none">
                    {filesShow}
                  </div>
                </aside>
              </section>
            )}
          </Dropzone>
        </div>
        <div className="w-1/4 h-96 flex float-right flex-row-reverse">
          {/* <Rnd
            bounds={".space"}
            dragHandleClassName={"handle"}
            minWidth={350}
            minHeight={50}
            default={{
              x: 0,
              y: 0,
              width: 400,
              height: 200,
            }}
          > */}
          <div
            ref={refLogger}
            className="w-full  border overflow-hidden overflow-y-scroll no-scrollBar pb-8 h-screen shadow-sm rounded-lg bg-[#fcfcfc]"
          >
            <div className="flex flex-row space-x-6 shadow-sm justify-between items-center bg-slate-50  text-black w-full border p-2 rounded-lg">
              <div className="w-full px-3 handle items-center justify-between flex flex-row">
                <p className="text-lg">console</p>
                <button
                  onClick={(e) => startImportation()}
                  disabled={workList.length == 0}
                  className="btn btn-success  btn-sm"
                >
                  Importer
                </button>
              </div>
            </div>
            <div className="mt-0 px-3 text-xs h-full">{logMessage}</div>
          </div>{" "}
          {/* </Rnd> */}
        </div>
      </div>
    </div>
  );
}
