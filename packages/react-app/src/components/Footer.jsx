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
                <p>in Texas and New York</p>
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
                  <a href="#">Bid to Win</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#team">About Us</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#">Claim Your NFT</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#">Sell Your NFT</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 footer-links">
              <h4>Our Services</h4>
              <ul>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#">Documentation</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" /> <a href="#">Jobs</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#">Privacy Policy</a>
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
                <a href="https://twitter.com/NFT_Deals_xyz" className="twitter">
                  <i className="bx bxl-twitter" />
                </a>
                <a href="https://discord.gg/uKQgkteu72" className="discord">
                  <i className="bx bxl-discord" />
                </a>
                <a
                  href="https://medium.com/@rodrigofuentes7/"
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
