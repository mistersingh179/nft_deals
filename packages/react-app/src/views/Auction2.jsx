import bayc300 from '../img/BAYC300.png';
import tachyonLogo from '../img/consensys-tachyon-logo.png';
import consensysLogo from '../img/consensys-labs-icon-logo-white.png';
import protocolLabsLogo from '../img/protocol-labs-logo.png';
import rod from '../img/team/rod.jpg';
import sandeep from '../img/team/sandeep.jpg';
import anon1 from '../img/team/anon1.png';
import anon2 from '../img/team/anon2.png';
import logo from '../img/NFTD_Logo_2.png';
import {LoginLogoutButton, NetworkDisplay, ThemeSwitch, ApproveBidButtonsCombo} from "../components";
import AccountAndOthers from "../components/AccountAndOthers";

import React, {useEffect, useState} from 'react';
import {Drawer, Button, Space, Radio, Skeleton, Tooltip} from 'antd';
import Blockies from "react-blockies";

import FAQ from '../components/FAQ';
import {Link, useParams} from "react-router-dom";
import {useTopNavClass} from "../hooks";
import useExpiration from "../hooks/useExpiration";

const Auction2 = props => {
  const {NETWORKCHECK, localChainId, selectedChainId, targetNetwork, logoutOfWeb3Modal, USE_NETWORK_SELECTOR} = props
  const {useBurner, address, localProvider, userSigner, mainnetProvider, price, web3Modal,
    loadWeb3Modal, blockExplorer, readContracts, writeContracts,
    networkOptions, selectedNetwork, setSelectedNetwork, USE_BURNER_WALLET, yourLocalBalance, tx} = props

  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState('right');

  const showDrawer = () => {
    setVisible(true);
  };

  const onChange = (e) => {
    setPlacement("right");
  };

  const onClose = () => {
    setVisible(false);
  };

  function BlockiesIcon(props) {
    const address = props.address;
    if (address) {
      return (
        <div onClick={showDrawer}>
          <Blockies seed={address.toLowerCase()}
                    size={8}
                    scale={props.fontSize ? props.fontSize / 7 : 4}
          />
        </div>
    );}
    return <span />;
  }

  let { slug } = useParams();
  const auctionContractAddress = slug
  const topNavClass = useTopNavClass()
  const durationToExpire = useExpiration(readContracts, auctionContractAddress, localProvider)

    return (
    <>
      <header id="header" className={`fixed-top ${topNavClass}`}>
        <div className="container d-flex align-items-center">

          <a href="index.html" className="logo mr-auto">
            <img src={logo} alt="" className="img-fluid"/>
          </a>
          <nav className="nav-menu d-none d-lg-block">
            <ul>
              <li className="active"><a href="#">Bid to Win</a></li>
              <li><a href="#claim">Claim NFT</a></li>
              <li>
                <Link to="/AuctionList">Sell Your NFT</Link>
              </li>
              <li><a href="#docs">Docs</a></li>
            </ul>
          </nav>

          <Space>
            <LoginLogoutButton
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              className="get-started-btn scrollto"
            />

            <BlockiesIcon address={address} />
          </Space>

        </div>
      </header>

      <section id="hero" className="d-flex align-items-center">

        <Drawer
          title="Your Wallet"
          placement={placement}
          width={400}
          onClose={onClose}
          visible={visible}
        >
          <NetworkDisplay
              NETWORKCHECK={NETWORKCHECK}
              localChainId={localChainId}
              selectedChainId={selectedChainId}
              targetNetwork={targetNetwork}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
          />
          <AccountAndOthers
              useBurner={USE_BURNER_WALLET}
              address={address}
              localProvider={localProvider}
              userSigner={userSigner}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
              readContracts={readContracts}
              USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
              networkOptions={networkOptions}
              selectedNetwork={selectedNetwork}
              setSelectedNetwork={setSelectedNetwork}
              USE_BURNER_WALLET={USE_BURNER_WALLET}
              yourLocalBalance={yourLocalBalance}
              targetNetwork={targetNetwork}
            />
        </Drawer>

        <div class={'container'}>
          <div className="row">
            <div className="col-lg-12 d-flex flex-column justify-content-center" data-aos="fade-up" data-aos-delay="200">
              <div className="explainer-banner text-center">
                <p>🎉 Buy this NFT for 90% off floor price??? Ok, STFU, I'm in!</p>
              </div>
            </div>
          </div>

          <div className="row">

            <div className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-2 order-sm-2"
                 data-aos="fade-up" data-aos-delay="200">
              <h1>Bored Ape Yacht Club #2386</h1>
              <h2>Collection Floor Price: Ξ 111 <span className="smaller-usdc">(~$390,707.79)</span></h2>
              <div className="row">
                <div className="col-md-6 bid-box">
                  <Space>
                    <h3>Top Bid <Tooltip title="The top bidder when the timer ends will win the auction.">
                      <i className="bi bi-info-circle bid-info"></i></Tooltip>
                    </h3>
                  </Space>
                  <h1>Ξ 0.0012</h1>
                </div>
                <div className="col-md-6 bid-box">
                  <h3>Ends in <Tooltip 
                    title="A new top bid will extend the auction by 24 hours. There’s no advantage to waiting 
                    until the last few minutes.">
                      <i className="bi bi-info-circle bid-info"></i></Tooltip>
                  </h3>
                  <h1 id="end-timer">
                    {durationToExpire && `${durationToExpire.hours()} hours, ${durationToExpire.minutes()} minutes, ${durationToExpire.seconds()} seconds`}
                  </h1>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 bid-box">
                  <h3>Next Bid <Tooltip title="Bid increments are fixed at +0.0003 ETH above the current bid.">
                    <i className="bi bi-info-circle bid-info"></i></Tooltip>
                  </h3>
                  <h1>Ξ 0.0015</h1>
                </div>
                <div className="col-md-6 bid-box">
                  <h3>Earnable Rewards <Tooltip title="Bid early, get more. Rewards will be convertible into our NFTD token when it launches.">
                    <i className="bi bi-info-circle bid-info"></i></Tooltip>
                  </h3>
                  <h1>249</h1>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 offset-sm-3 col-lg-6 offset-lg-0">
                  <ApproveBidButtonsCombo
                    writeContracts={writeContracts}
                    readContracts={readContracts}
                    address={address}
                    localProvider={localProvider}
                    auctionContractAddress={auctionContractAddress}
                    tx={tx}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 offset-sm-3 col-lg-3 offset-lg-0">
                  <a href="#" className="btn btn-secondary btn-sm btn-block">
                  <i className="bi bi-card-checklist btn-icon"></i> Bid History</a>
                </div>
                <div className="col-sm-3 offset-sm-0 col-lg-3 offset-lg-0">
                  <a href="#" className="btn btn-secondary btn-sm btn-block">
                  <i className="bi bi-patch-check-fill btn-icon"></i> Etherscan</a>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-1 order-sm-1 hero-img" data-aos="zoom-in" data-aos-delay="200">
              <img src={bayc300} className="img-fluid" alt="" />
            </div>
          </div>
        </div>
      </section>

      <div class="modal fade" id="bidModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Confirm Your Bid</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="col-lg">
                  <p>We love your enthusiasm, but we're not quite ready :)</p>
                  <p>Wen launch?! Very soon.</p>
                  <p>Follow us on Twitter to get the latest alpha. Join our Discord to watch or build the product with us.</p>
                  <div class="social-links mt-3 text-center">
                    <a href="https://twitter.com/NFT_Deals_xyz" class="twitter"><i class="bx bxl-twitter"></i></a>
                    <a href="https://discord.gg/Q8WM4yHc" class="discord"><i class="bx bxl-discord"></i></a>
                  </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <main id="main">

      <section id="services" class="services section-bg">
        <div class="container" data-aos="fade-up">

          <div class="section-title">
            <h2>How It Works</h2>
            <p>Only NFT Deals lets you <strong>win premium NFTs at deep discounts</strong>. Here's how it works: each bid raises the auction price by 0.0003 ETH and restarts the clock by 24 hours. The top bid when time runs out wins the auction and keeps the NFT. The massive discount against floor price is possible because we operate a novel auction format where you pay-to-bid and bid-to-earn.</p>
          </div>

          <div class="row">
            <div class="col-xl-3 col-md-6 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="100">
              <div class="icon-box">
                <div class="icon"><i class="bx bx-money-withdraw"></i></div>
                <h4><a href="">Pay-to-Bid</a></h4>
                <p>Each bid is always +0.0003 wETH above the current, top bid. If your bid loses, you get 90% of your bid back. The remaining 10% is kept by the auction.</p>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-md-0" data-aos="zoom-in" data-aos-delay="200">
              <div class="icon-box">
                <div class="icon"><i class="bx bx-timer"></i></div>
                <h4><a href="">Timer Restarts</a></h4>
                <p>Each bid will extend the auction by 24 hours. This allows worldwide participation without losing sleep. Plus, there’s no advantage to waiting until the last few minutes.</p>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0" data-aos="zoom-in" data-aos-delay="300">
              <div class="icon-box">
                <div class="icon"><i class="bx bx-party"></i></div>
                <h4><a href="">Winner, Winner</a></h4>
                <p>If you are the top bid when the timer runs out, you win the NFT. Click on "Claim NFT" in the menu bar to transfer the NFT to your wallet.</p>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0" data-aos="zoom-in" data-aos-delay="400">
              <div class="icon-box">
                <div class="icon"><i class="bx bx-coin-stack"></i></div>
                <h4><a href="">Bid-to-Earn</a></h4>
                <p>Earn rewards everytime you bid. Rewards are based on the number of minutes remaining in this auction. Bid early, get more. Rewards will be convertible into our token when it launches.</p>
              </div>
            </div>

          </div>

        </div>
      </section>


      <section id="cta" class="cta">
        <div class="container" data-aos="zoom-in">

          <div class="row">
            <div class="col-lg-3 text-center text-lg-left">
              <h3>Trust Us, <p>We're Backed By The Best</p></h3>
            </div>
            <div class="pic col-lg-3 text-center"><img src={tachyonLogo} class="img-fluid img-investors" alt="" /></div>
            <div class="pic col-lg-3 text-center"><img src={consensysLogo} class="img-fluid img-investors" alt="" /></div>
            <div class="pic col-lg-3 text-center"><img src={protocolLabsLogo} class="img-fluid img-investors" alt="" /></div>
          </div>
        </div>
      </section>

      <FAQ />

      <section id="team" class="team section-bg">
        <div class="container" data-aos="fade-up">

          <div class="section-title">
            <h2>Team</h2>
            <p>We're a tight-knit team of hackers who love building products that users love. We won’t stop until all high-value, collectible NFT sales are running through NFT Deals.</p>
          </div>

          <div class="row">

            <div class="col-lg-6">

              <div class="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay="100">
                <div class="pic"><img src={rod} class="img-fluid profile-pic" alt="" /></div>
                <div class="member-info">
                  <h4>Rod Fuentes</h4>
                  <span>Co-founder & CEO</span>
                  <p>IP lawyer turned 3x startup founder (1x exit, 2019). Hosts "NFT Show & Tell" on YouTube for fun.</p>
                  <div class="social">
                    <a href="https://twitter.com/rodrigofuentes7"><i class="bx bxl-twitter"></i></a>
                    <a href="https://www.linkedin.com/in/jrodrigofuentes/"> <i class="bx bxl-linkedin"></i> </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mt-4 mt-lg-0">
              <div class="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay="200">
                <div class="pic"><img src={sandeep} class="img-fluid profile-pic" alt="" /></div>
                <div class="member-info">
                  <h4>Sandeep Arneja</h4>
                  <span>Co-founder & CTO</span>
                  <p>Full-stack developer for 15+ years, 2x startup founder (1x exit, 2019). Loves Solidity and Ant.Design.</p>
                  <div class="social">
                    <a href="https://twitter.com/sandeeparneja"><i class="bx bxl-twitter"></i></a>
                    <a href="https://www.linkedin.com/in/sandeeparneja/"> <i class="bx bxl-linkedin"></i> </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mt-4">
              <div class="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay="300">
                <div class="pic"><img src={anon1} class="img-fluid profile-pic" alt="" /></div>
                <div class="member-info">
                  <h4>You?</h4>
                  <span>Lead Developer</span>
                  <p>You love hacking in Solidity and want to make NFTs accessible to all.</p>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mt-4">
              <div class="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay="400">
                <div class="pic"><img src={anon2} class="img-fluid profile-pic" alt="" /></div>
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
              The NFT Deals community is focused on bringing together NFT degens, newbies, traders, and creators to power the future of auctions. Join us.
            </p>
            <div class="social-links mt-4">
                <a href="https://twitter.com/NFT_Deals_xyz" class="twitter"><i class="bx bxl-twitter"></i></a>
                <a href="https://discord.gg/Q8WM4yHc" class="discord"><i class="bx bxl-discord"></i></a>
                <a href="https://medium.com/@rodrigofuentes7/" class="medium"><i class="bx bxl-medium"></i></a>
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
    </>
  )
}

export default Auction2