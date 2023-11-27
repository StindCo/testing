import { useState } from "react";
import {
  BsArrowCounterclockwise,
  BsCalendar2Plus,
  BsDatabaseFillAdd,
  BsPlus,
  BsUpload,
} from "react-icons/bs";
import { MdTableChart } from "react-icons/md";
import { TbDatabaseImport } from "react-icons/tb";
import { useSelector } from "react-redux";
import useLocalStorageState from "use-local-storage-state";
import { getUser } from "../../shared/reducers/login";
import DataTable from "./DataTable";
import MultiPromptImport from "./MultiPromptImport";
import { importData } from "./services/ImportationService";

type Props = {
  data: any;
};

export default function DataImport({ data }: Props) {
  const [view, setView] = useLocalStorageState<any>(
    `${data.name}: loaded`,
    {
      defaultValue: "prompt",
    }
  );
  const [isPeriodModalShow, setIsPeriodModalShow] = useState(false);
  const [periodRow, setPeriodRow] = useState(0);
  let userLogged: any = useSelector(getUser);

  const [periodSelected, setPeriodSelected] = useState({
    month: 1,
    trimester: "T1",
    year: "2022",
  });
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
  const columns = [
    "Période",
    ...data?.table?.columns.map((column: any) => column.description),
  ];
  const [entries, setEntries] = useState([
    ["period", {}],
    ...data?.table?.columns.map((column: any) => [column.name, 0]),
  ]);

  const [nbrRows, setNbrRows] = useState(10);

  const [arrayOfInput, setArrayOfInput] = useLocalStorageState<any[]>(
    data.name,
    {
      defaultValue: [
        ...Array(nbrRows)
          .fill(0)
          .map((_) => Object.fromEntries(entries)),
      ],
    }
  );

  const [rowsSelected, setRowsSelected] = useLocalStorageState<any>(
    `${data.name}: inputselected`,
    {
      defaultValue: [],
    }
  );

  const [uploadedRows, setUploadedRows] = useLocalStorageState<any>(
    `${data.name}: uploadedRows`,
    {
      defaultValue: [],
    }
  );

  const toggleRowInSelection = (index: any) => {
    if (!uploadedRows.includes(index)) {
      if (rowsSelected.filter((a: any) => a == index).length != 0) {
        let rows = rowsSelected.filter((row: any) => row != index);
        setRowsSelected(rows);
      } else {
        let arrayD = rowsSelected;
        arrayD.push(index);
        setRowsSelected([...arrayD]);
      }
    }
  };

  const handleFormChange = (index: any, event: any) => {
    let valueArray = [...arrayOfInput];
    valueArray[index][event.target.name] = parseFloat(
      event.target.value.replace(/\s/g, "")
    );

    setArrayOfInput(valueArray);
  };

  const setValuePeriod = (index: any, value: any) => {
    let data = [...arrayOfInput];
    let period: any = {};
    period.month = value?.month;
    period.year = value?.year;
    period.trimester = value?.trimester;
    data[index]["period"] = period;

    setArrayOfInput(data);
  };

  const clearEditor = () => {
    setRowsSelected([]);
    setUploadedRows([]);
    setArrayOfInput([
      ...Array(nbrRows)
        .fill(0)
        .map((_) => Object.fromEntries(entries)),
    ]);
  };

  const handlePaste = (event: any, row: any, column: any) => {
    const clipboardData: any = event.clipboardData || window.Clipboard;
    const pastedData = clipboardData.getData("text/plain");
    const parsedData = pastedData
      .split("\n")
      .map((row: any) => row.split("\t"));

    let valueArray = [...arrayOfInput];

    parsedData.forEach((value: any, index: number) => {
      let columnToChange: number = column;
      let valueChanged: number = 0;
      Object.keys(arrayOfInput[0]).forEach((name, col) => {
        if (col == columnToChange) {
          if (value[valueChanged] != null) {
            valueArray[row + index][name] = parseFloat(
              value[valueChanged]
                .replace(/\s/g, "")
                .replace(/%/g, "")
                .replace(/,/g, "")
            );
            columnToChange = columnToChange + 1;
            valueChanged = valueChanged + 1;
          }
        }
      });
    });

    setArrayOfInput(valueArray);
    event.preventDefault();
  };

  const submitElements = () => {
    rowsSelected.forEach(async (row: any) => {
      let information: any = arrayOfInput[row];
      if (uploadedRows.indexOf(row) == -1) {
        let response = await importData(
          data?.table,
          userLogged.user,
          data?.operateur,
          information
        );

        setUploadedRows((content: any) => [...content, row]);
      }
    });
  };

  return (
    <div className="h-autow-full">
      <div className="flex flex-row w-full h-full justify-between">
        <div className="bg-[#fefefe] w-full h-full overflow-hidden flex flex-col justify-between">
          {view == "prompt" && (
            <div className="h-full pb-6 overflow-hidden overflow-y-scroll no-scrollBar">
              <div className="w-full ">
                <div className="text-lg text-center select-none py-2 border-b">
                  {data?.table?.name}
                </div>
                <div className="overflow-x-scroll select-none  overflow-y-scroll no-scrollBar">
                  <table className="table table-hover rounded-0 text-center  w-full">
                    {/* head */}
                    <thead>
                      <tr className="text-xl font-[PoppinsBold]">
                        {columns.map((value: any, index: any) => (
                          <th
                            key={index}
                            className={`border-x cursor-pointer ${
                              index == 0
                                ? "bg-blue-200 w-16 border-b absolute z-10"
                                : ""
                            }`}
                          >
                            <span>{value}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="border-b">
                      {arrayOfInput.map((value: any, index: number) => (
                        <tr key={index} className="h-6">
                          {Object.keys(value).map(
                            (key: any, column: number) => (
                              <th
                                key={column}
                                className={`border-x p-0 ${
                                  column == 0
                                    ? "bg-blue-200 border-0 z-10 w-20 overflow-hidden"
                                    : ""
                                } `}
                              >
                                {key == "period" &&
                                  Object.keys(value.period).length == 0 && (
                                    <BsCalendar2Plus
                                      onClick={(e) => {
                                        setPeriodRow(index);
                                        setIsPeriodModalShow(true);
                                      }}
                                      className="m-auto text-lg cursor-pointer"
                                    />
                                  )}
                                {key == "period" &&
                                  Object.keys(value.period).length != 0 && (
                                    <div
                                      onClick={(e) => {
                                        setPeriodRow(index);
                                        setIsPeriodModalShow(true);
                                      }}
                                      className="flex flex-col cursor-pointer text-xs text-neutral"
                                    >
                                      <span>
                                        {mois[value?.period?.month - 1]},
                                      </span>{" "}
                                      <span>
                                        {value?.period?.trimester}-
                                        {value?.period?.year}
                                      </span>
                                    </div>
                                  )}
                                <input
                                  type="number"
                                  name={key}
                                  onPaste={(e) => handlePaste(e, index, column)}
                                  disabled={
                                    uploadedRows.filter(
                                      (value: any) => value == index
                                    ).length != 0 ||
                                    rowsSelected.filter(
                                      (value: any) => value == index
                                    ).length != 0
                                  }
                                  value={value[key] == 0 ? "" : value[key]}
                                  onChange={(event) =>
                                    handleFormChange(index, event)
                                  }
                                  className={`m-0 w-full
                            ${
                              uploadedRows.filter(
                                (value: any) => value == index
                              ).length != 0 &&
                              rowsSelected.filter(
                                (value: any) => value == index
                              ).length != 0
                                ? " bg-orange-50"
                                : ""
                            } ${
                                    rowsSelected.filter(
                                      (value: any) => value == index
                                    ).length != 0 &&
                                    uploadedRows.filter(
                                      (value: any) => value == index
                                    ).length == 0
                                      ? "bg-blue-50"
                                      : " "
                                  } border-t border-x-1/2 outline-none h-12 ${
                                    column == 0
                                      ? "bg-blue-200 border-0 hidden"
                                      : ""
                                  } text-center focus:border-blue-400 focus:border-2`}
                                />
                              </th>
                            )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="border-t  bottom-0 py-1 rounded-lg bg-[#fefefe] flex flex-row items-center justify-between px-5">
                <div>
                  <span className="text-cyan-800 text-muted text-xs space-x-2">
                    <span>{arrayOfInput.length} lignes,</span>{" "}
                    <span> {entries.length} colonnes</span>
                    <span> {rowsSelected.length} ligne(s) selectionné(es)</span>
                    <span> {uploadedRows.length} ligne(s) enregistré(es)</span>
                  </span>
                </div>
                <div className="flex cursor-pointer flex-row items-center text-sm space-x-2">
                  <button
                    onClick={(e) => {
                      setNbrRows(nbrRows + 1);
                      setArrayOfInput([
                        ...arrayOfInput,
                        Object.fromEntries(entries),
                      ]);
                    }}
                    className="border border-orange-500 rounded-lg py-2 px-5 m-1 flex flex-row items-center space-x-3"
                  >
                    <BsPlus size={20} />
                    <span>Ajouter une ligne</span>
                  </button>
                  <div className="dropdown dropdown-top dropdown-end">
                    <label
                      tabIndex={0}
                      className="border cursor-pointer border-blue-500 rounded-lg py-2 px-5 m-1 flex flex-row items-center space-x-3"
                    >
                      <BsUpload />
                      <span>Uploader</span>
                    </label>
                    <div
                      tabIndex={0}
                      className="dropdown-content flex flex-col justify-between p-2 shadow border no-scrollBar overflow-y-scroll h-[300px] bg-slate-50 rounded w-96"
                    >
                      <div>
                        <h4 className="text-lg w-full p-2 pb-1 border-b font-extraBold">
                          Selectionnez les lignes
                        </h4>
                        <div className="p-4 py-4 text-sm text-neutral space-y-5">
                          {arrayOfInput.map((value: any, index: number) => (
                            <div key={index}>
                              {Object.keys(value.period).length != 0 && (
                                <div className="flex flex-row items-center justify-between">
                                  <span>
                                    {mois[value?.period.month - 1]} {"    "}
                                    {value?.period.trimester}-
                                    {value?.period?.year}
                                  </span>
                                  <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      toggleRowInSelection(index)
                                    }
                                    className="toggle toggle-md toggle-primary"
                                    checked={
                                      uploadedRows.filter(
                                        (value: any) => value == index
                                      ).length != 0 ||
                                      rowsSelected.filter(
                                        (value: any) => value == index
                                      ).length != 0
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t p-2 w-full">
                        <button
                          onClick={(e) => submitElements()}
                          className="btn btn-sm w-full"
                        >
                          Soumettre
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {view == "multi-prompt" && (
            <div>
              <div className="text-lg text-center select-none py-2 border-b">
                {data?.table?.name}
              </div>
              <div className="h-full">
                <MultiPromptImport user={userLogged.user} data={data} />
              </div>
            </div>
          )}

          {view == "table" && (
            <div>
              <div className="text-lg text-center select-none py-2 border-b">
                {data?.table?.name}
              </div>
              <div className="h-full">
                <DataTable data={data} />
              </div>
            </div>
          )}
        </div>
        <div className="w-16 shadow-md pt-10">
          <div className="w-full flex flex-col space-y-10 text-2xl items-center">
            <a
              className={`${
                view == "prompt" ? "text-cyan-700" : ""
              } cursor-pointer`}
              onClick={(e) => setView("prompt")}
            >
              <BsDatabaseFillAdd />
            </a>
            <a
              className={`${
                view == "table" ? "text-cyan-700" : ""
              } cursor-pointer`}
              onClick={(e) => setView("table")}
            >
              <MdTableChart />
            </a>

            <a
              className={`${
                view == "multi-prompt" ? "text-cyan-700" : ""
              } cursor-pointer`}
              onClick={(e) => setView("multi-prompt")}
            >
              <TbDatabaseImport />
            </a>
            <a
              className="hover:text-cyan-700 cursor-pointer tooltip tooltip-left"
              data-tip="Vider l'éditeur"
              onClick={(e) => clearEditor()}
            >
              <BsArrowCounterclockwise />
            </a>
          </div>
        </div>
      </div>

      <div>
        <div className={`modal ${isPeriodModalShow && "modal-open"}`}>
          <div className="modal-box no-scrollBar  w-3/5 max-w-2xl">
            <div className="flex flex-row px-2 items-center justify-between">
              <h3 className="text-xl font-bold">Définir la période</h3>
              <label
                htmlFor="my-modal-3"
                onClick={(e) => setIsPeriodModalShow(false)}
                className="btn btn-sm btn-circle"
              >
                ✕
              </label>
            </div>
            <div className="border-t mt-2 p-3">
              <form
                onSubmit={(e) => {
                  setValuePeriod(periodRow, periodSelected);
                  setIsPeriodModalShow(false);
                  e.preventDefault();
                }}
              >
                <div className="flex flex-row space-x-4">
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Mois</span>
                    </label>
                    <select
                      className="select select-bordered"
                      onChange={(e) => {
                        let periodCopy = { ...periodSelected };
                        periodCopy.month = parseInt(e.target.value) + 1;
                        setPeriodSelected(periodCopy);
                      }}
                    >
                      <option disabled>Choisissez un mois</option>
                      {mois.map((value, index) => (
                        <option key={index} value={index}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Période</span>
                    </label>
                    <select
                      className="select select-bordered"
                      onChange={(e) => {
                        let periodCopy = { ...periodSelected };
                        periodCopy.trimester = e.target.value;
                        setPeriodSelected(periodCopy);
                      }}
                    >
                      <option disabled>Choisissez une période</option>
                      <option value="T1">Premier trimestre</option>
                      <option value="T2">Second trimestre</option>
                      <option value="T3">Troisième trimestre</option>
                      <option value="T4">Quatrième trimestre</option>
                    </select>
                  </div>

                  <div className="form-control w-full  max-w-xs">
                    <label className="label">
                      <span className="label-text">Année</span>
                    </label>
                    <input
                      onChange={(e) => {
                        let periodCopy = { ...periodSelected };
                        periodCopy.year = e.target.value;
                        setPeriodSelected(periodCopy);
                      }}
                      className="input w-full input-bordered max-w-xs"
                      placeholder="Année"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
