import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  AgChartThemeOverrides,
  ChartCreated,
  ChartMenuOptions,
  ChartToolPanelName,
  ColDef,
  CreateRangeChartParams,
  FirstDataRenderedEvent,
  SideBarDef,
} from "ag-grid-community";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function generateString(length: number) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

type Props = {
  data: any;
  legend: string;
  typeOfRender: string;
  description: string;
};

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
var chartId: string | undefined;

export default function Table({ data, typeOfRender }: Props) {
  const gridRef = useRef<AgGridReact<any>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [chartIds, setChartIds] = useState(generateString(8));

  const chartThemeOverrides = useMemo<AgChartThemeOverrides>(() => {
    return {
      common: {
        title: {
          fontSize: 22,
          fontFamily: "Poppins, sans-serif",
        },
        legend: {
          enabled: true,
          position: "bottom",
          spacing: 15,
        },
      },
      cartesian: {
        axes: {
          category: {
            label: {},
          },
        },
      },
    };
  }, []);

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    let type: any =
      typeOfRender == "chart-line"
        ? "line"
        : typeOfRender == "chart-column"
        ? "groupedColumn"
        : typeOfRender == "chart-circular-fill"
        ? "pie"
        : "line";

    const createRangeChartParams: CreateRangeChartParams = {
      cellRange: {
        columns: Object.keys(data[0]),
      },
      chartType: type,
      chartContainer: document.querySelector(`#${chartIds}`) as any,
    };
    gridRef.current!.api.createRangeChart(createRangeChartParams);
  }, []);

  const onChartCreated = useCallback((event: ChartCreated) => {
    chartId = event.chartId;
  }, []);

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

  const customChartThemes: any = {
    themeA: {
      baseTheme: "ag-pastel",
      palette: {
        fills: ["#008ac1", "#f0533c", "#fc923c", "#a2bf57", "#f71e92"],
        strokes: ["#686b6b", "#686b6b", "#283737"],
      },
    },
    themeB: {
      baseTheme: "ag-pastel",
      palette: {
        fills: ["#0d0b0b", "#686b6b", "#b3cdcc", "#16922b", "#f71e92"],
        strokes: ["#686b6b", "#686b6b", "#283737"],
      },
    },
    themeC: {
      baseTheme: "ag-vivid",
      palette: {
        fills: ["#b3b3b3", "#f73c39", "#ffb43e", "#3e74ff", "#fc3eff"],
        strokes: ["#b3b3b3", "#686b6b", "#283737"],
      },
    },
  };

  const chartThemes = ["themeA", "themeB", "themeC", "ag-vivid", "ag-default"];

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
    <div className="h-[85%] w-full">
      <div style={containerStyle}>
        <div className="h-full w-full">
          <div id="myGrid" className="ag-theme-alpine hidden">
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
              customChartThemes={customChartThemes}
              chartThemes={chartThemes}
              chartThemeOverrides={chartThemeOverrides}
              onFirstDataRendered={onFirstDataRendered}
              onChartCreated={onChartCreated}
              onGridReady={onGridReady}
            ></AgGridReact>
          </div>
          <div
            id={chartIds}
            className="ag-theme-material my-chart w-full h-full"
          ></div>
        </div>
      </div>
    </div>
  );
}
