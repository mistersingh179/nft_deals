import {Button, Modal, Tooltip, Typography} from "antd";
import BidEvents from "./BidEvents";
import {useState} from "react";
import SampleWinningModal from "../components/SampleWinningModal";
const { Text } = Typography;

const blockExplorerLink = (address, blockExplorer) => `${blockExplorer || "https://etherscan.io/"}address/${address}`;

const BidHistoryButtonModalCombo = props => {
  const {readContracts, auctionContractAddress, mainnetProvider, localProvider, address, blockExplorer, rewards} = props
  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false)
  const handleOk = evt => {setShowBidHistoryModal(false)}
  const handleCancel = evt => {setShowBidHistoryModal(false)};
  const auctionEtherscanLink = blockExplorerLink(auctionContractAddress, props.blockExplorer);

  const recentBidsTitle = <Text>Recent Bids <Tooltip placement="right" title="This table shows the latest five bids according to on-chain data from the last 5,000 blocks."><i className="bi bi-info-circle info-icon"></i></Tooltip></Text>; 

  return (
    <>
      <Button
         className="btn btn-secondary btn-sm btn-block bid-details-btn"
         onClick={evt => setShowBidHistoryModal(true)}
      >
        <i className="bi bi-card-checklist btn-icon"></i>
        Recent Bids 
      </Button>
      <Modal  className="bid-history-modal" title={recentBidsTitle} visible={showBidHistoryModal} 
              onOk={handleOk} onCancel={handleCancel}
              footer={[
                <Button className="etherscan-link"
                  type="link"  
                  href={auctionEtherscanLink}
                >
                  View all bids on Etherscan
                </Button>,
              ]}
      >
        <p>
          <BidEvents
            readContracts = {readContracts}
            auctionContractAddress={auctionContractAddress}
            mainnetProvider={mainnetProvider}
            localProvider={localProvider}
            eventsCount={5}
            blockCount={10}
            address={address}
            blockExplorer={blockExplorer}
          />
        </p>
      </Modal>
      
      {/* Throwaway once Sandeep wires this with proper React hook */}
      <SampleWinningModal 
        readContracts = {readContracts}
        auctionContractAddress={auctionContractAddress}
        mainnetProvider={mainnetProvider}
        localProvider={localProvider}
        address={address}
        blockExplorer={blockExplorer}
        rewards={rewards}
      />      
    </>
  )
}

export default BidHistoryButtonModalCombo