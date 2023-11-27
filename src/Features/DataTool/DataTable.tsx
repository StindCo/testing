import useLocalStorageState from "use-local-storage-state";
import { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ChartMenuOptions,
  ColDef,
  GridReadyEvent,
  SideBarDef,
} from "ag-grid-community";
import { loadDataFromOperateur } from "./services/ImportationService";

type Props = {
  data: any;
};

declare var window: any;

export default function DataTable({ data }: Props) {
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
  const [datasLoaded, setDataLoaded] = useLocalStorageState<any>(
    `${data.name}: datasloaded`,
    {
      defaultValue: [],
    }
  );

  const gridRef = useRef<AgGridReact<any>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [entries, setEntries] = useState([
    ["period", {}],
    ...data?.table?.columns.map((column: any) => [column.name, 0]),
  ]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "Period",

      children: [
        { field: "period.month", filter: true },
        { field: "period.trimester", filter: true },
        { field: "period.year", filter: true },
        { field: "period.desc", filter: true },
        { field: "period.name", filter: true },
      ],
    },
    ...data?.table?.columns.map((column: any) => {
      return { field: column?.name, chartDataType: "series" };
    }),
    { field: "insertBy.username", headerName: "Inseré par", filter: true },
    { field: "insertedAt", headerName: "Date d'insertion", filter: true },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      sortable: true,
      resizable: true,

      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);
  const sideBar = useMemo<
    SideBarDef | string | string[] | boolean | null
  >(() => {
    return {
      toolPanels: ["columns", "filters"],
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    loadDataFromOperateur(data?.table, data?.operateur).then(
      ({ data: dataResponse }) => {
        dataResponse = dataResponse.map((value: any) => {
          let period = {
            desc: value.period?.trimester + "-" + value?.period?.year,
            name: mois[value?.period?.month - 1],
            month: value?.period?.month,
            trimester: value?.period?.trimester,
            year: value?.period?.trimester
          };
          let insertedAt = new Date(value?.insertedAt).toLocaleString();
          value = { ...value, period, insertedAt };
          return value;
        });

        for (let index = 0; index < dataResponse.length; index++) {
          for (let i = 0; i < data?.table?.columns.length; i++) {
            dataResponse[index][data?.table?.columns[i]?.name] = parseFloat(
              dataResponse[index][data?.table?.columns[i]?.name]
            );
          }
        }

        setRowData(dataResponse);
      }
    );
  }, []);

  const getChartToolbarItems = useCallback((): ChartMenuOptions[] => {
    return ["chartDownload", "chartUnlink"];
  }, []);

  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);

  return (
    <div className="h-[800px] w-full">
      <div className="h-full w-full">
        <div className=" flex flex-col h-full w-full">
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact<any>
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              sideBar={sideBar}
              enableCharts={true}
              popupParent={popupParent}
              enableRangeSelection={true}
              getChartToolbarItems={getChartToolbarItems}
              rowGroupPanelShow={"always"}
              pivotPanelShow={"always"}
              onGridReady={onGridReady}
            ></AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
}
