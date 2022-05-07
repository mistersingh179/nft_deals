import { logo } from "../img";
import ClaimNFTModal from "./ClaimNFTModal";
import FeedbackModal from "./FeedbackModal";
import { Space } from "antd";
import { AccountDrawer, LoginLogoutButton } from "./index";
import { useTopNavClass } from "../hooks";
import { useState } from "react";
import { Link } from 'react-router-dom'

const TheHeader = props => {
  const { localProvider, address, writeContracts, tx, blockExplorer } = props;
  const { web3Modal, loadWeb3Modal, logoutOfWeb3Modal } = props;
  const { mainnetProvider, readContracts, yourLocalBalance } = props;
  const { targetNetwork, USE_NETWORK_SELECTOR } = props;
  const { networkOptions, selectedNetwork, setSelectedNetwork } = props;
  const { NETWORKCHECK, localChainId, selectedChainId } = props;

  const topNavClass = useTopNavClass();

  const [showClaimNftModal, setShowClaimNftModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const claimButtonHandler = async evt => {
    setShowClaimNftModal(true);
  };
  const feedbackButtonHandler = async evt => {
    setShowFeedbackModal(true);
  };

  return (
    <header id="header" className={`fixed-top ${topNavClass}`}>
      <div className="container d-flex align-items-center">
        <a href="//nftdeals.xyz" className="logo mr-auto">
          <img src={logo} alt="" className="img-fluid" />
        </a>
        <nav className="nav-menu d-none d-lg-block">
          <ul>
            <li>
              <Link to="/auctions">Browse Auctions</Link>
            </li>
            <li>
              <a href="javascript:void(0)" onClick={claimButtonHandler}>
                Claim NFT
              </a>
              <ClaimNFTModal
                showClaimNftModal={showClaimNftModal}
                setShowClaimNftModal={setShowClaimNftModal}
                localProvider={localProvider}
                address={address}
                writeContracts={writeContracts}
                tx={tx}
                blockExplorer={blockExplorer}
              />
            </li>
            <li>
              <a href="javascript:void(0)" onClick={feedbackButtonHandler}>
                Give Feedback
              </a>
              <FeedbackModal
                showFeedbackModal={showFeedbackModal}
                setShowFeedbackModal={setShowFeedbackModal}
              />
            </li>
            <li>
              <a href="https://coral-credit-8f4.notion.site/NFT-Deals-0bdff8f05a5747d987cee55e1134129d">
                Docs
              </a>
            </li>
          </ul>
        </nav>

        <Space>
          <LoginLogoutButton
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            className="get-started-btn scrollto"
          />
          <AccountDrawer
            address={address}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            readContracts={readContracts}
            yourLocalBalance={yourLocalBalance}
            NETWORKCHECK={NETWORKCHECK}
            localChainId={localChainId}
            selectedChainId={selectedChainId}
            targetNetwork={targetNetwork}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
            networkOptions={networkOptions}
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
            localProvider={localProvider}
          />
        </Space>
      </div>
    </header>
  );
};

export default TheHeader;
