import {Button, Modal} from "antd";
import BidEvents from "./BidEvents";
import {useState} from "react";

const BidHistoryButtonModalCombo = props => {
  const {readContracts, auctionContractAddress, mainnetProvider, localProvider, address, blockExplorer} = props
  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false)
  const handleOk = evt => {setShowBidHistoryModal(false)}
  const handleCancel = evt => {setShowBidHistoryModal(false)};

  return (
    <>
      <Button
         className="btn btn-secondary btn-sm btn-block bid-details-btn"
         onClick={evt => setShowBidHistoryModal(true)}
      >
        <i className="bi bi-card-checklist btn-icon"></i>
        Bid History
      </Button>
      <Modal className="bid-history-modal" title="Latest Bids" visible={showBidHistoryModal} onOk={handleOk} onCancel={handleCancel}>
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
    </>
  )
}

export default BidHistoryButtonModalCombo