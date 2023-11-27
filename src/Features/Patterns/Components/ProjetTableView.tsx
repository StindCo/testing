import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { ChartMenuOptions, ColDef, SideBarDef } from "ag-grid-community";

type Props = {
  data: any;
};

import "./Styles/tableGrid.css";

const generateColumns = (ref: any, parentKey: any = null) => {
  if (ref == null) return [];
  let columns: ColDef[] = Object.keys(ref).map((key) => {
    if (typeof ref[key] == "number")
      return {
        field: key,
        valueFormatter: (params) =>
          typeof params.value == "number"
            ? params.value.toFixed(2)
            : params.value,
      };
    return { field: key, rowDrag: true };
  });
  return columns;
};

export default function ProjetTableView({ data }: Props) {
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
      enableValue: true,
    };
  }, []);

  const sideBar = useMemo<
    SideBarDef | string | string[] | boolean | null
  >(() => {
    return {
      toolPanels: [],
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
    <div className="h-full w-full border-t">
      <div style={containerStyle}>
        <div className="flex flex-col h-full w-full">
          <div style={gridStyle} className="ag-theme-material">
            <AgGridReact<any>
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              rowDragManaged={true}
              enableCharts={true}
              popupParent={popupParent}
              enableRangeSelection={true}
              getChartToolbarItems={getChartToolbarItems}
              onGridReady={onGridReady}
            ></AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
}
