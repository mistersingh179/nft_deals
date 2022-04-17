import bayc300 from '../img/BAYC300.png';

const Auction2 = props => {
  return (
      <div>
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
  )
}

export default Auction2