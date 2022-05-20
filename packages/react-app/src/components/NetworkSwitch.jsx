import React from "react";
import { Dropdown, Menu, Button } from "antd";
import { useLocation } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

function NetworkSwitch({
  networkOptions,
  selectedNetwork,
  setSelectedNetwork,
}) {
  const location = useLocation();
  const history = useHistory();

  const handleClick = (i, evt) => {
    console.log('location: ', location);
    if(location.pathname && location.pathname.indexOf('/auction2/') == 0){
      console.log('network was changed while we are showing an auction');
      history.push('/');
    }
    setSelectedNetwork(i);
  };

  const menu = (
    <Menu>
      {networkOptions
        .filter(i => i !== selectedNetwork)
        .map(i => (
          <Menu.Item key={i}>
            <Button type="text" onClick={handleClick.bind(this, i)}>
              <span style={{ textTransform: "capitalize" }}>{i}</span>
            </Button>
          </Menu.Item>
        ))}
    </Menu>
  );

  return (
    <div>
      <Dropdown.Button overlay={menu} placement="topRight" trigger={["click"]}>
        <span style={{ textTransform: "capitalize" }}>{selectedNetwork}</span>
      </Dropdown.Button>
    </div>
  );
}

export default NetworkSwitch;
