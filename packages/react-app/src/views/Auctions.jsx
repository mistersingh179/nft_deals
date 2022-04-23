import bayc300 from '../img/BAYC300.png';
import logo from '../img/NFTD_Logo_2.png';

import {
  LoginLogoutButton,
  NetworkDisplay,
  ThemeSwitch,
  ApproveBidButtonsCombo,
  Address,
  NetworkSwitch, FaucetHint, AccountDrawer
} from "../components";
import AccountAndOthers from "../components/AccountAndOthers";

import CurrentWinner from "../components/CurrentWinner";

import React, {useEffect, useState} from 'react';
import Blockies from "react-blockies";

import FAQ from '../components/FAQ';
import {Link, useParams} from "react-router-dom";
import {useAuctionOptions, useTopNavClass, useNftOptions, useAuctionContract} from "../hooks";
import useExpiration from "../hooks/useExpiration";
import BidHistoryButtonModalCombo from "../components/BidHistoryButtonModalCombo";
import {ethers, utils} from "ethers";
import {useContractReader} from "eth-hooks";
import Balance from "../components/Balance";
import {ReactComponent as WEthLogo} from "../img/wrapped_ethereum_icon.svg";
import {ReactComponent as EthLogo} from "../img/ethereum_icon.svg";
import {Typography, Drawer, Button, Space, Radio, Skeleton, Tooltip, Col, Row, Card, Divider} from 'antd';
import NftImage from "../components/NftImage";
import {displayWeiAsEther} from "../helpers";
const { Text } = Typography;
const { Meta } = Card;
const Auctions = props => {
  const {NETWORKCHECK, localChainId, selectedChainId, targetNetwork, logoutOfWeb3Modal, USE_NETWORK_SELECTOR} = props
  const {useBurner, address, localProvider, userSigner, mainnetProvider, price, web3Modal,
    loadWeb3Modal, blockExplorer, readContracts, writeContracts,
    networkOptions, selectedNetwork, setSelectedNetwork, USE_BURNER_WALLET, yourLocalBalance, tx} = props

  const { slug: auctionContractAddress } = useParams();
  const topNavClass = useTopNavClass()
  const durationToExpire = useExpiration(readContracts, auctionContractAddress, localProvider)
  const auctionOptions = useAuctionOptions(readContracts, auctionContractAddress, localProvider)
  const nftOptions = useNftOptions(auctionOptions.nftContract, localProvider, auctionOptions.tokenId)
  const [blockExplorerLink, setBlockExplorerLink] = useState('')
  const auctionContractWriter = useAuctionContract(writeContracts, auctionContractAddress, localProvider)
  const rewards = useContractReader(readContracts, "Reward", "rewards", [address]);

  useEffect(() => {
    if(auctionContractAddress){
      setBlockExplorerLink(`${blockExplorer || "https://etherscan.io/"}address/${auctionContractAddress}`)
    }
  }, [auctionContractAddress, blockExplorer])
  const claimButtonHandler = async (evt) => {
    if(auctionContractWriter){
      await tx(auctionContractWriter.claimNftUponWinning())
    }
  }
  

  
  const auction_card_desc = <>
    <p>Collection Floor Price: Ξ130</p>
    <p>Top Bid: Ξ0.0001</p>
    <p>Ends in 10h 52m 15s</p>
  </>;

  return (
    <>
      <header id="header" className={`fixed-top ${topNavClass}`}>
        <div className="container d-flex align-items-center">
          <a href="/" className="logo mr-auto">
            <img src={logo} alt="" className="img-fluid" />
          </a>
          <nav className="nav-menu d-none d-lg-block">
            <ul>
              <li className="active">
                <Link to={'/AuctionList'}>Auctions</Link>
              </li>
              <li>
                <a href="javascript:void(0)" onClick={claimButtonHandler}>Claim NFT</a>
              </li>
              <li>
                <Link to="/AuctionFactory">Sell Your NFT</Link>
              </li>
              <li><a href="https://coral-credit-8f4.notion.site/NFT-Deals-0bdff8f05a5747d987cee55e1134129d">Docs</a></li>
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
      
      <section id="hero" className="d-flex align-items-center">
        <div class={'container'}>
            <Row>
                <Col span={24} type="flex" justify="center" align="middle">
                    <h1>Explore Our Auctions</h1>
                </Col>
            </Row>
            <Divider />
            <Row gutter={16} justify="space-evenly">
                <Col span={8}>
                    <Card
                        hoverable
                        style={{ width: '80%', margin:'0 auto' }}
                        cover={<img alt="Auction: BAYC #0" src={bayc300} />}
                    >
                        <Meta title="Bored Ape Yacht Club #0" description={auction_card_desc} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        hoverable
                        style={{ width: '80%', margin:'0 auto' }}
                        cover={<img alt="Auction: BAYC #0" src={bayc300} />}
                    >
                        <Meta title="Bored Ape Yacht Club #0" description={auction_card_desc} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        hoverable
                        style={{ width: '80%', margin:'0 auto' }}
                        cover={<img alt="Auction: BAYC #0" src={bayc300} />}
                    >
                        <Meta title="Bored Ape Yacht Club #0" description={auction_card_desc} />
                    </Card>
                </Col>
            </Row>


        </div>
      </section>

      <footer id="footer">
        <div class="footer-top">
          <div class="container">
            <div class="row">

              <div class="col-lg-3 col-md-6 footer-contact">
                <a href="index.html" class="logo"><img src="../img/NFTD_Logo_2.png" alt="" class="img-fluid  footer-logo" /></a>
                <p>
                  Made with ❤️
                  <p>in Texas and New York</p>
                  <p><strong>Email:</strong> info_at_nftdeals.xyz</p>
                </p>
              </div>

              <div class="col-lg-3 col-md-6 footer-links">
                <h4>Useful Links</h4>
                <ul>
                  <li><i class="bx bx-chevron-right"></i> <a href="#">Bid to Win</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="#team">About Us</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="#">Claim Your NFT</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="#">Sell Your NFT</a></li>

                </ul>
              </div>

              <div class="col-lg-3 col-md-6 footer-links">
                <h4>Our Services</h4>
                <ul>
                  <li><i class="bx bx-chevron-right"></i> <a href="#">Documentation</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="#">Jobs</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="#">Terms of Service</a></li>
                  <li><i class="bx bx-chevron-right"></i> <a href="#">Privacy Policy</a></li>
                </ul>
              </div>

              <div class="col-lg-3 col-md-6 footer-links">
                <h4>Join Our Journey</h4>
                <p>
                  Follow us on Twitter, where we drop the latest alpha. Read our Medium posts for announcements. Join our Discord to drink from the firehose.
                </p>
                <div class="social-links mt-3">
                  <a href="https://twitter.com/NFT_Deals_xyz" class="twitter"><i class="bx bxl-twitter"></i></a>
                  <a href="https://discord.gg/Q8WM4yHc" class="discord"><i class="bx bxl-discord"></i></a>
                  <a href="https://medium.com/@rodrigofuentes7/" class="medium"><i class="bx bxl-medium"></i></a>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="container footer-bottom clearfix">
          <div class="copyright">
            &copy; Copyright <strong><span>Masalsa Inc.</span></strong>. All Rights Reserved
          </div>
        </div>
      </footer>
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
      />
    </>
  )
}

export default Auctions