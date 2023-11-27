import { useEffect, useState } from "react";
import { Dna, ThreeDots } from "react-loader-spinner";

type Props = {};

export default function LoaderInner({}: Props) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(false);
    }, 1000);
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <div className="h-full w-full z-20 overflow-hidden transition-opacity delay-150 ease-out  bg-white flex-col flex items-center pt-10">
          <ThreeDots
            height="50"
            width="50"
            radius="15"
            color="#aaa"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={true}
          />
        </div>
      )}
    </>
  );
}
