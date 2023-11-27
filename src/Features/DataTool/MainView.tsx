import { useEffect, useState } from "react";
import {
  BsCheckCircle,
  BsCollection,
  BsDatabaseFillAdd,
  BsDatabaseFillGear,
  BsFilesAlt,
  BsFolder2Open,
  BsGrid,
  BsGrid1X2,
  BsListUl,
  BsTable,
  BsThreeDots,
  BsThreeDotsVertical,
  BsUpload,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addTabs } from "../../shared/reducers/datatoolTabs";
import useLocalStorageState from "use-local-storage-state";
import {
  getCurrentOperateurIndex,
  getOperateurs,
  setCurrentOperateur,
} from "../../shared/reducers/operateurs";
import { getSchema } from "../../shared/reducers/schema";
import ImportForSchema from "./ImportForSchema";

type Props = {
  data: any;
};

export default function MainView({ data }: Props) {
  const [isList, setIsList] = useState(true);
  const [view, setView] = useLocalStorageState<any>(
    `${data.name}: datasloaded`,
    {
      defaultValue: "import",
    }
  );
  const [isModalLoad, setIsModalLoad] = useState(false);
  let operateurs: any = useSelector(getOperateurs);
  let currentoperateurIndex: any = useSelector(getCurrentOperateurIndex);
  let dataSchema = useSelector(getSchema);
  const [tableLoaded, setTableLoaded] = useState(dataSchema[0]);
  let [dataSchemaFilter, setDataSchemaFilter] = useState([]);
  const [operateurIndex, setOperateurIndex] = useState(currentoperateurIndex);
  const dispatch = useDispatch();

  useEffect(() => {
    setDataSchemaFilter(dataSchema);
  }, [dataSchema]);


  function addImportTab(table: any) {
    dispatch(
      addTabs({
        tab: {
          name: `Import: ${operateurs[currentoperateurIndex].tag} - ${table?.name}`,
          data: {
            name: `Import: ${operateurs[currentoperateurIndex].tag} - ${table?.name}`,
            table: table,
            operateur: operateurs[currentoperateurIndex],
          },
          type: "import",
          is_revokable: true,
        },
      })
    );
  }

  function addDataTable(table: any) {
    dispatch(
      addTabs({
        tab: {
          name: `Datatable: ${operateurs[currentoperateurIndex].tag} - ${table?.name}`,
          data: {
            name: `Datatable: ${operateurs[currentoperateurIndex].tag} - ${table?.name}`,
            table: table,
            operateur: operateurs[currentoperateurIndex],
          },
          type: "table",
          is_revokable: true,
        },
      })
    );
  }

  function addDataTableAllOperateurs(table: any) {
    dispatch(
      addTabs({
        tab: {
          name: `Datatable: Tous les operateurs - ${table?.name}`,
          data: {
            name: `Datatable: Tous les operateurs - ${table?.name}`,
            table: table,
            operateur: operateurs[currentoperateurIndex],
          },
          type: "tableAll",
          is_revokable: true,
        },
      })
    );
  }

  function filterSchema(e: any) {
    setDataSchemaFilter(
      dataSchema.filter((table: any) => {
        return (
          table.name.includes(e.target.value) ||
          table.description.includes(e.target.value) ||
          table.name.toLowerCase().includes(e.target.value) ||
          table.description.toLowerCase().includes(e.target.value)
        );
      })
    );
  }

  const changeOperateur = (e: any) => {
    dispatch(setCurrentOperateur({ index: e.target.value }));
  };

  const showTableDescription = (table: any) => {
    setTableLoaded(table);
    setIsModalLoad(true);
  };

  return (
    <div className="h-full w-full flex flex-row justify-between">
       <div className="w-16 h-auto shadow-md pt-10">
        <div className="w-full h-full flex flex-col space-y-10 text-2xl items-center">
          <a
            className={`${
              view == "import" ? "text-cyan-700" : ""
            } cursor-pointer`}
            onClick={(e) => setView("import")}
          >
            <BsDatabaseFillAdd />
          </a>

          <a
            className={`${
              view == "main" ? "text-cyan-700" : ""
            } cursor-pointer`}
            onClick={(e) => setView("main")}
          >
            <BsGrid1X2 />
          </a>
        </div>
      </div>

      {view == "main" && (
        <div className="w-full h-auto">
          <div className="pt-8 px-10 pb-10">
            <div className="flex flex-row items-start space-x-6 w-1/2">
              <div className="w-24 h-24 items-center flex justify-center  border rounded-md border-red-300 bg-neutral-50">
                <BsDatabaseFillGear className="text-red-500 text-6xl" />
              </div>
              <div className="pt-0">
                <h1 className="text-2xl font-[PoppinsBold] text-slate-700">
                  Stockage & enregistrement
                </h1>
                <p className="pt">
                  Cette interface est conçue pour l'insertion, la modification,{" "}
                  <br /> la validation, la visualisation des données de
                  l'arptic.
                </p>
                <p className="pt-2 space-x-2 text-md ">
                  <span className="">Tags: </span>
                  <span className="text-blue-600 underline">Import</span> ,
                  <span className="text-blue-600 underline">export</span> ,
                  <span className="text-blue-600 underline">validation</span> ,
                  <span className="text-blue-600 underline">visualisation</span>{" "}
                  , etc.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center border-y w-full px-8 py-2">
            <div className="text-2xl px-2 font-bold">Schema discover</div>
            <div className="flex flex-row space-x-4 items-center">
              <div>
                <input
                  type="text"
                  placeholder="Rechercher une table"
                  onChange={(e) => filterSchema(e)}
                  className={"input input-bordered input-sm"}
                />
              </div>

              <div>
                <select
                  defaultValue={currentoperateurIndex}
                  onChange={(e) => changeOperateur(e)}
                  className="select select-bordered select-sm w-full max-w-xs"
                >
                  <option disabled>Operateur</option>
                  {operateurs.map((value: any, index: any) => (
                    <option key={index} value={index}>
                      {value.tag}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="swap swap-rotate mt-2 hover:text-blue-500">
                  <input type="checkbox" onChange={(e) => setIsList(!isList)} />
                  <BsListUl className="swap-off fill-current text-xl" />

                  <BsGrid className="swap-on fill-current text-xl" />
                </label>
              </div>
            </div>
          </div>

          {isList && (
            <div className="bg-[#fefefe] w-full px-20 py-16">
              <div className="grid grid-cols-4 gap-8 select-none ">
                {dataSchemaFilter.map((value: any, index: any) => (
                  <div
                    key={index}
                    className="border rounded-lg bg-[#e5e9f02c] text-slate-800 border-[#e5e9f0]"
                  >
                    <div className="dropdown dropdown-end  p-2 float-right">
                      <label tabIndex={0} className="cursor-pointer">
                        <BsThreeDotsVertical className="text-xl text-shadow-lg" />
                      </label>
                      <ul
                        tabIndex={1}
                        className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52"
                      >
                        <li onClick={(e) => addImportTab(value)}>
                          <a>
                            <BsUpload />
                            <span>new data</span>
                          </a>
                        </li>
                        <li>
                          <a>
                            <BsCheckCircle />
                            <span>Validation</span>
                          </a>
                        </li>
                        <li onClick={(e) => addDataTable(value)}>
                          <a>
                            <BsTable />
                            <span>
                              Pivot {operateurs[currentoperateurIndex]?.tag}{" "}
                            </span>
                          </a>
                        </li>
                        <li onClick={(e) => addDataTableAllOperateurs(value)}>
                          <a>
                            <BsCollection />
                            <span>Pivot général</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div
                      onDoubleClick={(e) => showTableDescription(value)}
                      className="clear-both cursor-pointer overflow-hidden text-ellipsis flex flex-col items-center space-y-4 pb-8 px-4"
                    >
                      <BsFolder2Open className="text-7xl text-slate-800" />
                      <p className="text-ellipsis text-sm">{value.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isList && (
            <div className="bg-[#fefefe] w-full px-8 py-8 select-none">
              {dataSchemaFilter.map((value: any, index: any) => (
                <div
                  key={index}
                  className="border-t flex flex-row hover:bg-[#f5f5f5d3]  justify-between px-4 py-3 bg-white cursor-pointer text-slate-800 border-[#e5e9f0]"
                >
                  <div
                    onDoubleClick={(e) => showTableDescription(value)}
                    className="clear-both flex flex-row space-x-8 w-4/5  items-center"
                  >
                    <BsFilesAlt className="text-3xl" />
                    <p className="">{value?.name}</p>
                  </div>
                  <div className="dropdown dropdown-left  p-2 float-right">
                    <label tabIndex={0} className="cursor-pointer">
                      <BsThreeDots className="text-2xl text-shadow-lg" />
                    </label>
                    <ul
                      tabIndex={1}
                      className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52"
                    >
                      <li onClick={(e) => addImportTab(value)}>
                        <a>
                          <BsUpload />
                          <span>new data</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <BsCheckCircle />
                          <span>Validation</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <BsCollection />
                          <span>voir dans pivot</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <BsTable />
                          <span>Afficher la table</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view == "import" && (
        <div className="w-full pb-16">
          <ImportForSchema data={data} />
        </div>
      )}


      <div>
        <div className={`modal ${isModalLoad && "modal-open"}`}>
          <div className="modal-box no-scrollBar  w-3/5 max-w-3xl">
            <div className="flex flex-row px-2 items-center justify-between">
              <h3 className="text-xl font-bold">Table Description</h3>
              <label
                htmlFor="my-modal-3"
                onClick={(e) => setIsModalLoad(false)}
                className="btn btn-sm btn-circle"
              >
                ✕
              </label>
            </div>

            <div className="border-t-2 mt-3 p-3 pt-5">
              <div className="flex flex-col items-center text-center justify-center space-y-3 w-full">
                <div className="w-24 h-24 items-center  flex justify-center  border rounded-2xl bg-neutral-50">
                  <BsFilesAlt className="text-6xl" />
                </div>
                <div className="pt-0">
                  <h1 className="text-2xl font-[PoppinsBold] text-slate-700">
                    {tableLoaded?.name}
                  </h1>
                  <p className="pt">{tableLoaded?.description}</p>
                </div>

                <div className="w-full">
                  <h3 className="text-lg border-y font-bold py-2">
                    Propriétés
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra text-center w-full">
                      {/* head */}
                      <thead className="text-lg font-bold font-[PoppinsBold]">
                        <tr>
                          <th>Nom</th>
                          <th>Description</th>
                          <th className="w-1/4">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableLoaded?.columns.map((value: any, index: any) => (
                          <tr key={index}>
                            <td>{value?.name}</td>
                            <td>{value?.description}</td>
                            <td>
                              <span className="bg-blue-500 rounded px-3 py text-white">
                                {value?.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
