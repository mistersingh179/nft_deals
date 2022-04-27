import {useEffect, useState} from "react";
import {useBlockNumber} from "eth-hooks";
import {useAuctionOptions, useTopNavClass, useAuctionContract} from "../hooks";
import {useParams} from "react-router-dom";
import moment from "moment";

const Foo = (props) => {
  const {NETWORKCHECK, localChainId, selectedChainId, targetNetwork, logoutOfWeb3Modal, USE_NETWORK_SELECTOR} = props
  const {useBurner, address, localProvider, userSigner, mainnetProvider, price, web3Modal,
    loadWeb3Modal, blockExplorer, readContracts, writeContracts,
    networkOptions, selectedNetwork, setSelectedNetwork, USE_BURNER_WALLET, yourLocalBalance, tx} = props

  const { slug: auctionContractAddress } = useParams();

  const auctionContract = useAuctionContract(tx, writeContracts, readContracts, auctionContractAddress, localProvider);
  const blockNumber = useBlockNumber(localProvider);

  useEffect(() => {
    let intervalHandler;
    const repeat = () => {
      console.log('foo - hi');
    }
    console.log('foo - registering')
    intervalHandler = setInterval(repeat, 1000)
    return () => {
      console.log('foo - unregistering')
      window.clearInterval(intervalHandler)
    }
  }, [auctionContract, auctionContractAddress, blockNumber])


  return (
    <>
      <h1> Foo </h1>
    </>
  )
}

export default Foo;