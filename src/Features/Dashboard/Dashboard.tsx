import { useEffect, useState } from "react";
import {
  BsChatLeftDots,
  BsDatabase,
  BsFiles,
  BsFolder,
  BsGear,
  BsHouse,
  BsPerson,
  BsPlayCircle,
  BsPuzzle,
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/mylogo.png";
import Loader from "../../shared/components/Loader/Loader";
import { loadOperateurs } from "../../shared/reducers/operateurs";
import { loadSchema } from "../../shared/reducers/schema";
import { fetchOperateurs, fetchSchemas, verifyUser } from "./DashboardFetch";
import ParticlesBg from "particles-bg";
import { loginUser } from "../../shared/reducers/login";
import Editor from "@monaco-editor/react";
import { ProjectManager } from "../../shared/fetchers/Axios";
import { PatternsContext } from "./PatternsContext";

type Props = {
  message: any;
  type: string;
};

export default function Dashboard() {
  let navigate = useNavigate();
  let location = useLocation();
  let [patterns, setPatterns] = useState([]);
  let dispatch = useDispatch();
  let [currentColor, setCurrentColor] = useState(0);
  const colors = ["#2f5377", "#ff0000", "0099cc"];

  useEffect(() => {
    fetchOperateurs().then((data) =>
      dispatch(loadOperateurs({ operateurs: data }))
    );
    fetchSchemas().then((data) => dispatch(loadSchema({ schema: data })));


    verifyUser()
      .then((response: any) => {
        if (response.data == "") navigate("/");
        if (response?.status == 200) {
          console.log(response.data);
          dispatch(loginUser({ user: response?.data }));
          localStorage.setItem("token", response?.headers?.get("x-jwt-token"));
        } else navigate("/");
      })
      .catch((err) => navigate("/"));

    ProjectManager.get("/process").then(({ data }) => {
      setPatterns(data);
    });

    setInterval(() => {
      setCurrentColor(Math.floor(Math.random() * (colors.length - 1 - 0) + 0));
    }, 5000);
  }, []);

  return (
    <>
      <Loader />
      <ParticlesBg
        type="cobweb"
        num={250}
        color={colors[currentColor]}
        bg={true}
      />
      <div
        className={`h-screen w-screen overflow-hidden flex flex-row  bg-[#edeff1aa] ${
          location.pathname == "/dashboard/project" ? "" : "backdrop-blur-sm"
        } `}
      >
        <div className="w-20 h-full  flex flex-col justify-between pb-3">
          <div className="w-full">
            <Link to="/dashboard/projects">
              <img src={logo} className="w-full p-2" alt="arptc logo" />
            </Link>
            <div className="w-full flex bg-white flex-col items-center  shadow-md rounded-xl mt-16">
              <Link
                to="/dashboard/projects"
                data-tip="Page d'acceuil"
                className={`border-r-2  tooltip-right ${
                  location.pathname == "/dashboard/projects"
                    ? "text-[#4067B4] border-[#4067B4]"
                    : ""
                } hover:text-[#4067B4] border-r-3 rounded-t-xl hover:border-[#4067B4] w-full p-5`}
              >
                <BsHouse className="text-2xl w-full" />
              </Link>
              <Link
                to="/dashboard/store"
                data-tip="Schema de la base de donnée"
                className={`border-r-2 ${
                  location.pathname == "/dashboard/store"
                    ? "text-[#4067B4] border-[#4067B4]"
                    : ""
                }  tooltip-right border-r-3 hover:text-blue-900 hover:border-[#4067B4] w-full p-5`}
              >
                {" "}
                <BsDatabase className="text-2xl w-full" />{" "}
              </Link>
              <Link
                to="/dashboard/patterns"
                data-tip="Gestion des projets"
                className={`border-r-2   ${
                  location.pathname == "/dashboard/patterns"
                    ? "text-[#4067B4] border-[#4067B4]"
                    : ""
                }  tooltip-right  hover:text-blue-900 border-r-3 hover:border-[#4067B4] w-full p-5`}
              >
                <BsPuzzle className="text-2xl w-full" />{" "}
              </Link>
              {/* <Link
                to="/dashboard/projects"
                data-tip="Gestion des projets"
                className={`border-r-2   ${
                  location.pathname == "/dashboard/projects"
                    ? "text-[#4067B4] border-[#4067B4]"
                    : ""
                }  tooltip-right  hover:text-blue-900 border-r-3 hover:border-[#4067B4] w-full p-5`}
              >
                <BsFolder className="text-2xl w-full" />{" "}
              </Link> */}
              <Link
                to="/dashboard/process"
                data-tip="Créer et exécuter un process"
                className={`border-r-2 ${
                  location.pathname == "/dashboard/process"
                    ? "text-[#4067B4] border-[#4067B4]"
                    : ""
                }  tooltip-right  hover:text-blue-900 border-r-3 rounded-b-xl hover:border-[#4067B4] w-full p-5`}
              >
                {" "}
                <BsPlayCircle className="text-2xl w-full" />{" "}
              </Link>
            </div>
          </div>
          <div className="w-full flex flex-col items-center space-y-8 mb-7">
            {/* <Link
              to="/dashboard/chat"
              className="indicator hover:text-blue-900 "
            >
              <span className="indicator-item indicator-towallpaper white p rounded-full w-3 h-3 badge-xs bg-orange-500"></span>
              <BsChatLeftDots className="text-2xl w-full" />
            </Link> */}
            {/* <Link
              to="/dashboard/configuration"
              className="indicator hover:text-blue-900"
            >
              <BsGear className="text-2xl w-full" />
            </Link> */}
            <Link
              to="/dashboard/accounts"
              className="indicator hover:text-blue-900"
            >
              <span className="indicator-item indicator-bottom rounded-full w-3 h-3 badge-xs bg-green-500"></span>
              <BsPerson className="text-2xl w-full" />
            </Link>
          </div>
        </div>
        <PatternsContext.Provider value={patterns}>
          <div className="w-full h-full overflow-hidden">
            <Outlet />
          </div>
        </PatternsContext.Provider>
      </div>
    </>
  );
}
