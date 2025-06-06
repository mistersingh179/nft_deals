// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

// MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = process.env.REACT_APP_ETHER_SCAN_API_KEY_TOKEN;

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = process.env.REACT_APP_BLOCKNATIVE_KEY;

export const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_API_KEY;

export const NETWORKS = {
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "",
    // rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":8545",
    rpcUrl: "http://localhost:8545",
    graphUrl: "http://localhost:8000/subgraphs/name/mistersingh179/foo",
  },
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
    graphUrl: "https://api.thegraph.com/subgraphs/name/mistersingh179/foomainnet\n"
  },
  kovan: {
    name: "kovan",
    color: "#7003DD",
    chainId: 42,
    rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://kovan.etherscan.io/",
    faucet: "https://gitter.im/kovan-testnet/faucet", // https://faucet.kovan.network/
  },
  rinkeby: {
    name: "rinkeby",
    color: "#e0d068",
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: "https://faucet.rinkeby.io/",
    blockExplorer: "https://rinkeby.etherscan.io/",
    graphUrl: "https://api.thegraph.com/subgraphs/name/mistersingh179/foo",
  },
  ropsten: {
    name: "ropsten",
    color: "#F60D09",
    chainId: 3,
    faucet: "https://faucet.ropsten.be/",
    blockExplorer: "https://ropsten.etherscan.io/",
    rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`,
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    chainId: 5,
    faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
  },
  xdai: {
    name: "xdai",
    color: "#48a9a6",
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://dai.poa.network",
    faucet: "https://xdai-faucet.top/",
    blockExplorer: "https://blockscout.com/poa/xdai/",
  },
  polygon: {
    name: "polygon",
    color: "#2bbdf7",
    chainId: 137,
    price: 1,
    gasPrice: 50000000000, // 50 gwei
    rpcUrl: `https://polygon-mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://polygonscan.com/",
    graphUrl: "https://api.thegraph.com/subgraphs/name/mistersingh179/foopolygon",
  },
  mumbai: {
    name: "mumbai",
    color: "#92D9FA",
    chainId: 80001,
    price: 1,
    gasPrice: 50000000000, // 50 gwei
    rpcUrl: `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`,
    faucet: "https://faucet.polygon.technology/",
    blockExplorer: "https://mumbai.polygonscan.com/",
  },
  localOptimismL1: {
    name: "localOptimismL1",
    color: "#f01a37",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":9545",
  },
  localOptimism: {
    name: "localOptimism",
    color: "#f01a37",
    chainId: 420,
    blockExplorer: "",
    rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":8545",
    gasPrice: 0,
  },
  kovanOptimism: {
    name: "kovanOptimism",
    color: "#f01a37",
    chainId: 69,
    blockExplorer: "https://kovan-optimistic.etherscan.io/",
    rpcUrl: `https://kovan.optimism.io`,
    gasPrice: 0,
  },
  optimism: {
    name: "optimism",
    color: "#f01a37",
    chainId: 10,
    blockExplorer: "https://optimistic.etherscan.io/",
    rpcUrl: `https://mainnet.optimism.io`,
  },
  localAvalanche: {
    name: "localAvalanche",
    color: "#666666",
    chainId: 43112,
    blockExplorer: "",
    rpcUrl: `http://localhost:9650/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  fujiAvalanche: {
    name: "fujiAvalanche",
    color: "#666666",
    chainId: 43113,
    blockExplorer: "https://cchain.explorer.avax-test.network/",
    rpcUrl: `https://api.avax-test.network/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  mainnetAvalanche: {
    name: "mainnetAvalanche",
    color: "#666666",
    chainId: 43114,
    blockExplorer: "https://cchain.explorer.avax.network/",
    rpcUrl: `https://api.avax.network/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  testnetHarmony: {
    name: "testnetHarmony",
    color: "#00b0ef",
    chainId: 1666700000,
    blockExplorer: "https://explorer.pops.one/",
    rpcUrl: `https://api.s0.b.hmny.io`,
    gasPrice: 1000000000,
  },
  mainnetHarmony: {
    name: "mainnetHarmony",
    color: "#00b0ef",
    chainId: 1666600000,
    blockExplorer: "https://explorer.harmony.one/",
    rpcUrl: `https://api.harmony.one`,
    gasPrice: 1000000000,
  },
  fantom: {
    name: "fantom",
    color: "#1969ff",
    chainId: 250,
    blockExplorer: "https://ftmscan.com/",
    rpcUrl: `https://rpcapi.fantom.network`,
    gasPrice: 1000000000,
  },
  testnetFantom: {
    name: "testnetFantom",
    color: "#1969ff",
    chainId: 4002,
    blockExplorer: "https://testnet.ftmscan.com/",
    rpcUrl: `https://rpc.testnet.fantom.network`,
    gasPrice: 1000000000,
    faucet: "https://faucet.fantom.network/",
  },
  moonbeam: {
    name: "moonbeam",
    color: "#53CBC9",
    chainId: 1284,
    blockExplorer: "https://moonscan.io",
    rpcUrl: "https://rpc.api.moonbeam.network", 
  },
  moonriver: {
    name: "moonriver",
    color: "#53CBC9",
    chainId: 1285,
    blockExplorer: "https://moonriver.moonscan.io/",
    rpcUrl: "https://rpc.api.moonriver.moonbeam.network",
  },
  moonbaseAlpha: {
    name: "moonbaseAlpha",
    color: "#53CBC9",
    chainId: 1287,
    blockExplorer: "https://moonbase.moonscan.io/",
    rpcUrl: "https://rpc.api.moonbase.moonbeam.network",
    faucet: "https://discord.gg/SZNP8bWHZq",
  },
  moonbeamDevNode: {
    name: "moonbeamDevNode",
    color: "#53CBC9",
    chainId: 1281,
    blockExplorer: "https://moonbeam-explorer.netlify.app/",
    rpcUrl: "http://127.0.0.1:9933",
  }
};

export const NETWORK = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};

export const nftNameOpenSeaMappings = {
  "You": "bff-you",
  "Moonbirds": "proof-moonbirds",
  "MutantApeYachtClub": "mutant-ape-yacht-club",
  "goblintown": "goblintownwtf",
  "Cyberkongz VX": "cyberkongz-vx-polygon",
  "ICE Viking":"decentral-games-ice",
}

export const displayNameMappings = {
  "BoredApeYachtClub": "Bored Ape Yacht Club",
  "MutantApeYachtClub": "Mutant Ape Yacht Club",
  "You": "You by BFF",
  "goblintown": "goblintown.wtf",
  "ICE Viking": "Decentral Games ICE Poker",
}

export const tokenUriToImageUrlMappings = {
  "https://live---metadata-5covpqijaa-uc.a.run.app/metadata/7672": "https://live---metadata-5covpqijaa-uc.a.run.app/images/7672",
  "https://boredapeyachtclub.com/api/mutants/1165": "https://ipfs.io/ipfs/QmZQomF8rRgQ9qX7PL4xRSrJ1d75YwhFaSgi3Ap4WRxZ9h",
  "http://kongz.herokuapp.com/api/metadata-vx/12370": "https://cyberkongz.fra1.cdn.digitaloceanspaces.com/public/12370/12370_preview.jpg",
}

export const chainToName = {
  1: "mainnet",
  4: "rinkeby",
  31337: "localhost",
  80001: "mumbai",
  137: "polygon",
};