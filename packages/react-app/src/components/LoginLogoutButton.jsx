import {Button} from "antd";
import {Link} from "react-router-dom";

export default (props) => {
  const {web3Modal, loadWeb3Modal, logoutOfWeb3Modal, className} = props

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Link
          to={'javascipt:void(0)'}
          className={className}
          key="logoutbutton"
          onClick={logoutOfWeb3Modal}
        >
          Disconnect Wallet
        </Link>,
      );
    } else {
      modalButtons.push(
        <Link
          to={'javascipt:void(0)'}
          className={className}
          key="loginbutton"
          onClick={loadWeb3Modal}
        >
          Connect Wallet
        </Link>,
      );
    }
  }

  return <>
      {modalButtons}
    </>
}