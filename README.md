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
```

# questions

- pattern to store abi of external contracts in react-app
- how to check if external contract supports a method, e.g. enumerable interface
- for reads, should we inject a provider or use what they bring in from their wallet

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

## how do i add a package?

- from root directory use yarn to add package in the workspace you so desire
- it should update the yarn.lock at the root level
- it should update package.json at the workspace level
- there should **not** be any package-lock.json
- e.g. `yarn workspace @scaffold-eth/react-app add react-canvas-confetti`

## how do i deploy?

- For FE do `yarn build-and-surge`
- For BE do `yarn deploy --network rinkeby`
- Note BE deployments require having a deployer account. 
- Preferred to use same company deployer account so  it is easier to track stuff.