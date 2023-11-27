import { useCallback, useEffect, useState } from "react";
import { Importer, ImporterField } from "react-csv-importer";

// include the widget CSS file whichever way your bundler supports it
import "react-csv-importer/dist/index.css";
import { importData } from "./services/ImportationService";
import "./styles/importer.css";

type Props = {
  data: any;
  user: any;
};

declare var window: any;

export default function MultiPromptImport({ data, user }: Props) {
  const [rowsToUpload, setRows] = useState<any>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const upload = useCallback(
    (rows: any) => {
      let rowsFiltered = rows
        .filter((row: any) => /\d\d-[A-Za-z]\d-\d\d\d\d/.test(row.period))
        .filter(
          (item: any, index: any, self: any) =>
            index === self.findIndex((t: any) => t.period == item.period)
        )
        .map((row: any) => {
          Object.keys(row).forEach((key: any) => {
            if (key != "period")
              row[key] = parseFloat(
                row[key].replace(/\s/g, "").replace(/%/g, "").replace(/,/g, ".")
              );
            else {
              let periodKeys = row[key].split("-");
              row[key] = {
                month: periodKeys[0],
                trimester: periodKeys[1].toString().toUpperCase(),
                year: periodKeys[2],
              };
            }
          });
          return row;
        });
      setRows(rowsFiltered);
    },
    [rowsToUpload, isLoaded]
  );

  useEffect(() => {
    if (rowsToUpload.length != 0) {
      if (!isLoaded) {
        console.log("download");
        setTimeout(() => {
          rowsToUpload.forEach((row: any) => {
            let response = importData(data?.table, user, data?.operateur, row);
          });
        }, 1000);
        setIsLoaded(true);
      }
    }
  }, [rowsToUpload]);

  return (
    <div className="w-full h-[800px] p-36 py-16 no-scrollBar pb-[500px] overflow-y-scroll">
      <div className="">
        <Importer
          dataHandler={(rows, { startIndex }) => {
            upload(rows.filter((value) => value.period != ""));
          }}
          defaultNoHeader={false}
          restartable={true}
          onStart={({ file, preview, fields, columnFields }) => {
            // prepMyAppForIncomingData();
          }}
          onComplete={({ file, preview, fields, columnFields }) => {
            // showMyAppToastNotification();
          }}
          onClose={({ file, preview, fields, columnFields }) => {
            // goToMyAppNextPage();
          }}

          // CSV options passed directly to PapaParse if specified:
          // delimiter={...}
          // newline={...}
          // quoteChar={...}
          // escapeChar={...}
          // comments={...}
          // skipEmptyLines={...}
          // delimitersToGuess={...}
          // chunkSize={...} // defaults to 10000
          // encoding={...} // defaults to utf-8, see FileReader API
        >
          <ImporterField name={"period"} label={"Période"} />
          {data.table.columns.map((value: any) => (
            <ImporterField
              key={Math.random()}
              name={value.name}
              label={value.description}
            />
          ))}
        </Importer>
      </div>
    </div>
  );
}
