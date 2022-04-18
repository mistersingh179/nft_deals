import bayc300 from '../img/BAYC300.png';
import logo from '../img/NFTD_Logo_2.png';
import {NetworkDisplay, ThemeSwitch} from "../components";
import AccountAndOthers from "../components/AccountAndOthers";

import React, { useState } from 'react';
import {Drawer, Button, Space, Radio, Skeleton} from 'antd';
import Blockies from "react-blockies";

const Auction2 = props => {
  const {NETWORKCHECK, localChainId, selectedChainId, targetNetwork, logoutOfWeb3Modal, USE_NETWORK_SELECTOR} = props
  const {useBurner, address, localProvider, userSigner, mainnetProvider, price, web3Modal,
    loadWeb3Modal, blockExplorer, readContracts,
    networkOptions, selectedNetwork, setSelectedNetwork, USE_BURNER_WALLET, yourLocalBalance} = props

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

    return (
    <>
      <header id="header" className="fixed-top ">
        <div className="container d-flex align-items-center">

          <a href="index.html" className="logo mr-auto">
            <img src={logo} alt="" className="img-fluid"/>
          </a>
          <nav className="nav-menu d-none d-lg-block">
            <ul>
              <li className="active"><a href="#">Bid to Win</a></li>
              <li><a href="#claim">Claim NFT</a></li>
              <li><a href="#sell">Sell Your NFT</a></li>
              <li><a href="#docs">Docs</a></li>
            </ul>
          </nav>

          <Space>
            <a href="#about" className="get-started-btn scrollto">Connect Wallet</a>
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
                  <h3>Top Bid <i className="bi bi-info-circle bid-info" data-toggle="tooltip"
                                 data-placement="top"
                                 title="The top bidder when the timer ends will win the auction."></i></h3>
                  <h1>Ξ 0.0012</h1>
                </div>
                <div className="col-md-6 bid-box">
                  <h3>Ends in <i className="bi bi-info-circle bid-info" data-toggle="tooltip"
                                 data-placement="top"
                                 title="A new top bid will extend the auction by 24 hours. There’s no advantage to waiting until the last few minutes."></i>
                  </h3>
                  <h1 id="end-timer">2h 12m 53s</h1>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 bid-box">
                  <h3>Next Bid <i className="bi bi-info-circle bid-info" data-toggle="tooltip"
                                  data-placement="top"
                                  title="Bid increments are fixed at +0.0003 ETH above the current bid."></i></h3>
                  <h1>Ξ 0.0015</h1>
                </div>
                <div className="col-md-6 bid-box">
                  <h3>Earnable Rewards <i className="bi bi-info-circle bid-info" data-toggle="tooltip"
                                          data-placement="top"
                                          title="Bid early, get more. Rewards will be convertible into our NFTD token when it launches."></i>
                  </h3>
                  <h1>249</h1>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 offset-sm-3 col-lg-6 offset-lg-0">
                  <button onClick="gtag('event','button_click');" className="btn btn-primary btn-lg btn-block"
                          data-toggle="modal" data-target="#bidModal">Bid Now
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 offset-sm-3 col-lg-3 offset-lg-0"><a href="#"
                                                                              className="btn btn-secondary btn-sm btn-block">
                  <i className="bi bi-card-checklist btn-icon"></i> Bid History</a>
                </div>
                <div className="col-sm-3 offset-sm-0 col-lg-3 offset-lg-0"><a href="#"
                                                                              className="btn btn-secondary btn-sm btn-block">
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
            <div class="pic col-lg-3 text-center"><img src="../img/consensys-tachyon-logo.png" class="img-fluid" alt="" /></div>
            <div class="pic col-lg-3 text-center"><img src="../img/consensys-labs-icon-logo-white.png" class="img-fluid" alt="" /></div>
            <div class="pic col-lg-3 text-center"><img src="../img/protocol-labs-logo.png" class="img-fluid" alt="" /></div>
          </div>
        </div>
      </section>

      <section id="faq" class="faq">
        <div class="container" data-aos="fade-up">

          <div class="section-title">
            <h2>Frequently Asked Questions</h2>
            <p>
              NFT Deals is an experimental and pioneering implementation of our novel auction format. Our goal is to routinely sell the most premium NFTs at 40-70% off the prevailing floor price. In time, we aim to decentralize our protocol so that it is governed by a DAO that empowers even the smallest entrepreneurs to benefit from NFT sales.
            </p>
          </div>

          <div class="faq-list">
            <ul>
              <li data-aos="fade-up" data-aos-delay="100">
                <i class="bx bx-help-circle icon-help"></i> <a data-toggle="collapse" class="collapse" href="#faq-list-1">Remind me, how does this work? <i class="bx bx-chevron-down icon-show"></i><i class="bx bx-chevron-up icon-close"></i></a>
                <div id="faq-list-1" class="collapse show" data-parent=".faq-list">
                  <p>
                    Each bid raises the auction price by 0.0003 ETH. The auction clock restarts from 24 hours with every bid. If no new Bids are placed before the clock runs out, the last bidder wins. Each bidder pays a small fee to play (10% of their bid amount), which makes the massive discount against the floor price possible.
                  </p>
                </div>
              </li>

              <li data-aos="fade-up" data-aos-delay="200">
                <i class="bx bx-help-circle icon-help"></i> <a data-toggle="collapse" href="#faq-list-2" class="collapsed">Feugiat scelerisque varius morbi enim nunc? <i class="bx bx-chevron-down icon-show"></i><i class="bx bx-chevron-up icon-close"></i></a>
                <div id="faq-list-2" class="collapse" data-parent=".faq-list">
                  <p>
                    Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.
                  </p>
                </div>
              </li>

              <li data-aos="fade-up" data-aos-delay="300">
                <i class="bx bx-help-circle icon-help"></i> <a data-toggle="collapse" href="#faq-list-3" class="collapsed">Dolor sit amet consectetur adipiscing elit? <i class="bx bx-chevron-down icon-show"></i><i class="bx bx-chevron-up icon-close"></i></a>
                <div id="faq-list-3" class="collapse" data-parent=".faq-list">
                  <p>
                    Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Faucibus pulvinar elementum integer enim. Sem nulla pharetra diam sit amet nisl suscipit. Rutrum tellus pellentesque eu tincidunt. Lectus urna duis convallis convallis tellus. Urna molestie at elementum eu facilisis sed odio morbi quis
                  </p>
                </div>
              </li>

              <li data-aos="fade-up" data-aos-delay="400">
                <i class="bx bx-help-circle icon-help"></i> <a data-toggle="collapse" href="#faq-list-4" class="collapsed">Tempus quam pellentesque nec nam aliquam sem et tortor consequat? <i class="bx bx-chevron-down icon-show"></i><i class="bx bx-chevron-up icon-close"></i></a>
                <div id="faq-list-4" class="collapse" data-parent=".faq-list">
                  <p>
                    Molestie a iaculis at erat pellentesque adipiscing commodo. Dignissim suspendisse in est ante in. Nunc vel risus commodo viverra maecenas accumsan. Sit amet nisl suscipit adipiscing bibendum est. Purus gravida quis blandit turpis cursus in.
                  </p>
                </div>
              </li>

              <li data-aos="fade-up" data-aos-delay="500">
                <i class="bx bx-help-circle icon-help"></i> <a data-toggle="collapse" href="#faq-list-5" class="collapsed">Tortor vitae purus faucibus ornare. Varius vel pharetra vel turpis nunc eget lorem dolor? <i class="bx bx-chevron-down icon-show"></i><i class="bx bx-chevron-up icon-close"></i></a>
                <div id="faq-list-5" class="collapse" data-parent=".faq-list">
                  <p>
                    Laoreet sit amet cursus sit amet dictum sit amet justo. Mauris vitae ultricies leo integer malesuada nunc vel. Tincidunt eget nullam non nisi est sit amet. Turpis nunc eget lorem dolor sed. Ut venenatis tellus in metus vulputate eu scelerisque.
                  </p>
                </div>
              </li>

            </ul>
          </div>

        </div>
      </section>


      <section id="team" class="team section-bg">
        <div class="container" data-aos="fade-up">

          <div class="section-title">
            <h2>Team</h2>
            <p>We're a tight-knit team of hackers who love building products that users love. We won’t stop until all high-value, collectible NFT sales are running through NFT Deals.</p>
          </div>

          <div class="row">

            <div class="col-lg-6">

              <div class="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay="100">
                <div class="pic"><img src="../img/team/rod.jpg" class="img-fluid" alt="" /></div>
                <div class="member-info">
                  <h4>Rod Fuentes</h4>
                  <span>Co-founder & CEO</span>
                  <p>IP lawyer turned 3x startup founder (1x exit, 2019). Hosts "NFT Show & Tell" on YouTube for fun.</p>
                  <div class="social">
                    <a href="https://twitter.com/rodrigofuentes7"><i class="ri-twitter-fill"></i></a>
                    <a href="https://www.linkedin.com/in/jrodrigofuentes/"> <i class="ri-linkedin-box-fill"></i> </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mt-4 mt-lg-0">
              <div class="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay="200">
                <div class="pic"><img src="../img/team/sandeep.jpg" class="img-fluid" alt="" /></div>
                <div class="member-info">
                  <h4>Sandeep Arneja</h4>
                  <span>Co-founder & CTO</span>
                  <p>Full-stack developer for 15+ years, 2x startup founder (1x exit, 2019). Loves Solidity and Ant.Design.</p>
                  <div class="social">
                    <a href="https://twitter.com/sandeeparneja"><i class="ri-twitter-fill"></i></a>
                    <a href="https://www.linkedin.com/in/sandeeparneja/"> <i class="ri-linkedin-box-fill"></i> </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mt-4">
              <div class="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay="300">
                <div class="pic"><img src="../img/team/anon1.png" class="img-fluid" alt="" /></div>
                <div class="member-info">
                  <h4>You?</h4>
                  <span>Lead Developer</span>
                  <p>You love hacking in Solidity and want to make NFTs accessible to all.</p>
                </div>
              </div>
            </div>

            <div class="col-lg-6 mt-4">
              <div class="member d-flex align-items-start" data-aos="zoom-in" data-aos-delay="400">
                <div class="pic"><img src="../img/team/anon2.png" class="img-fluid" alt="" /></div>
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
              Made with ❤️ in
              Texas and New York
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