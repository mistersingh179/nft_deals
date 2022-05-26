import { Button, Modal, Tooltip, Typography } from "antd";
import BidEvents from "./BidEvents";
import { useMemo, useState } from 'react'
const { Text } = Typography;

const blockExplorerLink = (address, blockExplorer) =>
  `${blockExplorer || "https://etherscan.io/"}address/${address}`;

const BidHistoryButtonModalCombo = props => {
  const {
    readContracts,
    auctionContractAddress,
    mainnetProvider,
    localProvider,
    address,
    blockExplorer,
  } = props;
  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
  const handleOk = evt => {
    setShowBidHistoryModal(false);
  };
  const handleCancel = evt => {
    setShowBidHistoryModal(false);
  };
  const auctionEtherscanLink = blockExplorerLink(
    auctionContractAddress,
    props.blockExplorer,
  );
  const lookBackBlockSize = useMemo(() => {
    if (
      localProvider &&
      localProvider._network &&
      localProvider._network.chainId
    ) {
      const chainId = localProvider._network.chainId;
      // console.log("*** running lookBackBlockSize, ", chainId);
      if (chainId === 137) {
        return 3400;
      } else if (chainId === 80001) {
        return 3400;
      } else {
        return 500000;
      }
    } else {
      return 500000;
    }
  }, [
    localProvider
  ]);
  const recentBidsTitle = (
    <Text>
      Recent Bids{" "}
      <Tooltip
        placement="right"
        title="This table shows the latest five bids according to on-chain data from the last 5,000 blocks."
      >
        <i className="bi bi-info-circle info-icon"></i>
      </Tooltip>
    </Text>
  );

  return (
    <>
      <Button
        className="btn btn-secondary btn-sm btn-block bid-details-btn"
        onClick={evt => setShowBidHistoryModal(true)}
      >
        <i className="bi bi-card-checklist btn-icon"></i>
        Recent Bids
      </Button>
      <Modal
        className="bid-history-modal"
        title={recentBidsTitle}
        visible={showBidHistoryModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            className="etherscan-link"
            type="link"
            href={auctionEtherscanLink}
            target="_blank"
          >
            View all bids on Etherscan
          </Button>,
        ]}
      >
        <p>
          <BidEvents
            readContracts={readContracts}
            auctionContractAddress={auctionContractAddress}
            mainnetProvider={mainnetProvider}
            localProvider={localProvider}
            eventsCount={5}
            blockCount={lookBackBlockSize}
            address={address}
            blockExplorer={blockExplorer}
          />
        </p>
      </Modal>
    </>
  );
};

export default BidHistoryButtonModalCombo;
