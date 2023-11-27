import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ChartMenuOptions, ColDef, SideBarDef } from "ag-grid-community";

type Props = {
  data: any;
};

const generateColumns = (ref: any, parentKey: any = null) => {
  if (ref == null) return [];
  let columns: ColDef[] = Object.keys(ref).map((key) => {
    if (typeof ref[key] == "object") {
      return {
        headerName: key,
        children: generateColumns(
          ref[key],
          parentKey == null ? key : parentKey + "." + key
        ),
      };
    } else {
      if (parentKey != null) return { field: parentKey + "." + key };
      return { field: key };
    }
  });
  return columns;
};

export default function Table({ data }: Props) {
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
  const gridRef = useRef<AgGridReact<any>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();

  const [columnDefs, setColumnDefs] = useState<ColDef[]>();

  useEffect(() => {
    if (data != null && data.length != 0) {
      let firstRow = data[0];
      let columns = generateColumns(firstRow);

      setColumnDefs(columns);
    } else {
      setColumnDefs([]);
    }

    setRowData(data);
  }, [data]);

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

  const onGridReady = useCallback(() => {
    setRowData(data);
  }, []);

  const getChartToolbarItems = useCallback((): ChartMenuOptions[] => {
    return ["chartDownload", "chartUnlink"];
  }, []);

  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);

  return (
    <div className="h-[600px] w-full">
      <div style={containerStyle}>
        <div className="flex flex-col h-full w-full">
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
