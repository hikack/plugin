import { useRoutes } from "../../hooks/apis";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";

// actions
import { setSelectedRoute } from "../../state/selectedRouteSlice";
import { setBestRoute } from "../../state/quotesSlice";

// components
import { ReviewModal } from "./ReviewModal";
import { Button } from "../common/Button";
import { Spinner } from "../common/Spinner";
import { InnerCard } from "../common/InnerCard";

import { Web3Context } from "../../providers/Web3Provider";
import { BRIDGE_DISPLAY_NAMES, QuoteStatus, ButtonTexts } from "../../consts/";
import { Quote } from "socket-v2-sdk";

export const RouteDetails = () => {
  const dispatch = useDispatch();

  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);
  const destToken = useSelector((state: any) => state.tokens.destToken);
  const sortPref = useSelector((state: any) => state.quotes.sortPref);
  const sourceAmount = useSelector((state: any) => state.amount.sourceAmount);
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);
  const isEnoughBalance = useSelector(
    (state: any) => state.amount.isEnoughBalance
  );
  const web3Context = useContext(Web3Context);
  const { userAddress } = web3Context.web3Provider

  // Hook to fetch the quotes for given params.
  const { data, isQuotesLoading } = useRoutes(
    sourceToken ?? "",
    destToken,
    sourceAmount,
    sortPref,
    userAddress
  );

  // Boolean variable to fill all condition before the api call is made to fetch quotes.
  const shouldFetch = sourceAmount && sourceToken && destToken && sortPref;
  const bestRoute = useSelector((state: any) => state.quotes.bestRoute);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

  useEffect(() => {
    isTxModalOpen && setIsReviewOpen(false);
  }, [isTxModalOpen]);

  useEffect(() => {
    if (data) {
      dispatch(setBestRoute(data?.[0]));
    } else {
      dispatch(setBestRoute(null));
    }
  }, [data]);

  function review() {
    dispatch(setSelectedRoute(bestRoute));
    setIsReviewOpen(true);
  }

  // Function that returns status once the fetching has started to get quotes.
  function quotesStatus() {
    const bridgeKey = bestRoute?.route?.usedBridgeNames?.[0];
    const bridgeName = BRIDGE_DISPLAY_NAMES[bridgeKey] || bridgeKey;
    return shouldFetch
      ? isQuotesLoading
        ? QuoteStatus.FETCHING_QUOTE
        : bestRoute
        ? bridgeName
        : QuoteStatus.NO_ROUTES_AVAILABLE
      : QuoteStatus.ENTER_AMOUNT;
  }

  // Returns the text shown on the button depending on the status.
  function getButtonStatus() {
    if (!isEnoughBalance) {
      return ButtonTexts.NOT_ENOUGH_BALANCE;
    } else {
      return ButtonTexts.REVIEW_QUOTE;
    }
  }

  return (
    <InnerCard>
      <div className="text-widget-secondary mb-3 text-sm flex items-center gap-1">
        {sourceAmount&& isQuotesLoading && <Spinner size={4} />} {quotesStatus()}
      </div>
      <Button
        onClick={review}
        disabled={!bestRoute || isQuotesLoading || !isEnoughBalance}
      >
        {getButtonStatus()}
      </Button>
      <div className="flex items-center justify-between text-widget-secondary mt-2.5 text-xs">
        <a href="http://socket.tech/" target="_blank" rel="noopener noreferrer">
          Powered by Socket
        </a>
        <a
          href="https://socketdottech.zendesk.com/hc/en-us"
          target="_blank"
          rel="noopener noreferrer"
        >
          Support
        </a>
      </div>

      {isReviewOpen && (
        <ReviewModal closeModal={() => setIsReviewOpen(false)} />
      )}
    </InnerCard>
  );
};
