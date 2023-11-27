import {
  loadData,
  loadDataFromOperateur,
} from "../../Features/DataTool/services/ImportationService";
import { Runner } from "../fetchers/Axios";
import {
  LocalMultiRunnerNodeFunction,
  LocalRunnerNodeFunction,
} from "./NodeActions";

const mois = [
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
];

export function ModelAction(node: any) {
  return new Promise(async function (myResolve, myReject) {
    try {
      if (node.data.config != null) {
        let response;
        if (node.data.config.operateur == null) {
          response = await loadData(node.data.config?.tableSelected);
        } else {
          response = await loadDataFromOperateur(
            node.data.config?.tableSelected,
            node.data.config?.operateur
          );
        }
        let result = response.data.map((item: any) => {
          (item.periodDesc = item.period?.trimester + "-" + item?.period?.year),
            (item.periodMonth = item?.period?.month),
            (item.periodTrimester = item?.period?.trimester),
            (item.periodYear = item?.period?.year);
          (item.periodName = mois[parseInt(item.periodMonth) - 1]),
            (item.period = null);
          return item;
        });
        // console.log(result)
        myResolve(result);
      }
    } catch (e) {
      myReject();
    }
  });
}

export function ArpuFunction(node: any) {
  return new Promise(async function (myResolve, myReject) {
    try {
      if (node.data.config != null) {
        let response;
        response = await Runner.get(
          `/arpu-${node.data.config.arpuType}${
            node.data.config.operateur == null
              ? ""
              : "?operateurTag=" + node.data.config?.operateur?.tag
          }`
        );

        let result = response.data;
        result = result.map((item: any) => {
          Object.keys(item).forEach((key) => {
            if (
              key.includes("total") ||
              key.includes("arpu") ||
              key.includes("month")
            )
              item[key] = parseFloat(item[key]);
          });
          if (item.trimester != null && item.month != 0) {
            item.type = "Mois";
            item.name = mois[parseInt(item.month) - 1];
          } else if (item.trimester != null && item.month == 0) {
            item.type = "Trimestre";
            item.name = item.trimester + " - " + item.year;
          } else if (item.trimester == null) {
            item.type = "Année";
            item.name = item.year;
          }
          return item;
        });

        myResolve(result);
      }
    } catch (e) {
      myReject(e);
    }
  });
}

export function MbouFunction(node: any) {
  return new Promise(async function (myResolve, myReject) {
    try {
      if (node.data.config != null) {
        let response;

        response = await Runner.get(
          `/mbou${
            node.data.config?.operateur == null
              ? ""
              : "?operateurTag=" + node.data.config?.operateur?.tag
          }`
        );

        let result = response.data;
        result = result.map((item: any) => {
          Object.keys(item).forEach((key) => {
            if (
              key.includes("total") ||
              key.includes("arpu") ||
              key.includes("month")
            )
              item[key] = parseFloat(item[key]);
          });
          if (item.trimester != null && item.month != 0) {
            item.type = "Mois";
            item.name = mois[parseInt(item.month) - 1];
          } else if (item.trimester != null && item.month == 0) {
            item.type = "Trimestre";
            item.name = item.trimester + " - " + item.year;
          } else if (item.trimester == null) {
            item.type = "Année";
            item.name = item.year;
          }
          return item;
        });

        myResolve(result);
      }
    } catch (e) {
      myReject(e);
    }
  });
}

export function ArpmFunction(node: any) {
  return new Promise(async function (myResolve, myReject) {
    try {
      if (node.data.config != null) {
        let response;

        response = await Runner.get(
          `/arpm-global${
            node.data.config?.operateur == null
              ? ""
              : "?operateurTag=" + node.data?.config?.operateur?.tag
          }`
        );

        let result = response.data;
        result = result.map((item: any) => {
          Object.keys(item).forEach((key) => {
            if (
              key.includes("total") ||
              key.includes("arpu") ||
              key.includes("month")
            )
              item[key] = parseFloat(item[key]);
          });
          if (item.trimester != null && item.month != 0) {
            item.type = "Mois";
            item.name = mois[parseInt(item.month) - 1];
          } else if (item.trimester != null && item.month == 0) {
            item.type = "Trimestre";
            item.name = item.trimester + " - " + item.year;
          } else if (item.trimester == null) {
            item.type = "Année";
            item.name = item.year;
          }
          return item;
        });

        myResolve(result);
      }
    } catch (e) {
      myReject(e);
    }
  });
}

export function MouFunction(node: any) {
  return new Promise(async function (myResolve, myReject) {
    try {
      if (node.data.config != null) {
        let response;
        response = await Runner.get(
          `/mou-${node.data.config?.mouType}${
            node.data.config?.operateur == null
              ? ""
              : "?operateurTag=" + node.data.config?.operateur?.tag
          }`
        );
        let result = response.data;
        result = result.map((item: any) => {
          Object.keys(item).forEach((key) => {
            if (
              key.includes("total") ||
              key.includes("arpu") ||
              key.includes("month")
            )
              item[key] = parseFloat(item[key]);
          });
          if (item.trimester != null && item.month != 0) {
            item.type = "Mois";
            item.name = mois[parseInt(item.month) - 1];
          } else if (item.trimester != null && item.month == 0) {
            item.type = "Trimestre";
            item.name = item.trimester + " - " + item.year;
          } else if (item.trimester == null) {
            item.type = "Année";
            item.name = item.year;
          }
          return item;
        });
        myResolve(result);
      }
    } catch (e) {
      myReject(e);
    }
  });
}

export function LocalRunnerFunction(node: any, params: any) {
  return new Promise(function (myResolve, myReject) {
    try {
      if (node.data.config.code == "" || node.data.config.code == null) {
        myReject({});
        return;
      }

      let result: any = LocalRunnerNodeFunction(
        { code: node.data.config.code, params },
        node.data.input
      );
      myResolve(result);
    } catch (e) {
      myReject(e);
    }
  });
}

export function LocalMultipleRunnerFunction(node: any, params: any) {
  return new Promise(function (myResolve, myReject) {
    try {
      if (node.data.config.code == "" || node.data.config.code == null) {
        myReject({});
        return;
      }
      myResolve(
        LocalMultiRunnerNodeFunction(
          { code: node.data.config.code, params },
          node.data.input_a,
          node.data.input_b
        )
      );
    } catch (e) {
      myReject(e);
    }
  });
}

const toSentenceCase = (camelCase: any) => {
  if (camelCase) {
    const result = camelCase.replace(/([A-Z])/g, " $1");
    return result[0].toUpperCase() + result.substring(1).toLowerCase();
  }
  return "";
};

const transpose = (
  data: any[],
  nameOfColumnToPivot: string,
  nameOfNewColumn: string
) => {
  let columnsKey = [nameOfNewColumn];
  data.forEach((row) => {
    if (!columnsKey.includes(row[nameOfColumnToPivot])) {
      columnsKey = [...columnsKey, row[nameOfColumnToPivot]];
    }
  });

  let rowsKey = Object.keys(data[0]).filter(
    (key) => key != nameOfColumnToPivot
  );

  let final = rowsKey.map((row) => {
    let value: any = {};

    columnsKey.forEach((column) => {
      if (column == nameOfNewColumn) {
        value[nameOfNewColumn] = toSentenceCase(row);
      } else {
        let arr = data.filter((d) => d[nameOfColumnToPivot] == column)[0];
        if (arr != null) {
          value[column] = arr[row];
        } else {
          value[column] = null;
        }
      }
    });

    return value;
  });

  return final;
};
export function TranspositionFunction(node: any) {
  return new Promise(function (myResolve, myReject) {
    try {
      myResolve(
        transpose(
          node.data.input,
          node.data.config.columnToPivot,
          node.data.config.nameOfNewPrincipaleColumn
        )
      );
    } catch (e) {
      myReject(e);
    }
  });
}
