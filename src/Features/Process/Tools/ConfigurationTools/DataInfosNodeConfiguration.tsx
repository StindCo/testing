import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import { publish } from "../../../../shared/hooks/events";

import "react-reflex/styles.css";
import { useState, useEffect, useCallback, useRef, useContext } from "react";
import Table from "../../../../shared/components/Table/Table";
import { TbPrompt } from "react-icons/tb";

import Editor from "@monaco-editor/react";
import { BsChevronDown, BsPlay, BsQuestion } from "react-icons/bs";
import alasql from "alasql";
import { ParamsContext } from "../../ParamsContext";

const toSentenceCase = (camelCase: any) => {
    if (camelCase) {
        const result = camelCase.replace(/([A-Z])/g, " $1");
        return result[0].toUpperCase() + result.substring(1).toLowerCase();
    }
    return "";
};

const transpose = (
    data: any[],
    nameOfColumnToPivot: string,
    nameOfNewColumn: string
) => {
    let columnsKey = [nameOfNewColumn];
    data.forEach((row) => {
        if (!columnsKey.includes(row[nameOfColumnToPivot])) {
            columnsKey = [...columnsKey, row[nameOfColumnToPivot]];
        }
    });

    let rowsKey = Object.keys(data[0]).filter(
        (key) => key != nameOfColumnToPivot
    );

    let final = rowsKey.map((row) => {
        let value: any = {};

        columnsKey.forEach((column) => {
            if (column == nameOfNewColumn) {
                value[nameOfNewColumn] = toSentenceCase(row);
            } else {
                let arr = data.filter((d) => d[nameOfColumnToPivot] == column)[0];
                if (arr != null) {
                    value[column] = arr[row];
                } else {
                    value[column] = null;
                }
            }
        });

        return value;
    });

    return final;
};

export default function DataInfosNodeConfiguration({ details }: any) {
    const params = useContext(ParamsContext);
    const [tableSelected, setTableSelected] = useState<any>();
    const [operateurSelected, setOperateurSelected] = useState<any>(null);
    const [canSave, setCanSave] = useState(false);
    const [isNameModalShow, setIsNameModalShow] = useState(false);
    const [data, setData] = useState<any>(details.data?.input ?? []);
    const [dataLoaded, setDataLoaded] = useState<any[]>(data);
    const [keys, setKeys] = useState<any>([]);
    const [isAnimate, setIsAnimate] = useState(false);
    const [view, setView] = useState<any>("editor");
    const [selectedKeys, SetSelectedKeys] = useState<any>([]);
    const [name, setName] = useState(
        details.data?.name ?? "Requête " + details.id
    );
    const [code, setCode] = useState<any>(details.data?.code ?? "");
    const [result, setResult] = useState([]);

    const animate = () => {
        setIsAnimate(true);
        setTimeout(() => setIsAnimate(false), 1000);
    };

    useEffect(() => {
        if (data[0] != null) {
            setKeys(Object.keys(data[0]));
        }
        // execute();
    }, [data]);



    const saveConfig = () => {
        let config: any = {};
        config.tableSelected = tableSelected;
        config.operateur = operateurSelected;
        config.isDataLoaded = true;
        config.code = code;

        let dataToSend: any = details.data;
        dataToSend["output"] = transpose(result, 'name', 'indicateurs');
        dataToSend.config = config;

        publish("onSaveConfig-" + details.id, { dataToSend });
        publish("closeConfigNode", {});
    };


    useEffect(() => {
        console.log(result)
    }, [result])

    const calculate = () => {
        let resultA: any = result;

        const getResume: any = (index: number) => {
            if (selectedKeys[index] >= selectedKeys.length) {

                return;
            };
            let key: any = selectedKeys[index];
            if (typeof data[0][key] == "number") {
                let summarize = alasql(`SELECT "${key}" as name, AVG(${key}) as mean, MAX(${key}) as maximum, Min(${key}) as minimum, SUM(${key}) as somme, COUNT(${key}) as nbr FROM ?`, [data, data])[0];
                let mean = data
                    .map((object: any) => object[key])
                    .reduce((sum: any, age: any) => sum + age, 0)
                    / data.length;

                let variance = data
                    .map((object: any) => (object[key] - mean) ** 2)
                    .reduce((sum: any, variance: any) => sum + variance, 0)
                    / data.length - 1;
                const standardDeviation = Math.sqrt(variance);

                const mode: number[] = data.reduce((counts: any, object: any) => {
                    if (!counts[object[key]]) {
                        counts[object[key]] = 0;
                    }

                    counts[object[key]]++;

                    return counts;
                }, {});

                const propertyValues = data.map((object: any) => object[key]);

                const minimum = Math.min(...propertyValues);
                const maximum = Math.max(...propertyValues);

                const range = maximum - minimum;
                const squaredDeviations = data.map((object: any) => (object[key] - mean) ** 2);
                const standardError = Math.sqrt(variance / data.length - 1);

                const highestCount = Math.max(...Object.values(mode));
                const modeValue: any = Object.keys(mode).find(
                    (value: any) => mode[value] === highestCount
                );

                const marginOfError = standardDeviation * Math.sqrt(1 - 0.95);

                const lowerBound = mean - marginOfError;
                const upperBound = mean + marginOfError;

                const confidenceLevelPercentage = (data.filter((object: any) => object[key] >= lowerBound && object[key] <= upperBound).length / data.length) * 100;
                const thirdMoment = data.reduce((sum:any, object:any) => sum + (object[key] - mean) ** 3, 0) / data.length;

                const skewness = thirdMoment / (standardDeviation ** 3);

                summarize['variance'] = variance.toFixed(3);
                summarize['StandardError'] = standardError.toFixed(3);
                summarize['ConfidenceLevelPercentage'] = confidenceLevelPercentage.toFixed();
                summarize['mode'] = modeValue;
                summarize['skewness'] = skewness;
                summarize['range'] = range;
                summarize['DeviationStandart'] = standardDeviation.toFixed(3);

                // others functions

                resultA.push(summarize);
                setResult(resultA);
            }

            setTimeout(() => getResume(index + 1), 200)
        }

        getResume(0);
    }

    const toggleKeyInSelection = (value: any) => {
        let selected = selectedKeys;
        if (selectedKeys.includes(value)) {
            selected = selected.filter((e: any) => e !== value);
        } else {
            selected.push(value);
        }
        console.log(selected);
        SetSelectedKeys(selected);
    }



    return (
        <>
            <div>
                <header className="border-b border-slate-200 p-2 px-3 w-full flex flex-row items-center justify-between">
                    <h3 className="text-xl flex flex-row items-center space-x-4">
                        <span className="p-2 px-3 border bg-slate-700 text-white rounded-xl">
                            <TbPrompt size={25} />
                        </span>
                        <span>Statistiques descriptives</span>
                    </h3>
                    <div className="space-x-2 items-center flex">
                        <button
                            onClick={(e) => publish("closeConfigNode", {})}
                            className="px-3 text-sm hover:bg-[#db3e3ed5] py-2 bg-red-600 text-white rounded-lg"
                        >
                            Annuler
                        </button>
                        <button className={`px-3 text-sm text-white flex items-center`}>
                            <span
                                onClick={(e) => saveConfig()}
                                className={`cursor-pointer hover:bg-slate-600 bg-slate-800  px-3 py-2 rounded-lg`}
                            >
                                Sauvegarder
                            </span>

                        </button>
                    </div>
                </header>

                <div className="w-full h-[550px] overflow-hidden flex flex-row items-start">
                    <div className="items-center h-full flex flex-col w-20 bg-white border-r py-3 space-y-5">
                        <div
                            onClick={(e) => setView(view == "gpt" ? "editor" : "gpt")}
                            className={`bg-white border shadow-md cursor-pointer  p-1 rounded-lg `}
                        >
                            {view == "editor" && <BsQuestion className="text-xl" size={40} />}
                            {view == "gpt" && <TbPrompt className="text-xl" size={40} />}
                        </div>
                        <div
                            onClick={(e) => calculate()}
                            className={`animatecss ${isAnimate
                                ? "animatecss-tada bg-red-400 text-white"
                                : "text-red-400"
                                } bg-white border shadow-md cursor-pointer  p-1 rounded-lg `}
                        >
                            <BsPlay className="text-xl" size={40} />
                        </div>
                    </div>
                    <div className="w-full h-full bg-[#f5f5f5]">
                        {view == "editor" && (
                            <ReflexContainer orientation="horizontal">
                                <ReflexElement className="top-pane" >
                                    <div
                                        className="pane-content h-full bg-[#f5f5f5] p-8"
                                    >
                                        <h1 className="text-xl font-[PoppinsBold]">Choix des variables.</h1>
                                        <div className="grid grid-cols-6 gap-10 mt-10 w-full">
                                            {keys.map((value: any, index: number) => (
                                                <div key={index} className="form-control truncate p-3 bg-zinc-200 rounded-lg">
                                                    <label className="label cursor-pointer flex items-center">
                                                        <span className="label-text truncate w-2/3">{value}</span>
                                                        <input type="checkbox" onChange={() => toggleKeyInSelection(value)} className="checkbox checkbox-primary" />
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => calculate()} className="btn mt-8 rounded-lg mb-8">Avoir un résumé statistique</button>
                                    </div>
                                </ReflexElement>

                                <ReflexSplitter propagate={true} />

                                <ReflexElement minSize={70} size={70} className="bottom-pane h-[500px]">
                                    <div className=" text-lg border-b p-3 px-4 bg-slate-800 text-white">
                                        Prévisualisation
                                    </div>
                                    <div>
                                        <Table data={dataLoaded} />
                                    </div>
                                </ReflexElement>
                            </ReflexContainer>
                        )}

                        {view == "gpt" && (
                            <div>
                                <div className="w-full h-[550px]">
                                    <iframe
                                        src={`https://ora.ai/embed/897cdf24-9921-49a3-aa5c-479ea8fff229`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: "0", borderRadius: "4px" }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <div className={`modal ${isNameModalShow && "modal-open"}`}>
                    <div className="modal-box no-scrollBar  w-3/5 max-w-2xl">
                        <div className="flex flex-row px-2 items-center justify-between">
                            <h3 className="text-xl font-bold">
                                Définir le nom de la requête
                            </h3>
                            <label
                                htmlFor="my-modal-3"
                                onClick={(e) => setIsNameModalShow(false)}
                                className="btn btn-sm btn-circle"
                            >
                                ✕
                            </label>
                        </div>
                        <div className=" mt-2 p-3">
                            <form
                                onSubmit={(e) => {
                                    saveConfig();
                                    setIsNameModalShow(false);
                                    e.preventDefault();
                                }}
                            >
                                <div className="">
                                    <input
                                        defaultValue={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Insérer le nom de la requête"
                                        className="w-full input input-bordered"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
