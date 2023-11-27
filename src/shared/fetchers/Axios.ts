import axios from "axios";

export const UsersManagementFetcher = axios.create({
  baseURL: "http://50.116.39.140:8080/v1/users-management",
  timeout: 40000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const UsersManagementFetcherSecurity = (token: string) => {
  return axios.create({
    baseURL: "http://50.116.39.140:8080/v1/users-management",
    timeout: 40000,
    headers: { "x-jwt-token": token },
  });
};

export const SchemaDiscover = axios.create({
  baseURL: "http://50.116.39.140:8080/v1/schema-discover",
  timeout: 40000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const ProjectManager = axios.create({
  baseURL: "http://50.116.39.140:8080/v1/project-manager",
  timeout: 40000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const DataLoader = axios.create({
  baseURL: "http://50.116.39.140:8080/v1",
  timeout: 40000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const Runner = axios.create({
  baseURL: "http://50.116.39.140:3000/v1",
  timeout: 40000,
  // headers: {'X-Custom-Header': 'foobar'}
});
