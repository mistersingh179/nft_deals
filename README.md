# startup

```
yarn deploy --watch
yarn chain
yarn start
yarn build
yarn deploy
yarn deploy --network rinkeby
yarn verify --network rinkeby
cd packages/hardhat
npx hardhat --network rinkeby etherscan-verify
chokidar "**/*.js, **/*.sol" -c "yarn test"
yarn deploy --network rinkeby --gasprice 28000000000
```

# questions
- for reads, should we inject our provider or use what customer brings in from their wallet

# notes
- there is no servie worker here, and we are using direct urls to nested routes. since no server to redirect to index.html we host `200.html` and that is rendered by `surge.sh`, but urls in `index.html` are relative due to `"homepage": "."` in `package.json`, which means a nested route will give `200.html` which will have realative paths to load javascript assets and fail. one way to solve it is to remove nested urls and the index.html will load from `/`. other way is redirect all unknown urls to `index.html`.
https://create-react-app.dev/docs/deployment#serving-apps-with-client-side-routing

# faq

## why so many infura calls?

- if `REACT_APP_PROVIDER` is present, we will use that as our local provider. we had this set to infura rinkeby and that is what was being used. so I have removed the variable from `.env`. now it will pick up provider from constants.js `NETWORK` object. and this is selected from the switch. so our switch will now decide what provider url is. 
- in development, we may optionally have `REACT_APP_PROVIDER` setup to always go to one url, as with this setup, then network switch is not selecting the injected url. going to leave this out for now to avoid confusion.
  
## what is alchemy doing here?

- we are using it for `mainnet` provider in app.jsx
- we are also using it for `mainnet` in web3ModalSetup

## how do i add/install a package?

- from root directory use yarn to add package in the workspace you so desire
- it should update the yarn.lock at the root level
- it should update package.json at the workspace level
- there should **not** be any package-lock.json
- e.g. `yarn workspace @scaffold-eth/react-app add react-canvas-confetti`
- for dev purposes `yarn workspace @scaffold-eth/hardhat add --dev solidity-coverage`

## how do i deploy?

- For FE do `yarn build-and-surge`
- For BE do `yarn deploy --network rinkeby`
- Note BE deployments require having a deployer account. 
- Preferred to use same company deployer account so  it is easier to track stuff.

## documentation

- contracts use natspec to document themselves
- `hh docgen` to produce docs
- then `npx serve` to browser them.

## running out memory?
- increase heap space for node
- `NODE_OPTIONS=--max_old_space_size=12288`
- this should always be less than total machine space
- also give hardhat more space
- `HARDHAT_MAX_MEMORY=12288`
- best to do this in your `.zshrc` profile.

## get wrong block.timestamp?
- hardhat maybe set to mine only where there is a transaction
- create empty transaction to move block.timestamp forward

## removed a contract, and it still shows up in contracts.json
- `yarn clean`
- `yarn deploy --reset`
- this is per network.

## contract changes not showing up in the front end?
- front end maybe referring to old contracts
- first `yarn deploy --network rinkeby`
- this updates `react-app/src/contracts/hardhat_cotnracts.json`
- then commit & push the front end app
- now wait for cloudfront to finish building front end

## how to run tests?
- `yarn test`
- to see events & calls being made `yarn test --trace`
- to make it autorun on change `chokidar "**/*.js, **/*.sol" -c "yarn test"`

## how to use a auction created during deployment for real auction
- use admin & tell auctionFactory about it[auction], this will make it show up
- use its[acution's] nftOwner also the deployer account and update details of auction
- note: details can be updated only before it has started
- now start the auction

## contract is not verified by etherscan even though it is similar to verified contract?
- verify manually
- create `params.js` in `hardhat` package folder
- have file export an array of params, but addresses as strings
- run `yarn verify --network rinkeby --constructor-args params.js 0x02cf585277B3324Df90cBE0e2bD3e540a8eca2E3`
- here the positional argument is the contracts address we are verifying
- documentation of plugin here `https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html`

## what accounts am i using and do i have money in them?
- `yarn accounts` will show the 20 accounts we are getting.
- these are from mnemonic, also in code by `provider.getSigners()` etc.
- `yarn account` will give first account which is deployer account with balances on each network.

## how to verify on tenderly
- it doesnt need params, just code
- `npx hardhat --network mainnet tenderly:verify Auction=0xf2c50dA3C1462873d8604a2E9Dc92FcC6f80924a`
- above will verify that address on that network and give url
- we can click url and add to our project and then debug transacations & setup alerts
- all commands from hardhat folder
