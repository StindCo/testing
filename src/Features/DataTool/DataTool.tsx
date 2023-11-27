import React from "react";
import {
  BsCloudUpload,
  BsDatabaseDown,
  BsFile,
  BsFiles,
  BsStopCircle,
  BsX,
  BsXCircle,
  BsXLg,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  addTabs,
  getCurrent,
  getTabs,
  removeTabs,
  setCurrent,
} from "../../shared/reducers/datatoolTabs";
import LoaderInner from "../../shared/components/Loader/LoaderInner";
import { useDispatch } from "react-redux";
import MainView from "./MainView";
import DataImport from "./DataImport";
import DataTable from "./DataTable";
import DataTableMain from "./DataTableMain";

type Props = {
  propStyle: any;
  type: string;
};

export default function DataTool() {
  let tabs: any = useSelector(getTabs);
  let tabCurrentIndex: any = useSelector(getCurrent);

  const dispatch: any = useDispatch();

  return (
    <>
      <div className=" h-full  w-full">
        <div className="h-full p-8  w-full rounded-lg shadow-xl">
          <div className=" select-none items-center border-b-2 rounded-t-xl border-[#cccccc33] flex bg-white">
            <div className="w-full h-full rounded-t-xl snap-mandatory snap-x hover:snap-none whitespace-nowrap flex justify-start no-scrollBar overflow-x-scroll scroll scroll-smooth">
              {tabs.map((tab: any, index: any) => (
                <div
                  onClick={() => dispatch(setCurrent({ index }))}
                  key={index}
                  className={`py-3 flex items-center cursor-pointer ${
                    index == tabCurrentIndex
                      ? "snap-center border shadow-xs rounded-lg font-[PoppinsBold] text-slate-600"
                      : "border-0 hover:bg-[#fafafa]"
                  }  pl-16 ${
                    tab?.is_revokable == true ? "pr-8" : "pr-16"
                  }  border-b-0  bg-white space-x-10`}
                >
                  <div
                    onClick={() => dispatch(setCurrent({ index }))}
                    className="flex flex-row cursor-pointer items-center space-x-4"
                  >
                    {tab.type == "import" && <BsCloudUpload size={20} />}
                    {tab.type == "main" && <BsFiles size={20} />}
                    {tab.type == "table" && <BsDatabaseDown size={20} />}
                    <a className="cursor-pointer">{tab?.name}</a>
                  </div>
                  {tab?.is_revokable == true && (
                    <BsXCircle
                      onClick={(e) => {
                        dispatch(removeTabs({ index }));
                        e.stopPropagation();
                      }}
                      className="cursor-pointer hover:text-red-700"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white h-full w-full overflow-hidden overflow-y-scroll no-scrollBar">
            {tabs.map((k: any, index: any) => (
              <div key={index}>
                {k.type == "main" && index == tabCurrentIndex && (
                  <MainView data={k.data} />
                )}

                {k.type == "import" && index == tabCurrentIndex && (
                  <DataImport data={k.data} />
                )}

                {k.type == "table" && index == tabCurrentIndex && (
                  <DataTable data={k.data} />
                )}

                {k.type == "tableAll" && index == tabCurrentIndex && (
                  <DataTableMain data={k.data} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
