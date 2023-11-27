import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getCurrentTheme } from "../../shared/reducers/theme";
import loginImage from "../../assets/images/loginImage.jpg";
import bgLogin from "../../assets/images/bgLogin.jpg";
import FadeIn from "react-fade-in/lib/FadeIn";
import Loader from "../../shared/components/Loader/Loader";
import Logo from "../../shared/components/Logo/Logo";
import { useEffect, useState } from "react";
import { LoginService } from "./LoginService";
import Toast from "../../shared/components/Toast/Toast";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../shared/reducers/login";

type Props = {};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [IsErrorMessageVisible, setIsErrorMessageVisible] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const validateUsername = () => {
    setIsUsernameValid(username != "");
  };

  const validatePassword = () => {
    setIsPasswordValid(password != "");
  };

  let currentTheme = useSelector(getCurrentTheme);

  const onSubmit = (e: any) => {
    validateUsername();
    validatePassword();

    if (isPasswordValid && isUsernameValid) {
      let response: any = LoginService.login(username, password).then(
        (data: any) => {
          if (data.message == "ok") {
            dispatch(loginUser({user: data?.data}));
            navigate("/dashboard/projects");
          }
          toggleMessageError(data);
        }
      );
    }

    e.preventDefault();
  };

  const toggleMessageError = (text: any) => {
    setErrorMessage(text);
    setIsErrorMessageVisible(true);
    setTimeout(() => {
      setIsErrorMessageVisible(false);
    }, 5000);
  };

  return (
    <>
      <Loader />
      {IsErrorMessageVisible && <Toast type="error" message={errorMessage} />}

      <FadeIn className="overflow-hidden">
        <div
          className="bg-white h-screen overflow-hidden overlflow-y-scroll pt-8 pl-8 "
          style={{
            backgroundImage: `url(${bgLogin})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <Logo type="arptc" propStyle="mb-16" />

          <div className=" w-screen flex flex-row justify-around items-center">
            <div className="w-2/5">
              <img className="w-full h-full" src={loginImage} />
            </div>
            <div className="">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <Logo
                  type="depminer"
                  propStyle={"text-3xl text-center  font-[PoppinsBold]"}
                />
                <hr className="mt-8" />
                <div className="p-5">
                  <h2 className="text-xl">Salut !</h2>
                  <h4>
                    Veuillez vous connecter afin de pouvoir d'administrer vos
                    données.
                  </h4>
                </div>
                <div className="px-5">
                  <form method="post" onSubmit={onSubmit}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Identifiant</span>
                      </label>
                      <input
                        type="text"
                        placeholder="email"
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={() => validateUsername()}
                        className={
                          isUsernameValid
                            ? "input input-bordered"
                            : "input input-bordered input-error"
                        }
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => validatePassword()}
                        className={
                          isPasswordValid
                            ? "input input-bordered"
                            : "input input-bordered input-error"
                        }
                      />
                      <label className="text-right">
                        <a href="#" className="label-text-alt link  link-hover">
                          Mot de passe oublié ?
                        </a>
                      </label>
                    </div>
                    <div className="form-control mt-6">
                      <button
                        className="py-3 hover:bg-[#3458a0] rounded-md bg-[#4067b4] text-lg text-white"
                        type="submit"
                      >
                        Se connecter
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </>
  );
}
