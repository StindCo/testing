import { DataLoader } from "../../../shared/fetchers/Axios";

export function importData(table: any, user: any, operateur: any, datas: any) {
  let dataToImport: any = {
    userID: user.id,
    operateurTag: operateur?.tag,
    schematableId: table?.id,
    period: datas.period,
    value: datas,
  };

  return DataLoader.post(`/data-loader?url=${table?.url}`, {
    ...dataToImport,
  });
}

export function loadDataFromOperateur(table: any, operateur: any) {
  return DataLoader.get(`/data-loader/operateurs/${operateur?.id}?url=${table?.url}`);
}


export function loadData(table: any) {
  return DataLoader.get(`/data-loader?url=${table?.url}`);
}
