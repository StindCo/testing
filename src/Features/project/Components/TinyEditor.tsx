import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ConvertAPI } from "convertapi";
import { socket } from "./socket";
import { BsChevronDown, BsGear } from "react-icons/bs";
import ProcessView from "./ProcessView";
import { subscribe } from "../../../shared/hooks/events";
import ChartView from "./ChartView";
import ProjetTableView from "./ProjetTableView";

type Props = {
  projet: any;
};

const convertapi = new ConvertAPI("5e2ILxyErLD5jt1l");

export default function TinyEditor({ projet }: Props) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [processSelected, setProcessSelected] = useState<any>();
  const [outputsSelected, setOutputsSelected] = useState([]);
  const [processSelectedIndex, SetProcessSelectedIndex] = useState<any>(null);
  const [outputToShow, setOutputToShow] = useState<any>({});
  const editorRef = useRef<any>(null);
  const [showOutputModal, setShowOutputModal] = useState(false);
  const [editorValue, setEditorValue] = useState(projet?.report?.content);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const convertToPdf = () => {
    console.log(projet?.report?.content);
  };

  const convertToHtml = () => {
    const element = document.createElement("a");
    const file = new Blob([editorRef.current.getContent() ?? projet?.report?.content], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = projet?.name + ".html";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  useEffect(() => {
    if (processSelected != null) {
      setOutputsSelected(
        projet?.outputs?.filter(
          (value: any) => value.processName == processSelected.id
        )
      );
    }
  }, [processSelected]);

  useEffect(() => {
    console.log(outputToShow);
  }, [outputToShow])

  useEffect(() => {
    subscribe("show-output-full", ({ detail }: any) => {
      setOutputToShow(detail.outputToShow);
      setShowOutputModal(true);
    });

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div>
      <div className="drawer drawer-end overflow-hidden">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content">
          <div className="p-2 px-3 flex flex-row-reverse justify-between items-center">
            <div className="space-x-5">
              <div className="dropdown dropdown-bottom dropdown-end">
                <label
                  tabIndex={0}
                  className="btn m-1 btn-sm flex space-x-3 btn-outline rounded"
                >
                  <span>exportez</span> <BsChevronDown />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li onClick={() => convertToHtml()}>
                    <a>HTML</a>
                  </li>
                  {/* <li onClick={() => convertToPdf()}>
                    <a>PDF</a>
                  </li> */}

                </ul>
              </div>
              <label
                htmlFor="my-drawer-4"
                className="drawer-button rounded btn btn-outline btn-sm"
              >
                ouvrir la configuration
              </label>
            </div>

            <div className="text-lg text-center p-2">
              <h2>{projet?.name ?? "Projet vide"}</h2>
            </div>
          </div>
          <Editor
            apiKey="i39iudx0bd6srfirwj896xo0jygqs11hhofc4jnr9d0c7i53"
            onInit={(evt, editor) => (editorRef.current = editor)}
            onEditorChange={(newValue: any, editor: any) => {
              let message = projet.report;
              message.content = newValue;
              socket.timeout(1000).emit("send-report", message, () => {
                console.log("Sending message");
              });
            }}
            initialValue={projet?.report?.content ?? ""}
            init={{
              plugins:
                "preview pagebreak importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons ",
              editimage_cors_hosts: ["picsum.photos"],
              menubar: "file edit view insert format tools table help",
              toolbar:
                "undo redo | pagebreak | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl",
              toolbar_sticky: true,
              autosave_ask_before_unload: true,
              autosave_interval: "30s",
              autosave_prefix: "{path}{query}-{id}-",
              autosave_restore_when_empty: false,
              autosave_retention: "2m",
              image_advtab: true,
              link_list: [
                { title: "My page 1", value: "https://www.tiny.cloud" },
                { title: "My page 2", value: "http://www.moxiecode.com" },
              ],
              image_list: [
                { title: "My page 1", value: "https://www.tiny.cloud" },
                { title: "My page 2", value: "http://www.moxiecode.com" },
              ],
              image_class_list: [
                { title: "None", value: "" },
                { title: "Some class", value: "class-name" },
              ],
              importcss_append: true,
              file_picker_callback: (callback, value, meta) => {
                /* Provide file and text for the link dialog */
                if (meta.filetype === "file") {
                  callback("https://www.google.com/logos/google.jpg", {
                    text: "My text",
                  });
                }

                /* Provide image and alt text for the image dialog */
                if (meta.filetype === "image") {
                  callback("https://www.google.com/logos/google.jpg", {
                    alt: "My alt text",
                  });
                }

                /* Provide alternative source and posted for the media dialog */
                if (meta.filetype === "media") {
                  callback("movie.mp4", {
                    source2: "alt.ogg",
                    poster: "https://www.google.com/logos/google.jpg",
                  });
                }
              },
              templates: [
                {
                  title: "New Table",
                  description: "creates a new table",
                  content:
                    '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
                },
                {
                  title: "Starting my story",
                  description: "A cure for writers block",
                  content: "Once upon a time...",
                },
                {
                  title: "New list with dates",
                  description: "New List with dates",
                  content:
                    '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
                },
              ],
              template_cdate_format:
                "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
              template_mdate_format:
                "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
              height: 570,
              image_caption: true,
              quickbars_selection_toolbar:
                "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
              noneditable_class: "mceNonEditable",
              toolbar_mode: "sliding",
              contextmenu: "link image table",
              skin: "oxide",
              content_css: "default",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
            }}
          />
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
          <div className=" w-1/2 h-full bg-base-100 overflow-hidden">
            <div className="p-4 shadow-sm">
              <div className="flex items-center space-x-3 text-lg pb-5">
                <BsGear size={26} /> <p>Configuration des sorties</p>
              </div>
              <div>
                <select
                  onChange={(e) => {
                    SetProcessSelectedIndex(e.target.value);
                    setProcessSelected(projet?.processes[e.target.value]);
                  }}
                  className="select select-bordered rounded w-full select-sm"
                >
                  <option disabled selected>
                    Veillez choisir un modèle
                  </option>
                  {projet?.processes?.map((value: any, index: any) => (
                    <option value={index} key={Math.random()}>
                      {value?.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-hidden w-full h-full overflow-y-scroll no-scrollBar pb-20">
              <ProcessView outputs={outputsSelected} />
            </div>
          </div>
        </div>
      </div>
      {showOutputModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 p-0 max-w-6xl h-full no-scrollBar">
            <div className="flex flex-row border-b p-4 px-8 items-center justify-between">
              <h3 className="text-xl font-bold">{outputToShow?.config?.name}</h3>
              <label
                htmlFor="my-modal-3"
                onClick={(e) => setShowOutputModal(false)}
                className="btn btn-sm btn-circle"
              >
                ✕
              </label>
            </div>

            <div className="h-full mt-3  w-full items-start">
              <div className="w-full h-full cursor-auto">
                <div className="border-t h-full w-full">
                  {outputToShow?.config?.typeOfRender == "simple-table" && (
                    <ProjetTableView data={outputToShow?.input ?? []} />
                  )}
                  {(outputToShow?.config?.typeOfRender == "chart-line" ||
                    outputToShow?.config?.typeOfRender == "chart-column" ||
                    outputToShow?.config?.typeOfRender == "chart-circular-fill") && (
                    <ChartView
                      legend={"Un titre"}
                      description={"dk"}
                      typeOfRender={outputToShow?.config?.typeOfRender}
                      data={outputToShow?.input ?? []}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
