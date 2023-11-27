import React from "react";
import { publish } from "../../../shared/hooks/events";

type Props = {
  projet: any;
};

export default function ProjetVisualize({ projet }: Props) {
  return (
    <div className="w-full h-screen pb-[300px] pt-1 no-scrollBar overflow overflow-y-scroll">
      <h4 className="w-full flex items-center justify-between rounded-full mt-2 border p-3 px-5 bg-slate-50 text-lg mb-2">
        <span className="font-bold text-2xl">Visualisation des sorties</span>{" "}
        <span
          onClick={() => publish("close-search-view", {})}
          className="text-sm text-red-600 cursor-pointer"
        >
          annuler
        </span>{" "}
      </h4>

      {[].length == 0 && (
        <div className="text-center text-orange-500 border-orange-500 border mx-auto h-20 mt-36 flex flex-col items-center justify-center rounded-lg w-2/5   text-sm">
          <h1>Aucun projet trouvé</h1>
        </div>
      )}
    </div>
  );
}
