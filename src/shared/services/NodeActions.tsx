import alasql from "alasql";
import {
  loadData,
  loadDataFromOperateur,
} from "../../Features/DataTool/services/ImportationService";
import { Runner } from "../fetchers/Axios";

const filterCode = (code: string, params: any) => {
  let regex = /{([^}]+)}/g;
  let results = [];
  let match;
  while ((match = regex.exec(code))) {
    results.push(match[1]);
  }
  return results.reduce((previous, value: string) => {
    let codeFinal = previous.replace(
      `{${value}}`,
      params[value] ?? `{${value}}`
    );
    return codeFinal;
  }, code);
};

export const ArpuNodeFunction = (arpuType: any, operateur: any = null) => {
  return Runner.get(
    `/arpu-${arpuType}${
      operateur == null ? "" : "?operateurTag=" + operateur?.tag
    }`
  );
};

export const ModelNodeFunction = (
  tableSelected: any,
  operateur: any = null
) => {
  let response;
  if (operateur == null) {
    response = loadData(tableSelected);
  } else {
    response = loadDataFromOperateur(tableSelected, operateur);
  }
  return response;
};

export const LocalRunnerNodeFunction = (
  { code, params }: any,
  dataInput: any
) => {
  try {
    return alasql(`${filterCode(code, params)}`, [dataInput, dataInput]);
  } catch (e) {
    console.warn(e);
  }
};

export const LocalMultiRunnerNodeFunction = (
  { code, params }: any,
  input_a: any,
  input_b: any
) => {
  return alasql(`${filterCode(code, params)}`, [input_a, input_b]);
};
