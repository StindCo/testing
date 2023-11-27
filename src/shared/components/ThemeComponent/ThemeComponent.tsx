import React from "react";
import { themeChange } from "theme-change";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { changeTheme } from "../../reducers/theme";
import { BsFillMoonFill, BsSunFill } from "react-icons/bs";

type Props = {};

export default function ThemeComponent({}: Props) {
  const dispatch = useDispatch();

  const [clicked, setClicked] = React.useState(true);

  const toggleTheme = () => {};
  React.useEffect(() => {
    dispatch(changeTheme({}));
  }, [clicked]);

  return (
    <>
      {clicked && (
        <BsFillMoonFill
          onClick={() => {
            setClicked(!clicked);
          }}
          className="text-3xl cursor-pointer items-center mt-2"
        />
      )}

      {!clicked && (
        <BsSunFill
          onClick={() => {
            setClicked(!clicked);
          }}
          className="text-3xl cursor-pointer items-center mt-2"
        />
      )}
    </>
  );
}
