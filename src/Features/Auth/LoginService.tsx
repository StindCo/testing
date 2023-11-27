import { useDispatch } from "react-redux";
import { UsersManagementFetcher } from "../../shared/fetchers/Axios";
import { loginUser } from "../../shared/reducers/login";

export const LoginService: any = {};

LoginService.login = async (username: string, password: string) => {

  try {
    let response: any = await UsersManagementFetcher.post("/auths", {
      username,
      password,
    });

    localStorage.setItem("token", response?.headers.get("x-jwt-token"));


    return { data: response?.data, message: "ok" };
  } catch (err: any) {
    if (err?.response?.data?.message == "username-error")
      return "Il n'existe aucun compte avec cet identifiant.";
    if (err?.response?.data?.message == "password-error")
      return "Le mot de passe saisi est incorrect.";
    if (err?.code == "ERR_NETWORK")
      return "Erreur système";
  }

  let token = await localStorage.get("token");
};

LoginService.updatePassword = function (
  username: any,
  oldPassword: string,
  newPassword: string
) {};

LoginService.logout = function () {};
