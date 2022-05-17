import { Button, Col, Input, Menu, Row, Tabs } from "antd";

import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation, Redirect } from "react-router-dom";
import "./App.css";
import {
  Account,
  Contract,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  FaucetHint,
  NetworkSwitch,
  TopNavMenu,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import {
  Home,
  ExampleUI,
  Hints,
  Subgraph,
  BestNFT,
  WETH,
  AuctionFactory,
  Auction,
  AuctionList,
  Foo,
} from "./views";
import { useStaticJsonRPC } from "./hooks";

import logo from "./img/NFTD_Logo_2.png";

import TagManager from "react-gtm-module";

import "./vendor/bootstrap/css/bootstrap.css";
import "./vendor/icofont/icofont.min.css";
import "./css/style.css";
import Auction2 from "./views/Auction2";
import Auctions from "./views/Auctions";
import FaucetAndInfo from "./components/FaucetAndInfo";
import AccountAndOthers from "./components/AccountAndOthers";

import LogRocket from "logrocket";
import axios from "axios";
import { usePing } from "./hooks";

import { CurrencyProvider } from "./contexts/CurrencySymbolContext";

/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Alchemy.com & Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

const { ethers } = require("ethers");
LogRocket.init("frc24s/nftdealsxyz");

/// 📡 What chain are your contracts deployed to?
console.log(
  "***process.env.REACT_APP_INITIAL_NETWORK: ",
  process.env.REACT_APP_INITIAL_NETWORK,
);
const initialNetwork = NETWORKS[process.env.REACT_APP_INITIAL_NETWORK]; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;
// equal comparison because we boolean & .env has string
const USE_BURNER_WALLET = process.env.REACT_APP_USE_BURNER_WALLET === "true"; // toggle burner wallet feature
console.log("*** USE_BURNER_WALLET", USE_BURNER_WALLET);
const USE_NETWORK_SELECTOR = true;

const web3Modal = Web3ModalSetup();

// 🛰 mainnet providers, for ens, price, balance, other lookups, etc.
const providers = [
  // "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  // "https://rpc.scaffoldeth.io:48544",
];

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [
    ...new Set([initialNetwork.name, "mainnet", "rinkeby", "localhost"]),
  ];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState(ethers.constants.AddressZero);
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER
      ? process.env.REACT_APP_PROVIDER
      : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (
      injectedProvider &&
      injectedProvider.provider &&
      typeof injectedProvider.provider.disconnect == "function"
    ) {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(
    injectedProvider,
    localProvider,
    USE_BURNER_WALLET,
  );
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    TagManager.initialize({ gtmId: "GTM-MZZ2743" });
  }, [TagManager]);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId =
    localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner &&
    userSigner.provider &&
    userSigner.provider._network &&
    userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = {
    deployedContracts: deployedContracts || {},
    externalContracts: externalContracts || {},
  };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(
    userSigner,
    contractConfig,
    localChainId,
  );

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  // useOnBlock(mainnetProvider, () => {
  //   console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  // });

  // Then read your DAI balance like:
  // const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
  //   "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  // ]);

  // keep track of a variable from the contract in the local React state:
  // const purpose = useContractReader(readContracts, "YourContract", "purpose");
  // const wethBalance = useContractReader(readContracts, "WETH", "balanceOf", [address]);
  // console.log('*** WETH', wethBalance && wethBalance.toString(), ' at :', address)
  /*YourContract
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log(
        "_____________________________________ 🏗 scaffold-eth _____________________________________",
      );
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log(
        "💵 yourLocalBalance",
        yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...",
      );
      console.log(
        "💵 yourMainnetBalance",
        yourMainnetBalance
          ? ethers.utils.formatEther(yourMainnetBalance)
          : "...",
      );
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      // console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
    localChainId,
  ]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const { TabPane } = Tabs;

  const [auctionContract, setAuctionContract] = useState("");

  const handleAuctionAddressChange = auctionAddress => {
    if (!auctionAddress || !ethers.utils.isAddress(auctionAddress)) {
      setAuctionContract("");
      return;
    }
    try {
      if (readContracts && readContracts.Auction) {
        const auctionContract = new ethers.Contract(
          auctionAddress,
          readContracts.Auction.interface.format(ethers.utils.FormatTypes.full),
          userSigner,
        );
        setAuctionContract(auctionContract);
      }
    } catch (e) {
      console.log("*** handled it", e);
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (LogRocket && address !== ethers.constants.AddressZero) {
      LogRocket.identify(address, {});
    }
  }, [LogRocket, address]);

  usePing(address);

  const [isPlaying, setIsPlaying] = useState(false);

  const animateIt = () => {
    setIsPlaying(true);
    window.setTimeout(() => {
      setIsPlaying(false);
    }, 500);
  };

  return (
    <CurrencyProvider>
      <Switch>
        <Route exact path="/">
          <Redirect to={"auctions"} />
        </Route>
        <Route exact path="/auction2/:slug">
          <Auction2
            NETWORKCHECK={NETWORKCHECK}
            localChainId={localChainId}
            selectedChainId={selectedChainId}
            targetNetwork={targetNetwork}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
            useBurner={USE_BURNER_WALLET}
            address={address}
            localProvider={localProvider}
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            price={price}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            blockExplorer={blockExplorer}
            readContracts={readContracts}
            writeContracts={writeContracts}
            networkOptions={networkOptions}
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
            USE_BURNER_WALLET={USE_BURNER_WALLET}
            yourLocalBalance={yourLocalBalance}
            tx={tx}
            isPlaying={isPlaying}
            animateIt={animateIt}
          />
        </Route>
        <Route exact path="/auctions/">
          <Auctions
            NETWORKCHECK={NETWORKCHECK}
            localChainId={localChainId}
            selectedChainId={selectedChainId}
            targetNetwork={targetNetwork}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
            useBurner={USE_BURNER_WALLET}
            address={address}
            localProvider={localProvider}
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            price={price}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            blockExplorer={blockExplorer}
            readContracts={readContracts}
            writeContracts={writeContracts}
            networkOptions={networkOptions}
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
            USE_BURNER_WALLET={USE_BURNER_WALLET}
            yourLocalBalance={yourLocalBalance}
            tx={tx}
          />
        </Route>
        <Route>
          <div className="App">
            <Header />
            <Switch>
              <Route exact path="/">
                <Redirect to={"debug"} />
              </Route>
              <Route exact path="/BestNft">
                <BestNFT
                  address={address}
                  userSigner={userSigner}
                  mainnetProvider={mainnetProvider}
                  localProvider={localProvider}
                  yourLocalBalance={yourLocalBalance}
                  price={price}
                  tx={tx}
                  writeContracts={writeContracts}
                  readContracts={readContracts}
                />
              </Route>
              <Route exact path="/WETH">
                <WETH
                  address={address}
                  userSigner={userSigner}
                  mainnetProvider={mainnetProvider}
                  localProvider={localProvider}
                  yourLocalBalance={yourLocalBalance}
                  price={price}
                  tx={tx}
                  writeContracts={writeContracts}
                  readContracts={readContracts}
                />
              </Route>
              <Route exact path="/AuctionFactory">
                <AuctionFactory
                  address={address}
                  userSigner={userSigner}
                  mainnetProvider={mainnetProvider}
                  localProvider={localProvider}
                  yourLocalBalance={yourLocalBalance}
                  price={price}
                  tx={tx}
                  writeContracts={writeContracts}
                  readContracts={readContracts}
                  blockExplorer={blockExplorer}
                />
              </Route>
              <Route exact path="/Auction/:slug">
                <Auction
                  address={address}
                  userSigner={userSigner}
                  mainnetProvider={mainnetProvider}
                  localProvider={localProvider}
                  yourLocalBalance={yourLocalBalance}
                  price={price}
                  tx={tx}
                  writeContracts={writeContracts}
                  readContracts={readContracts}
                  blockExplorer={blockExplorer}
                />
              </Route>
              <Route exact path="/AuctionList">
                <AuctionList
                  address={address}
                  userSigner={userSigner}
                  mainnetProvider={mainnetProvider}
                  localProvider={localProvider}
                  yourLocalBalance={yourLocalBalance}
                  price={price}
                  tx={tx}
                  writeContracts={writeContracts}
                  readContracts={readContracts}
                  blockExplorer={blockExplorer}
                />
              </Route>
              <Route exact path="/debug">
                <>
                  <TopNavMenu location={location} />
                  <Tabs defaultActiveKey="1" centered>
                    <TabPane tab="Auction" key="1">
                      <Input
                        placeholder={"an auction address"}
                        onChange={e =>
                          handleAuctionAddressChange(e.target.value)
                        }
                        style={{ width: 400 }}
                      />
                      <Contract
                        customContract={auctionContract}
                        name="Auction"
                        price={price}
                        signer={userSigner}
                        provider={localProvider}
                        address={address}
                        blockExplorer={blockExplorer}
                        contractConfig={contractConfig}
                        readContracts={readContracts}
                      />
                    </TabPane>
                    <TabPane tab="Auction Factory" key="2">
                      <Contract
                        name="AuctionFactory"
                        price={price}
                        signer={userSigner}
                        provider={localProvider}
                        address={address}
                        blockExplorer={blockExplorer}
                        contractConfig={contractConfig}
                      />
                    </TabPane>
                    <TabPane tab="BestNft" key="3">
                      <Contract
                        name="BestNft"
                        price={price}
                        signer={userSigner}
                        provider={localProvider}
                        address={address}
                        blockExplorer={blockExplorer}
                        contractConfig={contractConfig}
                      />
                    </TabPane>
                    <TabPane tab="WETH" key="4">
                      <Contract
                        name="WETH"
                        price={price}
                        signer={userSigner}
                        provider={localProvider}
                        address={address}
                        blockExplorer={blockExplorer}
                        contractConfig={contractConfig}
                        customContract={readContracts && readContracts.WETH}
                      />
                    </TabPane>
                    <TabPane tab="Reward" key="5">
                      <Contract
                        name="Reward"
                        price={price}
                        signer={userSigner}
                        provider={localProvider}
                        address={address}
                        blockExplorer={blockExplorer}
                        contractConfig={contractConfig}
                      />
                    </TabPane>
                    <TabPane tab="YourContract" key="6">
                      <Contract
                        name="YourContract"
                        price={price}
                        signer={userSigner}
                        provider={localProvider}
                        address={address}
                        blockExplorer={blockExplorer}
                        contractConfig={contractConfig}
                      />
                    </TabPane>
                  </Tabs>
                </>
              </Route>
              <Route path="/hints">
                <Hints
                  address={address}
                  yourLocalBalance={yourLocalBalance}
                  mainnetProvider={mainnetProvider}
                  price={price}
                />
              </Route>
              <Route path="/exampleui">
                <ExampleUI
                  address={address}
                  userSigner={userSigner}
                  mainnetProvider={mainnetProvider}
                  localProvider={localProvider}
                  yourLocalBalance={yourLocalBalance}
                  price={price}
                  tx={tx}
                  writeContracts={writeContracts}
                  readContracts={readContracts}
                />
              </Route>
              <Route path="/mainnetdai">
                <Contract
                  name="DAI"
                  customContract={
                    mainnetContracts &&
                    mainnetContracts.contracts &&
                    mainnetContracts.contracts.DAI
                  }
                  signer={userSigner}
                  provider={mainnetProvider}
                  address={address}
                  blockExplorer="https://etherscan.io/"
                  contractConfig={contractConfig}
                  chainId={1}
                />
              </Route>
              <Route path="/subgraph">
                <Subgraph
                  subgraphUri={props.subgraphUri}
                  tx={tx}
                  writeContracts={writeContracts}
                  mainnetProvider={mainnetProvider}
                />
              </Route>
              <Route path="/foo/:slug">
                <Foo
                  NETWORKCHECK={NETWORKCHECK}
                  localChainId={localChainId}
                  selectedChainId={selectedChainId}
                  targetNetwork={targetNetwork}
                  logoutOfWeb3Modal={logoutOfWeb3Modal}
                  USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
                  useBurner={USE_BURNER_WALLET}
                  address={address}
                  localProvider={localProvider}
                  userSigner={userSigner}
                  mainnetProvider={mainnetProvider}
                  price={price}
                  web3Modal={web3Modal}
                  loadWeb3Modal={loadWeb3Modal}
                  logoutOfWeb3Modal={logoutOfWeb3Modal}
                  blockExplorer={blockExplorer}
                  readContracts={readContracts}
                  writeContracts={writeContracts}
                  networkOptions={networkOptions}
                  selectedNetwork={selectedNetwork}
                  setSelectedNetwork={setSelectedNetwork}
                  USE_BURNER_WALLET={USE_BURNER_WALLET}
                  yourLocalBalance={yourLocalBalance}
                  tx={tx}
                />
              </Route>
            </Switch>

            {/*<ThemeSwitch />*/}

            <NetworkDisplay
              NETWORKCHECK={NETWORKCHECK}
              localChainId={localChainId}
              selectedChainId={selectedChainId}
              targetNetwork={targetNetwork}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
            />

            <AccountAndOthers
              useBurner={USE_BURNER_WALLET}
              address={address}
              localProvider={localProvider}
              userSigner={userSigner}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
              readContracts={readContracts}
              USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
              networkOptions={networkOptions}
              selectedNetwork={selectedNetwork}
              setSelectedNetwork={setSelectedNetwork}
              USE_BURNER_WALLET={USE_BURNER_WALLET}
              yourLocalBalance={yourLocalBalance}
              targetNetwork={targetNetwork}
            />

            <FaucetAndInfo
              price={price}
              address={address}
              gasPrice={gasPrice}
              localProvider={localProvider}
              targetNetwork={targetNetwork}
              mainnetProvider={mainnetProvider}
            />
          </div>
        </Route>
      </Switch>
    </CurrencyProvider>
  );
}

export default App;
