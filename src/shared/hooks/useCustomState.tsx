import { useState } from "react";

type Props = {
  process: unknown;
  project: any;
  paramsInput: any;
};

function useCustomState<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  const setValueAndCallback: any = (newValue: T, callback: any = null) => {
    setValue((prevValue: T) => {
      if (callback) {
        callback(prevValue, newValue);
      }
      return newValue;
    });
  };

  return [value, setValueAndCallback];
}

export { useCustomState };
