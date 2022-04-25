import tachyonLogo from '../img/consensys-tachyon-logo.png'
import consensysLogo from '../img/consensys-labs-icon-logo-white.png'
import protocolLabsLogo from '../img/protocol-labs-logo.png'
import rod from '../img/team/rod.jpg'
import sandeep from '../img/team/sandeep.jpg'
import anon1 from '../img/team/anon1.png'
import anon2 from '../img/team/anon2.png'
import logo from '../img/NFTD_Logo_2.png'
import { ReactComponent as WEthLogo } from '../img/wrapped_ethereum_icon.svg';
import AuctionOptionsContext from '../contexts/AuctionOptionsContext'
import NftOptionsContext from '../contexts/NftOptionsContext'

import { YoutubeFilled } from '@ant-design/icons';

import {
  AccountDrawer,
  ApproveBidButtonsCombo,
  LoginLogoutButton,
  NetworkDisplay,
} from '../components'

import CurrentWinner from '../components/CurrentWinner'

import React, { useEffect, useState } from 'react'

import FAQ from '../components/FAQ'
import { Link, useParams } from 'react-router-dom'
import {
  useAuctionContract,
  useAuctionOptions,
  useNftOptions,
  useTopNavClass,
} from '../hooks'
import useExpiration from '../hooks/useExpiration'
import BidHistoryButtonModalCombo
  from '../components/BidHistoryButtonModalCombo'
import { ethers } from 'ethers'
import { useContractReader } from 'eth-hooks'
import { Col, Row, Space, Tooltip, Typography, Anchor } from 'antd'
import NftImage from '../components/NftImage'
import { displayWeiAsEther } from '../helpers'
import ClaimNFTModal from '../components/ClaimNFTModal'
import YouTubeEmbed from '../components/YouTubeEmbed'
import FeedbackModal from '../components/FeedbackModal'

const { AntLink } = Anchor;
const { Text } = Typography;

const Auction2 = props => {
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
  const [showClaimNftModal, setShowClaimNftModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  useEffect(() => {
    if(auctionContractAddress){
      setBlockExplorerLink(`${blockExplorer || "https://etherscan.io/"}address/${auctionContractAddress}`)
    }
  }, [auctionContractAddress, blockExplorer])
  const claimButtonHandler = async (evt) => {
    console.log('*** in claim button handler')
    setShowClaimNftModal(true)
    // if(auctionContractWriter){
    //   await tx(auctionContractWriter.claimNftUponWinning())
    // }
  }
  const feedbackButtonHandler = async (evt) => {
    console.log('*** in feedback button handler')
    setShowFeedbackModal(true)
  }
  function discountCalc(floor, nextBid) {
    let amount = 90;
    if(floor && nextBid){
      amount = ((1 - nextBid/floor)*100)
      amount = Math.trunc(amount*10)/10 // <-- gives 1 digit after decimal without rounding.
    };
    return <>{amount}</>;
  }
  return (
    <>
      <AuctionOptionsContext.Provider value={auctionOptions}>
      <NftOptionsContext.Provider value={nftOptions}>
        <header id="header" className={`fixed-top ${topNavClass}`}>
          <div className="container d-flex align-items-center">
            <a href="/" className="logo mr-auto">
              <img src={logo} alt="" className="img-fluid" />
            </a>
            <nav className="nav-menu d-none d-lg-block">
              <ul>
                {/*<li className="active">
                  <Link to={"/AuctionList"}>Auctions</Link>
                </li>*/}
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
                  <a href="javascript:void(0)" onClick={feedbackButtonHandler}>Give Feedback</a>
                <FeedbackModal
                  showFeedbackModal={showFeedbackModal}
                  setShowFeedbackModal={setShowFeedbackModal}
                />
                </li>
                <li>
                  <a href="https://coral-credit-8f4.notion.site/NFT-Deals-0bdff8f05a5747d987cee55e1134129d">Docs</a>
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
                rewards={rewards}
              />
            </Space>
          </div>
        </header>

        <section id="hero" className="d-flex align-items-center">
          <div class={"container"}>
            <div className="row">
              <div
                className="col-lg-12 d-flex flex-column justify-content-center"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="explainer-banner text-center">
                  <p>
                    🎉 Bid to win this NFT for{" "}
                    {discountCalc(
                      nftOptions.floor_price,
                      displayWeiAsEther(auctionOptions.maxBid.add(auctionOptions.minimumBidIncrement)),
                    )}
                    % off floor price??? Ok, STFU,{" "}
                    <a href="#video" title="Watch Video" className="video-link">
                      show me how <YoutubeFilled />
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div
                className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-2 order-sm-2"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <h1>
                  {nftOptions.name && nftOptions.name === "BoredApeYachtClub"
                    ? "Bored Ape Yacht Club"
                    : nftOptions.name}{" "}
                  #{auctionOptions.tokenId.toString()}
                </h1>
                <h2>
                  Collection Floor Price: Ξ {nftOptions.floor_price}
                  <span className="smaller-usdc">
                    (~
                    {nftOptions.floor_price &&
                      price &&
                      `$${ethers.utils.commify((nftOptions.floor_price * price).toFixed(2))}`}
                    )
                  </span>
                </h2>
                <div className="row">
                  <div className="col-md-6 bid-box">
                    <Space>
                      <h3>
                        Top Bid{" "}
                        <Tooltip title="The top bidder when the timer ends will win the auction.">
                          <i className="bi bi-info-circle bid-info"></i>
                        </Tooltip>
                      </h3>
                    </Space>
                    <h1>
                      <WEthLogo className="weth-bid-icon" />
                      {displayWeiAsEther(auctionOptions.maxBid)}
                    </h1>
                  </div>
                  <div className="col-md-6 bid-box">
                    <h3>
                      Ends in{" "}
                      <Tooltip
                        title="A new top bid will extend the auction by 24 hours. There’s no advantage to waiting
                      until the last few minutes."
                      >
                        <i className="bi bi-info-circle bid-info"></i>
                      </Tooltip>
                    </h3>
                    <h1 id="end-timer">
                      <Duration durationToExpire={durationToExpire} />
                    </h1>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 bid-box">
                    <h3>
                      Next Bid{" "}
                      <Tooltip title="Bid increments are fixed at +0.0003 ETH above the current bid.">
                        <i className="bi bi-info-circle bid-info"></i>
                      </Tooltip>
                    </h3>
                    <h1>
                      <WEthLogo className="weth-bid-icon" />
                      {displayWeiAsEther(auctionOptions.maxBid.add(auctionOptions.minimumBidIncrement))}{" "}
                    </h1>
                  </div>
                  <div className="col-md-6 bid-box">
                    <h3>
                      Current Winner{" "}
                      <Tooltip title="The address which can claim the NFT on expiration provided it is not outbid.">
                        <i className="bi bi-info-circle bid-info"></i>
                      </Tooltip>
                    </h3>
                    <h1>
                      <CurrentWinner
                        className="current-winner"
                        user_address={address}
                        address={auctionOptions.winningAddress}
                        ensProvider={mainnetProvider}
                        blockExplorer={blockExplorer}
                      />
                    </h1>
                  </div>
                </div>
                <ApproveBidButtonsCombo
                  writeContracts={writeContracts}
                  readContracts={readContracts}
                  address={address}
                  localProvider={localProvider}
                  auctionContractAddress={auctionContractAddress}
                  tx={tx}
                  price={price}
                  rewards={rewards}
                />
                <Row>
                  <Col lg={{ offset: 0, span: 10 }} xs={{ span: 24 }}>
                    <BidHistoryButtonModalCombo
                      readContracts={readContracts}
                      auctionContractAddress={auctionContractAddress}
                      mainnetProvider={mainnetProvider}
                      localProvider={localProvider}
                      address={address}
                      blockExplorer={blockExplorer}
                      rewards={rewards}
                    />
                  </Col>
                  <Col lg={{ offset: 2, span: 10 }} xs={{ span: 24 }}>
                    <a
                      href={blockExplorerLink}
                      className="ant-btn btn btn-secondary btn-sm btn-block bid-details-btn"
                      target="_blank"
                    >
                      <i className="bi bi-patch-check-fill btn-icon" /> Inspect Auction on Etherscan
                    </a>
                  </Col>
                </Row>
              </div>
              <div className="col-lg-6 order-1 order-lg-1 order-sm-1 hero-img" data-aos="zoom-in" data-aos-delay="200">
                <NftImage
                  nftContractAddress={auctionOptions.nftContract}
                  tokenId={auctionOptions.tokenId}
                  localProvider={localProvider}
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </section>

        <main id="main">
          <section id="services" class="services section-bg">
            <div class="container" data-aos="fade-up">
              <div class="section-title">
                <h2>How It Works</h2>
                <p>
                  Only NFT Deals lets you <strong>win premium NFTs at deep discounts</strong>. Here's how it works: each
                  bid raises the auction price by 0.0003 ETH and restarts the clock by 24 hours. The top bid when time
                  runs out wins the auction and keeps the NFT. The massive discount against floor price is possible
                  because we operate a novel auction format where you pay-to-bid and bid-to-earn.
                </p>
              </div>

              <div class="row">
                <div class="col-xl-3 col-md-6 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="100">
                  <div class="icon-box">
                    <div class="icon">
                      <i class="bx bx-money-withdraw"></i>
                    </div>
                    <h4>
                      <a href="">Pay-to-Bid</a>
                    </h4>
                    <p>
                      Each bid is always +0.0003 wETH above the current, top bid. If your bid loses, you get 90% of your
                      bid back. The remaining 10% is kept by the auction.
                    </p>
                  </div>
                </div>

                <div
                  class="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-md-0"
                  data-aos="zoom-in"
                  data-aos-delay="200"
                >
                  <div class="icon-box">
                    <div class="icon">
                      <i class="bx bx-timer"></i>
                    </div>
                    <h4>
                      <a href="">Timer Restarts</a>
                    </h4>
                    <p>
                      Each bid will extend the auction by 24 hours. This allows worldwide participation without losing
                      sleep. Plus, there’s no advantage to waiting until the last few minutes.
                    </p>
                  </div>
                </div>

                <div
                  class="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0"
                  data-aos="zoom-in"
                  data-aos-delay="300"
                >
                  <div class="icon-box">
                    <div class="icon">
                      <i class="bx bx-party"></i>
                    </div>
                    <h4>
                      <a href="">Winner, Winner</a>
                    </h4>
                    <p>
                      If you are the top bid when the timer runs out, you win the NFT. Click on "Claim NFT" in the menu
                      bar to transfer the NFT to your wallet.
                    </p>
                  </div>
                </div>

                <div
                  class="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0"
                  data-aos="zoom-in"
                  data-aos-delay="400"
                >
                  <div class="icon-box">
                    <div class="icon">
                      <i class="bx bx-coin-stack"></i>
                    </div>
                    <h4>
                      <a href="">Bid-to-Earn</a>
                    </h4>
                    <p>
                      Earn rewards everytime you bid. Rewards are based on the number of minutes remaining in this
                      auction. Bid early, get more. Rewards will be convertible into our token when it launches.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="video" class="faq">
            <div class="container" data-aos="fade-up">
              <div class="section-title">
                <h2>Quick Explainer Video</h2>
                <p className="explainer-video">
                  Watch this 60-second video to learn how to bid and win this NFT auction.
                </p>
                <div class="embed-container">
                  <YouTubeEmbed embedId={"i2byTuH1nvo"} />
                </div>
              </div>
            </div>
          </section>
          <section id="cta" class="cta">
            <div class="container" data-aos="zoom-in">
              <div class="row">
                <div class="col-lg-3 text-center text-lg-left">
                  <h3>
                    Trust Us, <p>We're Backed By The Best</p>
                  </h3>
                </div>
                <div class="pic col-lg-3 text-center">
                  <img src={tachyonLogo} class="img-fluid img-investors" alt="" />
                </div>
                <div class="pic col-lg-3 text-center">
                  <img src={consensysLogo} class="img-fluid img-investors" alt="" />
                </div>
                <div class="pic col-lg-3 text-center">
                  <img src={protocolLabsLogo} class="img-fluid img-investors" alt="" />
                </div>
              </div>
            </div>
          </section>
          <FAQ />
          <section id="team" class="team section-bg">
            <div class="container" data-aos="fade-up">
              <div class="section-title">
                <h2>Team</h2>
                <p>
                  We're a tight-knit team of hackers who love building products that users love. We won’t stop until all
                  high-value, collectible NFT sales are running through NFT Deals.
                </p>
              </div>
              <div class="row">
                <div class="col-lg-6">
                  <div class="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay="100">
                    <div class="pic">
                      <img src={rod} class="img-fluid profile-pic" alt="" />
                    </div>
                    <div class="member-info">
                      <h4>Rod Fuentes</h4>
                      <span>Co-founder & CEO</span>
                      <p>
                        IP lawyer turned 3x startup founder (1x exit, 2019). Hosts "NFT Show & Tell" on YouTube for fun.
                      </p>
                      <div class="social">
                        <a href="https://twitter.com/rodrigofuentes7">
                          <i class="bx bxl-twitter"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/jrodrigofuentes/">
                          {" "}
                          <i class="bx bxl-linkedin"></i>{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-lg-6 mt-4 mt-lg-0">
                  <div class="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay="200">
                    <div class="pic">
                      <img src={sandeep} class="img-fluid profile-pic" alt="" />
                    </div>
                    <div class="member-info">
                      <h4>Sandeep Arneja</h4>
                      <span>Co-founder & CTO</span>
                      <p>
                        Full-stack developer for 15+ years, 2x startup founder (1x exit, 2019). Loves Solidity and
                        Ant.Design.
                      </p>
                      <div class="social">
                        <a href="https://twitter.com/sandeeparneja">
                          <i class="bx bxl-twitter"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/sandeeparneja/">
                          {" "}
                          <i class="bx bxl-linkedin"></i>{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-lg-6 mt-4">
                  <div class="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay="300">
                    <div class="pic">
                      <img src={anon1} class="img-fluid profile-pic" alt="" />
                    </div>
                    <div class="member-info">
                      <h4>You?</h4>
                      <span>Lead Developer</span>
                      <p>You love hacking in Solidity and want to make NFTs accessible to all.</p>
                    </div>
                  </div>
                </div>

                <div class="col-lg-6 mt-4">
                  <div class="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay="400">
                    <div class="pic">
                      <img src={anon2} class="img-fluid profile-pic" alt="" />
                    </div>
                    <div class="member-info">
                      <h4>Your friend? </h4>
                      <span>Marketing</span>
                      <p>Enjoys making content like blogs, Tweets, and YouTube video.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="contact" class="contact">
            <div class="container" data-aos="fade-up">
              <div class="section-title">
                <h2>Stay In Touch</h2>
                <p>
                  The NFT Deals community is focused on bringing together NFT degens, newbies, traders, and creators to
                  power the future of auctions. Join us.
                </p>
                <div class="social-links mt-4">
                  <a href="https://twitter.com/NFT_Deals_xyz" class="twitter">
                    <i class="bx bxl-twitter"></i>
                  </a>
                  <a href="https://discord.gg/Q8WM4yHc" class="discord">
                    <i class="bx bxl-discord"></i>
                  </a>
                  <a href="https://medium.com/@rodrigofuentes7/" class="medium">
                    <i class="bx bxl-medium"></i>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer id="footer">
          <div class="footer-top">
            <div class="container">
              <div class="row">
                <div class="col-lg-3 col-md-6 footer-contact">
                  <a href="index.html" class="logo">
                    <img src="../img/NFTD_Logo_2.png" alt="" class="img-fluid  footer-logo" />
                  </a>
                  <p>
                    Made with ❤️
                    <p>in Texas and New York</p>
                    <p>
                      <strong>Email:</strong> info_at_nftdeals.xyz
                    </p>
                  </p>
                </div>

                <div class="col-lg-3 col-md-6 footer-links">
                  <h4>Useful Links</h4>
                  <ul>
                    <li>
                      <i class="bx bx-chevron-right"></i> <a href="#">Bid to Win</a>
                    </li>
                    <li>
                      <i class="bx bx-chevron-right"></i> <a href="#team">About Us</a>
                    </li>
                    <li>
                      <i class="bx bx-chevron-right"></i> <a href="#">Claim Your NFT</a>
                    </li>
                    <li>
                      <i class="bx bx-chevron-right"></i> <a href="#">Sell Your NFT</a>
                    </li>
                  </ul>
                </div>

                <div class="col-lg-3 col-md-6 footer-links">
                  <h4>Our Services</h4>
                  <ul>
                    <li>
                      <i class="bx bx-chevron-right"></i> <a href="#">Documentation</a>
                    </li>
                    <li>
                      <i class="bx bx-chevron-right"></i> <a href="#">Jobs</a>
                    </li>
                    <li>
                      <i class="bx bx-chevron-right"></i> <a href="#">Terms of Service</a>
                    </li>
                    <li>
                      <i class="bx bx-chevron-right"></i> <a href="#">Privacy Policy</a>
                    </li>
                  </ul>
                </div>

                <div class="col-lg-3 col-md-6 footer-links">
                  <h4>Join Our Journey</h4>
                  <p>
                    Follow us on Twitter, where we drop the latest alpha. Read our Medium posts for announcements. Join
                    our Discord to drink from the firehose.
                  </p>
                  <div class="social-links mt-3">
                    <a href="https://twitter.com/NFT_Deals_xyz" class="twitter">
                      <i class="bx bxl-twitter"></i>
                    </a>
                    <a href="https://discord.gg/Q8WM4yHc" class="discord">
                      <i class="bx bxl-discord"></i>
                    </a>
                    <a href="https://medium.com/@rodrigofuentes7/" class="medium">
                      <i class="bx bxl-medium"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="container footer-bottom clearfix">
            <div class="copyright">
              &copy; Copyright{" "}
              <strong>
                <span>Masalsa Inc.</span>
              </strong>
              . All Rights Reserved
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
      </NftOptionsContext.Provider>
      </AuctionOptionsContext.Provider>
    </>
  );
}

const Duration = ({durationToExpire}) => {
  const getDays = () => {
    if(durationToExpire.days() > 0){
      return `${durationToExpire.days()} d`
    }else {
      return ''
    }
  }
  return <>
    {durationToExpire && durationToExpire.as('seconds') > 0 &&  `${getDays()} ${durationToExpire.hours()}h ${durationToExpire.minutes()}m ${durationToExpire.seconds()}s`}
    {durationToExpire && durationToExpire.as('seconds') <= 0 && `Expired`}
  </>
}


export default Auction2