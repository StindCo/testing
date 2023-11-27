import React, { useEffect, useState } from "react";
import { UsersManagementFetcherSecurity } from "../../shared/fetchers/Axios";
import createUserImage from "../../assets/images/createUser.svg";

type Props = {};

export default function Account({}: Props) {
  const [view, setView] = useState("all");
  const [users, setUsers] = useState([]);
  const [formAUsername, setFormAUsername] = useState<any>("");
  const [formAPassword, setFormAPassword] = useState<any>("");
  const [formAFullname, setFormAFullname] = useState<any>("");
  const [formAPrivilegeID, setFormAPrivilegeID] = useState<any>(1);

  const createUser = () => {
    let token: any = localStorage.getItem("token");
    UsersManagementFetcherSecurity(token)
    .post("/accounts", {username: formAUsername, password: formAPassword,
      fullname: formAFullname,
      privilegeID: formAPrivilegeID})
    .then(() => {
      UsersManagementFetcherSecurity(token)
      .get("/accounts")
      .then(({ data }) => {
        setFormAUsername("");
        setFormAFullname("");
        setFormAPassword("");
        setFormAPrivilegeID(1);
        setUsers(data);
        setView("all");
      });
    });
    UsersManagementFetcherSecurity(token)
    .get("/accounts")
    .then(({ data }) => {
      console.log(data);
      setUsers(data);
    });
  }

  useEffect(() => {
    let token: any = localStorage.getItem("token");
    UsersManagementFetcherSecurity(token)
      .get("/accounts")
      .then(({ data }) => {
        console.log(data);
        setUsers(data);
      });
  }, []);

  return (
    <div className="h-full  w-full  p-8">
      <div className=" h-full  w-full bg-white rounded-lg p-4 pt-14">
        <h1 className="text-3xl p-8 px-14">GESTION DES UTILISATEURS</h1>
        <div className="tabs tabs-boxed mx-14 p-2 text-lg bg-slate-100">
          <a
            onClick={() => setView("profile")}
            className={`tab ${view == "profile" ? "tab-active" : ""} `}
          >
            Mon compte
          </a>
          <a
            onClick={() => setView("all")}
            className={`tab ${view == "all" ? "tab-active" : ""} `}
          >
            Tous les utilisateurs
          </a>
          <a
            onClick={() => setView("new")}
            className={`tab ${view == "new" ? "tab-active" : ""} `}
          >
            Créer un utilisateur
          </a>
        </div>
        {view == "all" && (
          <div className="mx-14 pt-8 ">
            <table className="table table-sm  w-full">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Nom complet</th>
                  <th>Identifiant</th>
                  <th>Téléphone</th>
                  <th>Privilège</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {users.map((value: any, index: number) => (
                  <tr className="" key={Math.random()}>
                    <th>{index + 1}</th>
                    <td>{value.fullname}</td>
                    <td>{value.username}</td>
                    <td>{value.phoneNumber ?? "-"}</td>
                    <td>{value?.privilege?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {view == "new" && (
          <div className="flex pt-8 items-center justify-around mx-14">
            <div className="w-2/4 space-y-3">
              <div className="form-control w-full flex flex-row">
                <div>
                <label className="label">
                  <span className="label-text">Nom complet</span>
                </label>
                <input
                  type="text"
                  value={formAFullname}
                  onChange={(e) => setFormAFullname(e.target.value)}
                  placeholder="Nom complet"
                  className="input input-bordered w-full"
                />
                </div>
                <div>
                <label className="label">
                  <span className="label-text">Identifiant</span>
                </label>
                <input
                  type="text"
                  value={formAUsername}
                  onChange={(e) => setFormAUsername(e.target.value)}
                  placeholder="Identifiant"
                  className="input input-bordered w-full"
                />
                </div>
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Privelège</span>
                </label>
                <select
                value={formAPrivilegeID}
                onChange={(e) => setFormAPrivilegeID(e.target.value)}
                                    className="select select-bordered w-full"
                                  >
                                    <option disabled selected>
                                      Choisir un privilège
                                    </option>
                                    <option value="2">
                                      Administrateur
                                    </option>
                                    <option value="4">Enquêteur</option>
                                    <option value="1">Analyste</option>
                                    <option value="3">
                                      Statiticien
                                    </option>
                                    <option value="5">
                                      Opérateur
                                    </option>
                                  </select>
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Mot de passe</span>
                </label>
                <input
                  type="password"
                  value={formAPassword}
                  onChange={(e) => setFormAPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control w-full">

                <input
                  onClick={() => createUser()}
                  type="submit"
                  placeholder="Nom complet"
                  className="btn btn-primary w-full"
                />
              </div>
            </div>
            <img src={createUserImage} className="w-[300px] h-[300px] shadow-lg  p-3 border rounded-full" />
          </div>
        )}
      </div>

      <div></div>
    </div>
  );
}
