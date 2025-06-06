import YouTubeEmbed from "./YouTubeEmbed";
import { consensysLogo, protocolLabsLogo, tachyonLogo } from "../img";
import FAQ from "./FAQ";
import { anon1, anon2, rod, sandeep } from "../img/team";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";
import { useContext } from "react";

const MainContentSection = props => {
  const auctionOptions = useContext(AuctionOptionsContext);
  const isNoRefundAuction =
    auctionOptions.auctionFeeType === 1 &&
    auctionOptions.staticFeeInBasisPoints.eq(10000);
  const isRefundAuction = !isNoRefundAuction;
  const isOffer = auctionOptions.minimumBidIncrement.eq(0);
  const isBidding = !isOffer;

  return (
    <main id="main">
      <section id="services" className="services section-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>How is this not a scam?</h2>
            <h5>
              The huge discount is possible because the seller earns fees from each{" "} 
              bid – rather than just the final winning bid.
            </h5>              
            <p>
              As a result, the winning{" "}
              bidder can get a discount, and the seller can earn{" "}
              more than floor price from cumulative bid fees. Here are some key traits of this auction. 
            </p>
          </div>

          <div className="row">
            <div
              className="col-xl-3 col-md-6 d-flex align-items-stretch"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              {isRefundAuction && <div className="icon-box">
                <div className="icon">
                  <i className="bx bx-money-withdraw"></i>
                </div>
                <h4>
                  <a>Refund if Outbid</a>
                </h4>
                  <p>
                    You get money back if someone outbids you. That refund
                    is based on the auction type & time remaining in the auction
                    when you bid.{" "}
                    <a
                      target="_blank"
                      href="https://coral-credit-8f4.notion.site/Outbid-Rebate-Explainer-418da5f676f44d44910e831b2a81b8f4"
                    >
                      The earlier you bid, the more money you get back.
                    </a>
                  </p>
              </div>}
              {isNoRefundAuction && <div className="icon-box">
                <div className="icon">
                  <i className="bx bx-money-withdraw"></i>
                </div>
                <h4>
                  <a>Pay-to-Bid Auction</a>
                </h4>
                  <p>
                    Unlike a standard auction (where only the winning bidder is required to pay), {" "}
                    this auction requires all bidders to pay {" "}
                    their bid amount.
                  </p>
              </div>}
            </div>

            <div
              className="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-md-0"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <div className="icon-box">
                <div className="icon">
                  <i className="bx bx-timer" />
                </div>
                <h4>
                  <a>Timer Extension</a>
                </h4>
                <p>
                  Each bid will extend the auction by 24 hours. This allows
                  worldwide participation without losing sleep. Plus, there’s no
                  advantage to waiting until the last few minutes.
                </p>
              </div>
            </div>

            <div
              className="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <div className="icon-box">
                <div className="icon">
                  <i className="bx bx-party" />
                </div>
                <h4>
                  <a>How to Win</a>
                </h4>
                <p>
                  If you placed the last bid when the timer runs out, you win the
                  NFT. Click on "Claim NFT" in the menu bar to transfer the NFT
                  to your wallet.
                </p>
              </div>
            </div>

            <div
              className="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <div className="icon-box">
                <div className="icon">
                  <i className="bx bx-coin-stack" />
                </div>
                <h4>
                  <a>Bid Farm™</a>
                </h4>
                <p>
                Everyone's a winner, because you get 2 Free Bids after placing a Paid Bid. And – yes! – you can apply those Free Bids to any future auction for higher value NFTs! Of course, you cannot get Free Bids from placing a Free Bid.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="video" className="faq">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>Quick Explainer Video</h2>
            <p className="explainer-video">
              Watch this 2-min. video to learn how to bid and win on NFT Deals
              auctions.
            </p>
            <div className="embed-container">
              {isOffer && <YouTubeEmbed embedId={"Ww3CSMpVKjg"} />}
              {isBidding && <YouTubeEmbed embedId={"pyQ0SU-0JJc"} />}
            </div>
          </div>
        </div>
      </section>
      <section id="cta" className="cta">
        <div className="container" data-aos="zoom-in">
          <div className="row">
            <div className="col-lg-3 text-center text-lg-left">
              <h3>
                Trust Us, <p>We're Backed By The Best</p>
              </h3>
            </div>
            <div className="pic col-lg-3 text-center">
              <img
                src={tachyonLogo}
                className="img-fluid img-investors"
                alt=""
              />
            </div>
            <div className="pic col-lg-3 text-center">
              <img
                src={consensysLogo}
                className="img-fluid img-investors"
                alt=""
              />
            </div>
            <div className="pic col-lg-3 text-center">
              <img
                src={protocolLabsLogo}
                className="img-fluid img-investors"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
      <section id="team" className="team section-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>Team</h2>
            <p>
              We're a tight-knit team of hackers who enjoy making products that
              users love. We won’t stop until all high-value, collectible NFT
              sales are running through NFT Deals.
            </p>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div
                className="member d-flex align-items-start"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <div className="pic">
                  <img src={rod} className="img-fluid profile-pic" alt="" />
                </div>
                <div className="member-info">
                  <h4>Rod Fuentes</h4>
                  <span>Co-founder & CEO</span>
                  <p>
                    IP lawyer turned 3x startup founder (1x exit, 2019). Hosts
                    "NFT Show & Tell" on YouTube for fun.
                  </p>
                  <div className="social">
                    <a
                      target="_blank"
                      href="https://twitter.com/rodrigofuentes7"
                    >
                      <i className="bx bxl-twitter" />
                    </a>
                    <a
                      target="_blank"
                      href="https://www.linkedin.com/in/jrodrigofuentes/"
                    >
                      {" "}
                      <i className="bx bxl-linkedin" />{" "}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mt-4 mt-lg-0">
              <div
                className="member d-flex align-items-start"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <div className="pic">
                  <img src={sandeep} className="img-fluid profile-pic" alt="" />
                </div>
                <div className="member-info">
                  <h4>Sandeep Arneja</h4>
                  <span>Co-founder & CTO</span>
                  <p>
                    Full-stack developer for 15+ years, 2x startup founder (1x
                    exit, 2019). Loves Solidity and Ant.Design.
                  </p>
                  <div className="social">
                    <a target="_blank" href="https://twitter.com/sandeeparneja">
                      <i className="bx bxl-twitter" />
                    </a>
                    <a
                      target="_blank"
                      href="https://www.linkedin.com/in/sandeeparneja/"
                    >
                      {" "}
                      <i className="bx bxl-linkedin" />{" "}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mt-4">
              <div
                className="member d-flex align-items-start"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                <div className="pic">
                  <img src={anon1} className="img-fluid profile-pic" alt="" />
                </div>
                <div className="member-info">
                  <h4>You?</h4>
                  <span>Lead Developer</span>
                  <p>
                    You love hacking in Solidity and want to make NFTs
                    accessible to all.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mt-4">
              <div
                className="member d-flex align-items-start"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                <div className="pic">
                  <img src={anon2} className="img-fluid profile-pic" alt="" />
                </div>
                <div className="member-info">
                  <h4>Your friend? </h4>
                  <span>Marketing</span>
                  <p>
                    Enjoys making content like blogs, Tweets, and YouTube video.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="contact" className="contact">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>Stay In Touch</h2>
            <p>
              The NFT Deals community is focused on bringing together NFT
              degens, newbies, traders, flippers, and creators to power the
              future of auction technology. Over time, our novel auction
              protocol should become increasingly decentralized so that it is
              governed by a DAO that empowers even the smallest entrepreneurs to
              earn income by hosting their own NFT auction house. Join us.
            </p>
            <div className="social-links mt-4">
              <a
                target="_blank"
                href="https://twitter.com/NFT_Deals_xyz"
                className="twitter"
              >
                <i className="bx bxl-twitter" />
              </a>
              <a
                target="_blank"
                href="https://discord.gg/uKQgkteu72"
                className="discord"
              >
                <i className="bx bxl-discord" />
              </a>
              <a
                target="_blank"
                href="https://medium.com/nftdeals/"
                className="medium"
              >
                <i className="bx bxl-medium" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContentSection;
