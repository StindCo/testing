import { BsAlarm, BsXLg, BsXSquare } from "react-icons/bs";

type Props = {
  message: any;
  type: string;
};

export default function Toast({ message, type }: Props) {
  return (
    <div className="toast toast-start toast-bottom ">
      <div className={`alert  alert-error mb-8 shadow-lg`}>
        <div className="w-full">
          {type == "error" && <BsXLg className="text-white mr-2" />}

          <span className={`${type == "error" ? "text-white" : ""}`}>
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}
