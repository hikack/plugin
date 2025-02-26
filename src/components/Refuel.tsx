import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckBox } from "./common/CheckBox";
import { enableRefuel } from "../state/quotesSlice";
import { CustomizeContext } from "../providers/CustomizeProvider";
import useMappedChainData from "../hooks/useMappedChainData";
import { HelpCircle } from "react-feather";
import { Popover } from "./common/Popover";

export const Refuel = ({ selectivelyShowRefuel }) => {
  const [isChecked, setIsChecked] = useState(false);
  const destChainId = useSelector((state: any) => state.networks.destChainId);
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const mappedChainData = useMappedChainData();
  const dispatch = useDispatch();

  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  useEffect(() => {
    dispatch(enableRefuel(isChecked));
  }, [isChecked]);

  useEffect(() => {
    if (destChainId === 1 || destChainId === sourceChainId) {
      setIsChecked(false);
      dispatch(enableRefuel(false));
    }
  }, [destChainId]);

  if (
    selectivelyShowRefuel &&
    (destChainId === 1 || destChainId === sourceChainId)
  )
    return null;

  return (
    <div
      className="skt-w flex bg-widget-secondary py-3 pl-4 pr-3 justify-between mt-6 items-center relative"
      style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
    >
      <div className="mr-1">
        <div className="skt-w text-sm text-widget-primary font-medium flex items-center">
          Enable Refuel
          <Popover
            content="With Refuel, you can swap native tokens on the source chain for native tokens to transact on the destination chain"
            classNames="-top-14"
            cursor="cursor-help"
          >
            <HelpCircle className="skt-w ml-1.5 w-4 h-4 opacity-70" />
          </Popover>
        </div>
        <p className="skt-w text-xs text-widget-secondary mt-0.5">
          {destChainId === 1 ? (
            <span className="skt-w text-red-500">
              Refuel isn't supported on Ethereum
            </span>
          ) : destChainId === sourceChainId ? (
            <span className="skt-w text-red-500">
              Refuel isn't supported for same chain swaps
            </span>
          ) : (
            `Get Gas for transactions on ${mappedChainData?.[destChainId]?.name}`
          )}
        </p>
      </div>
      <CheckBox
        id="refuel-checkbox"
        small
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        disabled={destChainId === 1 || destChainId === sourceChainId}
      />
    </div>
  );
};
