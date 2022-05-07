import {Menu} from "antd";
import {Link} from "react-router-dom";

const TopNavMenu = props => {

  const {location: location} = props

  return (
    <Menu style={{ textAlign: "center"}} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/BestNft">
          <Link to="/BestNft">Best NFT</Link>
        </Menu.Item>
        <Menu.Item key="/WETH">
          <Link to="/WETH">WETH</Link>
        </Menu.Item>
        <Menu.Item key="/AuctionFactory">
          <Link to="/AuctionFactory">AuctionFactory</Link>
        </Menu.Item>
        <Menu.Item key="/AuctionList">
          <Link to="/AuctionList">AuctionList</Link>
        </Menu.Item>
        <Menu.Item key="/auctions">
          <Link to="/auctions">Auctions</Link>
        </Menu.Item>
        <Menu.Item key="/debug">
          <Link to="/debug">Debug Contracts</Link>
        </Menu.Item>
      </Menu>
  );
}

export default TopNavMenu