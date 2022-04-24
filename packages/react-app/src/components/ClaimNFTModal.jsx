import { Button, Col, Modal, Row } from 'antd'
import { useAuctionContract, useAuctionOptions } from '../hooks'
import { useParams } from 'react-router-dom'
import NftImage from './NftImage'
import happyPepe from '../img/happy-clap-pepe.gif'
import excitedPepe from '../img/excited-pepe.gif'
import { useCallback } from 'react'

const blockExplorerLink = (address, blockExplorer) => `${blockExplorer ||
'https://etherscan.io/'}address/${address}`

const ClaimNFTModal = props => {
  const { showClaimNftModal, setShowClaimNftModal } = props
  const { readContracts, localProvider, address, writeContracts, tx, blockExplorer } = props

  const { slug: auctionContractAddress } = useParams()
  const auctionContractWriter = useAuctionContract(writeContracts,
    auctionContractAddress, localProvider)
  const handleOk = evt => { setShowClaimNftModal(false) }

  const handleCancel = evt => { setShowClaimNftModal(false) }
  const auctionOptions = useAuctionOptions(readContracts,
    auctionContractAddress, localProvider)

  const youAreWinner = () => {
    return auctionOptions.winningAddress == address
  }

  const auctionHasExpired = () => {
    return auctionOptions.secondsLeftInAuction.eq(0)
  }

  const InstructFinalWinner = useCallback(props => {
    const transferNftHandler = () => {
      if (auctionContractWriter) {
        tx(auctionContractWriter.claimNftUponWinning())
      }
    }
    return (
      <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
        <Col span={18} align="middle">
          <h1>You have won this NFT!</h1>
          <NftImage
            nftContractAddress={auctionOptions.nftContract}
            tokenId={auctionOptions.tokenId}
            localProvider={localProvider}
            className="winner-modal-badge"
          />

          {auctionOptions._weHavePossessionOfNft && <>
            <h4>
              <Button type={'primary'} onClick={transferNftHandler}>
                Transfer NFT to your wallet
              </Button>
            </h4>
            <p>
              This NFT will arrive in your wallet address after the transfer
              transaction is confirmed.
            </p>
          </>}

          {!auctionOptions._weHavePossessionOfNft && <>
            <a
              className="rewards-contract"
              href={blockExplorerLink(auctionContractAddress, blockExplorer)}>
              View this transaction on Etherscan
            </a>
          </>}
        </Col>
      </Row>
    )
  }, [
    auctionOptions.nftContract,
    auctionOptions.tokenId,
    auctionOptions._weHavePossessionOfNft,
    localProvider,
    tx,
    auctionContractWriter])

  const InspireTempWinner = useCallback(props => {
    return (
      <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
        <Col span={18} align="middle">
          <h1>You're so close to winning this NFT!</h1>
          <NftImage
            nftContractAddress={auctionOptions.nftContract}
            tokenId={auctionOptions.tokenId}
            localProvider={localProvider}
            className="winner-modal-badge"
          />
          <h4>
            But you could still be outbid...
          </h4>
          <p>Be sure to come back within 24 hours to see if you won. In the
            meantime, follow us on Twitter for the latest announcements:</p>
          <div className="social-links mt-4">
            <a href="https://twitter.com/NFT_Deals_xyz" className="twitter">
              <i className="bx bxl-twitter"/>
            </a>
          </div>
        </Col>
      </Row>
    )
  }, [auctionOptions.tokenId, auctionOptions.nftContract, localProvider])

  const InspireTempLooser = useCallback(props => {
    return (
      <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
        <Col span={18} align="middle">
          <h1>Keep Trying!</h1>
          <img src={excitedPepe} className="winner-modal-badge"/>
          <h4>
            You can't claim the NFT because you're not the winner.
          </h4>
          <p>
            But there's still time left! Bid again to stay on top.
          </p>
        </Col>
      </Row>
    )
  },[])

  const ComfortFinalLooser = useCallback(props => {
    return (
      <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
        <Col span={18} align="middle">
          <h1>Sorry, you didn't win this time.</h1>
          <img src={happyPepe} className="winner-modal-badge" alt={'Happy Pepe'}/>
          <h4>
            But there will be more auctions!
          </h4>
          <p>
            Be sure to come back to bid in the next auction.
            In the meantime, follow us on Twitter for the latest
            announcements:
          </p>
          <div className="social-links mt-4">
            <a href="https://twitter.com/NFT_Deals_xyz" className="twitter">
              <i className="bx bxl-twitter"></i>
            </a>
          </div>
        </Col>
      </Row>
    )
  }, [])

  return (
    <Modal
      className="winner-modal"
      title="Latest Bids"
      visible={showClaimNftModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {/* IF User = WINNER && auction is expired */}
      {youAreWinner() && auctionHasExpired() && <InstructFinalWinner/>}

      {/* inspire user = current_winner && auction still open */}
      {youAreWinner() && !auctionHasExpired() && <InspireTempWinner/>}

      {/* inspire bidder who lost && auction still open */}
      {!youAreWinner() && !auctionHasExpired() && <InspireTempLooser/>}

      {/* inspire bidder who lost && auction expired */}
      {!youAreWinner() && auctionHasExpired() && <ComfortFinalLooser/>}

    </Modal>
  )
}

export default ClaimNFTModal
