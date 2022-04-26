import YouTubeEmbed from "./YouTubeEmbed";
import { consensysLogo, protocolLabsLogo, tachyonLogo } from "../img";
import FAQ from "./FAQ";
import { anon1, anon2, rod, sandeep } from "../img/team";

const MainContentSection = props => {
  return (
    <main id="main">
      <section id="services" className="services section-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>How It Works</h2>
            <p>
              Only NFT Deals lets you{" "}
              <strong>win premium NFTs at deep discounts</strong>. Here's how it
              works: each bid raises the auction price by 0.0003 ETH and
              restarts the clock by 24 hours. The top bid when time runs out
              wins the auction and keeps the NFT. The massive discount against
              floor price is possible because we operate a novel auction format
              where you pay-to-bid and bid-to-earn.
            </p>
          </div>

          <div className="row">
            <div
              className="col-xl-3 col-md-6 d-flex align-items-stretch"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <div className="icon-box">
                <div className="icon">
                  <i className="bx bx-money-withdraw"></i>
                </div>
                <h4>
                  <a href="">Pay-to-Bid</a>
                </h4>
                <p>
                  Each bid is always +0.0003 wETH above the current, top bid. If
                  your bid loses, you get 90% of your bid back. The remaining
                  10% is kept by the auction.
                </p>
              </div>
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
                  <a href="">Timer Restarts</a>
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
                  <a href="">Winner, Winner</a>
                </h4>
                <p>
                  If you are the top bid when the timer runs out, you win the
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
                  <a href="">Bid-to-Earn</a>
                </h4>
                <p>
                  Earn rewards everytime you bid. Rewards are based on the
                  number of minutes remaining in this auction. Bid early, get
                  more. Rewards will be convertible into our token when it
                  launches.
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
              Watch this 60-second video to learn how to bid and win this NFT
              auction.
            </p>
            <div className="embed-container">
              <YouTubeEmbed embedId={"i2byTuH1nvo"} />
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
      <FAQ />
      <section id="team" className="team section-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>Team</h2>
            <p>
              We're a tight-knit team of hackers who love building products that
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
                    <a href="https://twitter.com/rodrigofuentes7">
                      <i className="bx bxl-twitter" />
                    </a>
                    <a href="https://www.linkedin.com/in/jrodrigofuentes/">
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
                    <a href="https://twitter.com/sandeeparneja">
                      <i className="bx bxl-twitter" />
                    </a>
                    <a href="https://www.linkedin.com/in/sandeeparneja/">
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
              degens, newbies, traders, and creators to power the future of
              auctions. Join us.
            </p>
            <div className="social-links mt-4">
              <a href="https://twitter.com/NFT_Deals_xyz" className="twitter">
                <i className="bx bxl-twitter" />
              </a>
              <a href="https://discord.gg/uKQgkteu72" className="discord">
                <i className="bx bxl-discord" />
              </a>
              <a href="https://medium.com/@rodrigofuentes7/" className="medium">
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
