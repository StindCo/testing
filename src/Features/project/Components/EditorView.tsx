import { useEffect, useRef, useState } from "react";
import WebViewer from "@pdftron/webviewer";

export default function EditorView() {
  const viewer = useRef<any>(null);
  const [projet, setProjet] = useState();

  useEffect(() => {
    WebViewer(
      {
        path: "/lib",
        licenseKey: "YOUR_LICENSE_KEY",
        enableOfficeEditing: true,
        // initialDoc:
        //   "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf",
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer } = instance.Core;


      // instance.UI.setHeaderItems((header) => {
      //   header.push({
      //     type: "actionButton",
      //     img: "...",
      //     onClick: async () => {
      //       const doc = documentViewer.getDocument();
      //       const xfdfString = await annotationManager.exportAnnotations();
      //       const data = await doc.getFileData({
      //         // saves the document with annotations in it
      //         xfdfString,
      //       });
      //       const arr = new Uint8Array(data);
      //       const blob = new Blob([arr], { type: "application/pdf" });

      //       // Add code for handling Blob here
      //     },
      //   });
      // });
      // you can now call WebViewer APIs here...
    });
  }, [projet]);

  return (
    <div className="w-full h-full">
      <div className="webviewer w-full h-full" ref={viewer} ></div>
    </div>
  );
}
