import { Collapse } from "antd";
import React from "react";
const { Panel } = Collapse;

export default function Account(props) {
    
    const faq = (
        <>
            <section id="faq" class="faq">
                <div class="container" data-aos="fade-up">
                    <div class="section-title">
                        <h2>Frequently Asked Questions</h2>
                        <p>
                        NFT Deals is an experimental and pioneering implementation of our novel auction format. Our goal is to routinely sell the most premium NFTs at 30-90% off the prevailing floor price. In time, we aim to decentralize our protocol so that it is governed by a DAO that empowers even the smallest entrepreneurs to benefit from NFT sales.
                        </p>
                    </div>

                    <div class="faq-list">

                        <Collapse bordered={false} defaultActiveKey={['1']}>
                            <Panel header="This looks too good to be true. What’s the catch?" key="1">
                                <p>There is no catch! The massive discount against a collection’s floor price is possible because we operate a novel auction format where you pay-to-bid and bid-to-earn.
                                </p>
                            </Panel>
                            <Panel header="What if there are not many bids?" key="2">
                                <p>
                                    Then the buyer gets an incredible deal! There’s no reserve on this auction.
                                </p>
                            </Panel>
                            <Panel header="Should I bid now or wait until this auction gets closer to the collection’s floor price?" key="3">
                                <p>
                                    We leave that up to you!  On the one hand, bidding early feels like you will be outbid by others who surely want this NFT. On the other hand, if everyone thinks like that, then people may decide to wait – giving you the win. This tension is what makes our auctions so entertaining!
                                </p>
                            </Panel>
                            <Panel header="Why does the timer reset 24 hours after every bid?" key="4">
                                <p>
                                    Anything less than a 24 hour extension feels like we are excluding some part of the world. Not cool. Here, the whole world gets a fair chance to bid. Plus, there’s no advantage to waiting until the last few minutes if you know that your bid will extend the auction.
                                </p>
                            </Panel>
                            <Panel header="What is “Next Bid”?" key="5">
                                <p>
                                    This amount represents the price should you bid in the auction. Unlike other auction models, where you determine your desired price, this auction automatically calculates the next possible bid.
                                </p>
                            </Panel>                        
                            <Panel header="What is “Pay to Bid”?" key="6">
                                <p>
                                If you are outbid, you are refunded 90% of your bid. In other words, there’s a small fee to participate in this auction.
                                </p>
                            </Panel>
                            <Panel header="I’m the top bidder. What happens if I get outbid?" key="7">
                                <p>
                                    Ninety percent (90%) of your bid is auto-refunded, and you can bid again if you would like to win the auction.
                                </p>
                            </Panel>
                            <Panel header="What is “Bid-to-Earn?”" key="8">
                                <p>
                                    You earn rewards whenever you bid – even if you’re outbid.
                                </p>
                            </Panel>
                            <Panel header="What are the rewards?" key="9">
                                <p>
                                    Rewards are a sum of points associated to your wallet that are accumulated based on your activity, such as bidding. Later, those rewards will be convertible into our $NFTD token when it launches.
                                </p>
                            </Panel>
                            <Panel header="Do you have a whitepaper on the tokenomics?" key="10">
                                <p>
                                    Not yet, but we are working on it. Currently, we anticipate that the reward-to-token conversion rate will be proportional the amount of the community’s share in the initial token distribution. Eventually, the value of the $NFTD token will be backed by the auction house’s revenue.
                                </p>
                            </Panel>
                            <Panel header="How do I know if I have been outbid?" key="11">
                                <p>
                                   For the time being, the safest thing is to come back and check if you have been outbid. That said, we are quickly working toward a notification feature. Join us on Discord and let us know if you prefer a Twitter bot, browser notifications, a browser extension, a Discord bot, or plain ole email to stay on top of the auction.
                                </p>
                            </Panel>                        
                            <Panel header="How can I trust that this is a legitimate auction? Are you really holding a premium NFT?" key="12">
                                <p>
                                    Good question. Trust no one and inspect the smart contract! Please navigate to EtherScan and verify that this auction has the identified NFT escrowed in the contract. It’s there 🤑
                                </p>
                            </Panel>
                            <Panel header="What about gas fees?" key="13">
                                <p>
                                    At the early stages of an auction, the top bid may be less than the amount of gas required to process the transaction. But, still, the total amount paid (bid + gas fees) will still be a fantastic deal on an NFT that you win here.
                                </p>
                            </Panel>
                            <Panel header="Is there a reserve price?" key="14">
                                <p>
                                    Nope. If the timer runs out at any amount, the auction will close and the winner can claim the NFT.
                                </p>
                            </Panel>
                            <Panel header="When does the auction end? Will it run forever?" key="15">
                                <p>
                                    It is theoretically possible for the auction to extend for a while if people continue bidding. But that would be economically irrational at some point. We expect most auctions will settle at significant discounts against the collection’s floor price.
                                </p>
                            </Panel>
                            <Panel header="Was a security audit performed for this project?" key="16">
                                <p>
                                    Not yet, but it’s on the roadmap. Consider this application experimental. Use at your own risk and for entertainment purposes only. In general, using crypto applications, wallets, protocols, and tools may expose you to risks including, but not limited to, smart contract bugs, systemic risk, flashloan attacks, economic incentive failures, liquidity crises, admin key exploits, governance exploits, and pegged assets such as stablecoins or tokenized BTC de-pegging.
                                </p>
                            </Panel>
                            <Panel header="Can I see who else is participating in this auction?" key="17">
                                <p>
                                    Yes, click on “Bid History” to see what other wallets have participated in this auction so far.
                                </p>
                            </Panel>                        
                            <Panel header="Won’t the bots just beat me?" key="18">
                                <p>
                                    We don’t think so, but we cannot control if others develop bots to play along. That said, we designed the smart contracts in such a way that disincentivizes bots. For instance, the resetting timer makes it less attractive for bots to snipe the auction in the final moments. Moreover, the pay-to-bid model creates significant disadvantages for bots that rely on constantly outbidding others.
                                </p>
                            </Panel>
                            <Panel header="What is wETH and why use that instead of ETH for the auction?" key="19">
                                <p>
                                    wETH stands for "wrapped Ether.” It is a cryptocurrency used to make bids for digital goods on this and many other sites. There is a 1:1 exchange between wETH and ETH, so you can always convert it back and forth. We use wETH because ETH is not an ERC-20 token, which makes auto-refunding and other functions difficult or gas-heavy.
                                </p>
                            </Panel>
                            <Panel header="Why do I have to perform two steps to submit my first bid?" key="20">
                                <p>
                                    The first time you bid, you will need to approve NFT Deals to access your wETH. You only need to approve this once. After that, you can simply click on the “Bid” button to execute your transaction.
                                </p>
                            </Panel>
                            <Panel header="Where can I see other auctions on your site?" key="21">
                                <p>
                                    There may not be other auctions right now. Rather than a sprawling marketplace with hundreds of items for sale, we focus on a highly curated set of premium NFTs.
                                </p>
                            </Panel>
                            <Panel header="Are there other ways to earn rewards?" key="22">
                                <p>
                                    Yes. We’re always looking to connect with NFT influencers. Find our mods on Discord and request a special mission.
                                </p>
                            </Panel>
                            <Panel header="I’m an NFT seller and I want to sell my NFT with you. What do I do?" key="23">
                                <p>
                                    Find us on Discord and tell us more about your NFT. We’re primarily focused on blue chip NFTs that have high trading volume and price floors. Additionally, we’re only working with sellers who have significant Twitter followers.
                                </p>
                            </Panel>                        
                        </Collapse>
                    </div>
                </div>
            </section>
        </>
    );
  
    return (
      <div>
        {faq}
      </div>
    );
  }



