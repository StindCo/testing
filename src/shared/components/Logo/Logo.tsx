import React from "react";
import logo from "../../../assets/images/mylogo.svg";

type Props = {
  propStyle: any;
  type: string;
};

export default function Logo({ propStyle, type }: Props) {
  return (
    <div>
      {type == "arptc" && (
        <img src={logo} className={propStyle} alt="arptc logo" />
      )}
      {type == "depminer" && (
        <h1 className={`font-bold ${propStyle}`}>Depminer</h1>
      )}
    </div>
  );
}
