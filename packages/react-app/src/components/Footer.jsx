const Footer = props => {
  return (
    <footer id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 footer-contact">
              <a href="index.html" className="logo">
                <img
                  src="../img/NFTD_Logo_2.png"
                  alt=""
                  className="img-fluid  footer-logo"
                />
              </a>
              <p>
                Made with ❤️
                <p>around the world</p>
                <p>
                  <strong>Email:</strong> info_at_nftdeals.xyz
                </p>
              </p>
            </div>

            <div className="col-lg-3 col-md-6 footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a target="_blank" href="https://nftdeals.xyz/#team">About Us</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSfLyFKX1O4iox3dBWdIzyyaDItQg1-XI_cn9aNM1auCSdh6pA/viewform?usp=fb_send_twt">Sell Your NFT</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a target="_blank" href="https://nftdeals.xyz/#faq">FAQ</a>
                </li>                
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 footer-links">
              <h4>Learn More</h4>
              <ul>
                <li>
                  <i className="bx bx-chevron-right" /> <a target="_blank" href="https://nftdeals.freshteam.com/jobs/WFJ15FqYULJc/web3-full-stack-software-engineer-remote?ft_source=Internal_6000545760&ft_medium=Referral_6000490677&u=6000405755">Jobs</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a target="_blank" href="https://nftdeals.xyz/tos.html">Terms of Service</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a target="_blank" href="https://nftdeals.xyz/privacy.html">Privacy Policy</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 footer-links">
              <h4>Join Our Journey</h4>
              <p>
                Follow us on Twitter, where we drop the latest alpha. Read our
                Medium posts for announcements. Join our Discord to drink from
                the firehose.
              </p>
              <div className="social-links mt-3">
                <a target="_blank" href="https://twitter.com/NFT_Deals_xyz" className="twitter">
                  <i className="bx bxl-twitter" />
                </a>
                <a target="_blank" href="https://discord.gg/uKQgkteu72" className="discord">
                  <i className="bx bxl-discord" />
                </a>
                <a
                  target="_blank" href="https://medium.com/nftdeals"
                  className="medium"
                >
                  <i className="bx bxl-medium" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom clearfix">
        <div className="copyright">
          &copy; Copyright{" "}
          <strong>
            <span>Masalsa Inc.</span>
          </strong>
          . All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
