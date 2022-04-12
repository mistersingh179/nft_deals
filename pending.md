- env variable to complete shift between local, rinkeby & mainnet, had to take our react env
- metamask chain error Internal JSON-RPC error.
- occasionally getting out of gas error from metamask
- make platform fee match lister fee
- make platform fee have floor
- make custom method to override pltform fee
- disable buttons while waiting for tx
- previous bids with address & amount & tx id
- countdown timer

ERC20
reward

# Must 
- deploy env
- read values without metamask 
- message that metamask is not connected

# best practice
- pause (circuit breaker)
- suspend ( circuit breaker)
- put limits ( how much money can go in and how fast etc. )
  - should we be required to make withdraws, and if withdraws missing  then it limits
  - does it require a pulse from us to stay active or it limits
- upgrade & bug fix strategy
- modularize
- rollout? 
  - limit users 
  - limit award
  - increase slowly
- external contract calls
  - we only do this when refunding money & that is pull based.
- use check-effect-interact pattern, need to double check everywhere for it.


# Auction Factory
- get stats from auctionFactory and show on front end
- take care of constants in auctionFactory
- auctionFactory storage of auctions
- show past auctions in front end with link to auction page
- give tokens per block
- verify that they do have that nft
- after created, do something, so they know it is done.
- pass in env and load variables via library accordingly

# Auction Listing
- start it
- show contract value

# UI
- code for various formats of tokenURI

# NFT
- different images
- what happens when it dissapers

# Auction
- used wrapped eth
- auto refund
- only factory can create it
- only ownerS can make refund
- show bid events
- show previous loosers
- calculate next amount using BigInt
- show claimed
- update all numbers on every block
- claim nft, only when we have nft
- suspension, pausing, etc.


- splash modal, select rinkeby
