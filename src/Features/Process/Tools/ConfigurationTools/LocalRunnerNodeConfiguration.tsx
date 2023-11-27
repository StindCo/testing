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

const filterCode = (code: string, params: any) => {
  var regex = /{([^}]+)}/g;
  var results = [];
  let match;
  while ((match = regex.exec(code))) {
    results.push(match[1]);
  }
  let allCode: any = results.reduce((previous, value: string) => {
    let codeFinal = previous.replace(
      `{${value}}`,
      params[value] ?? `{${value}}`
    );
    return codeFinal;
  }, code);

  return allCode;
};

export default function LocalRunnerNodeConfiguration({ details }: any) {
  const params = useContext(ParamsContext);
  const [tableSelected, setTableSelected] = useState<any>();
  const [operateurSelected, setOperateurSelected] = useState<any>(null);
  const [canSave, setCanSave] = useState(false);
  const [isNameModalShow, setIsNameModalShow] = useState(false);
  const [data, setData] = useState<any>(details.data?.input ?? []);
  const [dataLoaded, setDataLoaded] = useState<any[]>(data);
  const [isAnimate, setIsAnimate] = useState(false);
  const [view, setView] = useState<any>("editor");
  const [name, setName] = useState(
    details.data?.name ?? "Requête " + details.id
  );

  const [code, setCode] = useState<any>(details.data?.code ?? "");

  const animate = () => {
    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 1000);
  };

  useEffect(() => {
    editorRef.current?.focus();
    execute();
  }, []);

  const execute = () => {
    if (code == "") {
      setDataLoaded(data);
      setCanSave(true);
      return;
    }
    try {
      let result: any = alasql(`${filterCode(code, params)}`, [data, data]);
      if (!Array.isArray(result)) result = [{ valeur: result }];
      setDataLoaded(result);
      animate();
      setCanSave(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = useCallback((e: any) => {
    setCode(e);
  }, []);

  const onSave = () => {
    setIsNameModalShow(true);
  };

  const saveConfig = () => {
    let config: any = {};
    config.tableSelected = tableSelected;
    config.operateur = operateurSelected;
    config.isDataLoaded = true;
    config.name = name;
    config.code = code;

    let dataToSend: any = details.data;
    dataToSend["output"] = dataLoaded;
    dataToSend.config = config;

    publish("onSaveConfig-" + details.id, { dataToSend });
    publish("closeConfigNode", {});
  };
  const editorRef = useRef<any>(null);

  function handleEditorDidMount(editor: any, monaco: any): any {
    editorRef.current = editor;
  }

  return (
    <>
      <div>
        <header className="border-b border-slate-200 p-2 px-3 w-full flex flex-row items-center justify-between">
          <h3 className="text-xl flex flex-row items-center space-x-4">
            <span className="p-2 px-3 border bg-slate-700 text-white rounded-xl">
              <TbPrompt size={25} />
            </span>
            <span>Executer une réquête locale - {name}</span>
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
                className={`cursor-pointer hover:bg-slate-600 bg-slate-800  px-3 py-2 rounded-l-lg`}
              >
                Sauvegarder
              </span>
              <div className="dropdown dropdown-end">
                <BsChevronDown
                  tabIndex={0}
                  className="hover:bg-slate-600 px-3 font-bold rounded-r-lg py-2 bg-slate-900 w-full h-full"
                  size={18}
                />
                <ul
                  tabIndex={0}
                  className="dropdown-content menu text-slate-900 p-2 shadow bg-base-100 rounded mt-6  w-64"
                >
                  <li onClick={(e) => onSave()}>
                    <a>Renommer et sauvegarder</a>
                  </li>
                </ul>
              </div>
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
              onClick={(e) => execute()}
              className={`animatecss ${
                isAnimate
                  ? "animatecss-tada bg-red-400 text-white"
                  : "text-red-400"
              } bg-white border shadow-md cursor-pointer  p-1 rounded-lg `}
            >
              <BsPlay className="text-xl" size={40} />
            </div>
          </div>
          <div className="w-full h-full">
            {view == "editor" && (
              <ReflexContainer orientation="horizontal">
                <ReflexElement className="top-pane" minSize={70} size={200}>
                  <div
                    onKeyDown={(e) => {
                      if (e.code == "Enter" && e.shiftKey == true) {
                        execute();
                        e.preventDefault();
                      }
                    }}
                    className="pane-content overflow-hidden flex flex-row items-start h-full bg-[#1e1e1e] py-4"
                  >
                    <Editor
                      height="300px"
                      className="w-full h-screen text-lg"
                      // options={{
                      //   acceptSuggestionOnCommitCharacter: true,
                      //   acceptSuggestionOnEnter: "off",
                      //   accessibilitySupport: "auto",
                      //   autoIndent: true,
                      //   automaticLayout: true,
                      //   codeLens: true,
                      //   colorDecorators: true,
                      //   contextmenu: true,
                      //   cursorBlinking: "blink",
                      //   cursorSmoothCaretAnimation: false,
                      //   cursorStyle: "line",
                      //   disableLayerHinting: false,
                      //   disableMonospaceOptimizations: false,
                      //   dragAndDrop: true,
                      //   fixedOverflowWidgets: false,
                      //   folding: true,
                      //   foldingStrategy: "auto",
                      //   fontLigatures: false,
                      //   formatOnPaste: false,
                      //   formatOnType: false,
                      //   hideCursorInOverviewRuler: false,
                      //   highlightActiveIndentGuide: true,
                      //   links: true,
                      //   mouseWheelZoom: false,
                      //   multiCursorMergeOverlapping: true,
                      //   multiCursorModifier: "alt",
                      //   overviewRulerBorder: true,
                      //   overviewRulerLanes: 2,
                      //   quickSuggestions: true,
                      //   quickSuggestionsDelay: 100,
                      //   readOnly: false,
                      //   renderControlCharacters: false,
                      //   renderFinalNewline: true,
                      //   renderIndentGuides: true,
                      //   renderLineHighlight: "all",
                      //   renderWhitespace: "none",
                      //   revealHorizontalRightPadding: 30,
                      //   roundedSelection: true,
                      //   rulers: [],
                      //   scrollBeyondLastColumn: 5,
                      //   scrollBeyondLastLine: true,
                      //   selectOnLineNumbers: true,
                      //   selectionClipboard: true,
                      //   selectionHighlight: true,
                      //   showFoldingControls: "mouseover",
                      //   smoothScrolling: false,
                      //   suggestOnTriggerCharacters: true,
                      //   wordBasedSuggestions: true,
                      //   wordSeparators: "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
                      //   wordWrap: "off",
                      //   wordWrapBreakAfterCharacters: "\t})]?|&,;",
                      //   wordWrapBreakBeforeCharacters: "{([+",
                      //   wordWrapBreakObtrusiveCharacters: ".",
                      //   wordWrapColumn: 80,
                      //   wordWrapMinified: true,
                      //   wrappingIndent: "none",
                      // }}
                      defaultLanguage="mysql"
                      theme="vs-dark"
                      defaultValue={code}
                      onChange={(e) => onChange(e)}
                      onMount={handleEditorDidMount}
                    />
                  </div>
                </ReflexElement>

                <ReflexSplitter propagate={true} />

                <ReflexElement minSize={70} className="bottom-pane h-[500px]">
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
