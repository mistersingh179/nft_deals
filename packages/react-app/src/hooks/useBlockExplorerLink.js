import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useBlockExplorerLink = blockExplorer => {
  const [blockExplorerLink, setBlockExplorerLink] = useState("");
  const { slug: auctionContractAddress } = useParams();

  useEffect(() => {
    if (auctionContractAddress) {
      setBlockExplorerLink(
        `${
          blockExplorer || "https://etherscan.io/"
        }address/${auctionContractAddress}`,
      );
    }
  }, [auctionContractAddress, blockExplorer]);

  return blockExplorerLink;
};

export default useBlockExplorerLink;
