import React, { useState, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";
import { AgChartsReact } from "ag-charts-react";
import {
  AgBarSeriesOptions,
  AgCartesianAxisOptions,
  AgCartesianChartOptions,
  AgCartesianSeriesOptions,
  AgCartesianSeriesTooltipRendererParams,
  AgChart,
  AgLineSeriesOptions,
} from "ag-charts-community";
import { getData } from "./data";

type Props = {
  data: any[];
};

export default function CartesianChartView({ data }: Props) {
  const chartRef = useRef<AgChartsReact>(null);
  const [options, setOptions] = useState<AgCartesianChartOptions>({
    autoSize: true,
    data: getData(),
    theme: {
      palette: {
        fills: ["#7cecb3", "#7cb5ec", "#ecb37c", "#ec7cb5", "#7c7dec"],
        strokes: ["#7cecb3", "#7cb5ec", "#ecb37c", "#ec7cb5", "#7c7dec"],
      },
    },
    title: {
      text: "Fruit & Vegetable Consumption",
      fontSize: 12,
    },
    series: COLUMN_AND_LINE,
    axes: [
      {
        type: "category",
        position: "bottom",
        gridStyle: [
          {
            stroke: undefined,
          },
        ],
      },
      {
        // primary y axis
        type: "number",
        position: "left",
        keys: ["women", "men", "children", "adults"],
        title: {
          text: "Adults Who Eat 5 A Day (%)",
        },
      },
      {
        // secondary y axis
        type: "number",
        position: "right",
        keys: ["portions"],
        title: {
          text: "Portions Consumed (Per Day)",
        },
      },
    ] as AgCartesianAxisOptions[],
    legend: {
      position: "bottom",
      item: {
        marker: {
          strokeWidth: 0,
        },
      },
    },
  });

  const columnLine = useCallback(() => {
    const clone = { ...options };

    console.log("Column & Line", COLUMN_AND_LINE);
    clone.series = COLUMN_AND_LINE;

    setOptions(clone);
  }, [options]);

  const areaColumn = useCallback(() => {
    const clone = { ...options };

    console.log("Column & Area", AREA_AND_COLUMN);
    clone.series = AREA_AND_COLUMN;

    setOptions(clone);
  }, [options]);
  return (
    <div className="w-full h-full">

      <div className="h-4/5">
        <AgChartsReact ref={chartRef} options={options} />
      </div>
    </div>
  );
}

function tooltipRenderer(params: AgCartesianSeriesTooltipRendererParams) {
  const { yValue, xValue } = params;
  return {
    content: `${xValue}: ${yValue}%`,
  };
}
const WOMEN: AgBarSeriesOptions = {
  type: "column",
  xKey: "year",
  yKey: "women",
  yName: "Women",
  grouped: true,
  strokeWidth: 0,
  tooltip: {
    renderer: tooltipRenderer,
  },
};
const MEN: AgBarSeriesOptions = {
  type: "column",
  xKey: "year",
  yKey: "men",
  yName: "Men",
  grouped: true,
  strokeWidth: 0,
  tooltip: {
    renderer: tooltipRenderer,
  },
};
const PORTIONS: AgLineSeriesOptions = {
  type: "line",
  xKey: "year",
  yKey: "portions",
  yName: "Portions",
  strokeWidth: 3,
  marker: {
    enabled: false,
  },
  tooltip: {
    renderer: tooltipRenderer,
  },
};
const COLUMN_AND_LINE: AgCartesianSeriesOptions[] = [
  { ...WOMEN, type: "column" },
  { ...MEN, type: "column" },
  { ...PORTIONS, type: "line" },
];
const AREA_AND_COLUMN: AgCartesianSeriesOptions[] = [
  { ...PORTIONS, type: "area" },
  { ...WOMEN, type: "column" },
  { ...MEN, type: "column" },
];
