# startup

```
yarn deploy --watch
yarn chain
yarn start
yarn build
yarn deploy
yarn deploy --network rinkeby
yarn verify --network rinkeby
```

# questions

- pattern to store abi of external contracts in react-app
- how to check if external contract supports a method, e.g. enumerable interface

# notes
- there is no servie worker here, and we are using direct urls to nested routes. since no server to redirect to index.html we host `200.html` and that is rendered by `surge.sh`, but urls in `index.html` are relative due to `"homepage": "."` in `package.json`, which means a nested route will give `200.html` which will have realative paths to load javascript assets and fail. one way to solve it is to remove nested urls and the index.html will load from `/`. other way is redirect all unknown urls to `index.html`.
https://create-react-app.dev/docs/deployment#serving-apps-with-client-side-routing
- 