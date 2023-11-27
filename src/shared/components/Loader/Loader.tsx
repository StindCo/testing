import { useEffect, useState } from "react";
import { Dna } from "react-loader-spinner";

type Props = {};

export default function Loader({}: Props) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(false);
    }, 1500);
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <div className="absolute z-20 overflow-hidden bottom-0 transition-opacity delay-150 ease-out left-0 right-0 top-0 bg-white flex-col flex items-center justify-center">
          <Dna
            height="120"
            width="120"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />

        </div>
      )}
    </>
  );
}
