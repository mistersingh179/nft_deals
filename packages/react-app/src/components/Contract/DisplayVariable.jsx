import { Button, Col, Divider, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay } from "./utils";

const DisplayVariable = ({ contractFunction, functionInfo, refreshRequired, triggerRefresh, blockExplorer }) => {
  const [variable, setVariable] = useState("");

  const refresh = useCallback(async () => {
    try {
      let funcResponse = await contractFunction();
      if(Array.isArray(funcResponse)){
        console.log('reduced array size to 10 for display')
        funcResponse = funcResponse.slice(0,10)
      }
      setVariable(funcResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setVariable, contractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, contractFunction]);

  return (
    <div>
      <Row>
        <Col
          span={8}
          style={{
            textAlign: "right",
            opacity: 0.333,
            paddingRight: 6,
            fontSize: 24,
          }}
        >
          {functionInfo.name}
        </Col>
        <Col span={14}>
          <h2>{tryToDisplay(variable, false, blockExplorer)}</h2>
        </Col>
        <Col span={2}>
          <h2>
            <Button type="link" onClick={refresh} icon="🔄" />
          </h2>
        </Col>
      </Row>
      <Divider />
    </div>
  );
};

export default DisplayVariable;
