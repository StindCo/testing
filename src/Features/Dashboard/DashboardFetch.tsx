import {
  SchemaDiscover,
  UsersManagementFetcher,
  UsersManagementFetcherSecurity,
} from "../../shared/fetchers/Axios";

export const fetchOperateurs = async () => {
  try {
    let response = await UsersManagementFetcher.get("/operateurs");
    return response?.data;
  } catch (error) {}
};

export const verifyUser = async () => {
  try {
    let token: any = localStorage.getItem("token");

    let response = await UsersManagementFetcherSecurity(token ?? "").get(
      "/auths/verify"
    );

    return response;
  } catch (error) {}
};

export const fetchSchemas = async () => {
  try {
    let response = await SchemaDiscover.get("/tables");
    return response?.data;
  } catch (error) {}
};
