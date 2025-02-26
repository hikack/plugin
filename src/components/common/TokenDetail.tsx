import { Token } from "@socket.tech/socket-v2-sdk";
import useMappedChainData from "../../hooks/useMappedChainData";
import { formatCurrencyAmount } from "../../utils";
import { Currency } from "../../types";
import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useContext } from "react";

interface TokenAssetProps {
  token: Currency | Token;
  refuel?: { amount: string; asset: Currency | Token };
  rtl?: boolean;
  amount: string;
  small?: boolean;
}
export const TokenDetail = (props: TokenAssetProps) => {
  const { token, rtl = false, amount, small = false, refuel } = props;
  const mappedChaindata = useMappedChainData();
  const chain = mappedChaindata?.[token?.chainId];
  const formattedAmount = formatCurrencyAmount(amount, token?.decimals, 4);
  const formattedRefuelAmount = formatCurrencyAmount(
    refuel?.amount,
    refuel?.asset?.decimals,
    3
  );
  const refuelEnabled = !!refuel?.amount;

  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  return (
    <div
      className={`skt-w flex flex-col flex-1 max-w-full ${
        rtl ? "items-end" : "flex-row"
      }`}
      style={{ borderRadius: `calc(0.7rem * ${borderRadius})` }}
    >
      <div
        className={`skt-w flex items-center flex-1 overflow-hidden ${
          rtl ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div className={`skt-w relative flex flex-shrink-0`}>
          <img
            src={token?.logoURI}
            className="skt-w w-6 h-6 rounded-full border-widget-primary"
          />
          {!!refuel?.amount && (
            <img
              src={refuel?.asset?.logoURI}
              className="skt-w w-6 h-6 rounded-full -ml-2 border-2 border-widget-accent object-cover bg-widget-accent"
            />
          )}
        </div>

        <div
          className={`skt-w flex flex-col flex-auto overflow-hidden ${
            rtl ? "items-end mr-2" : "items-start ml-2"
          }`}
        >
          <span
            className={`skt-w text-widget-primary w-full font-medium overflow-hidden whitespace-nowrap text-ellipsis flex flex-col ${
              rtl ? "text-right items-end" : "text-left items-start"
            } ${small ? "text-xs" : "text-sm"}`}
          >
            <span>
              {formattedAmount} {token?.symbol}
            </span>
            {refuelEnabled && (
              <span
                className={`skt-w text-[10px] font-normal text-widget-accent ${
                  rtl ? "text-right" : "text-left"
                }`}
              >
                (+ {formattedRefuelAmount} {refuel?.asset?.symbol})
              </span>
            )}
          </span>
        </div>
      </div>
      <p
        className={`skt-w text-xs text-widget-secondary mt-1 ${
          rtl ? "text-right" : "text-left"
        }`}
      >
        on {chain?.name}
      </p>
    </div>
  );
};
