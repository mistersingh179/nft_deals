pragma solidity ^0.8.13;
// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BestNft is ERC721PresetMinterPauserAutoId {
    constructor() ERC721PresetMinterPauserAutoId("BoredApeYachtClub", "BAYC", "http://"){ }
    using Strings for uint;
    using Counters for Counters.Counter;
    Counters.Counter public tokenIdTracker;

    string[] public image_urls = [
        'https://cdn.lifestyleasia.com/wp-content/uploads/sites/2/2022/01/14164042/ape-007.jpeg',
        'https://www.ledgerinsights.com/wp-content/uploads/2021/12/adidas-nft-bored-ape-810x524.jpg',
        'https://cryptopotato.com/wp-content/uploads/2022/01/img5_bayc.jpg',
        'https://miro.medium.com/max/319/1*39_OwfoRHASp1f1YgZgJJA.png',
        'https://openingrealm.b-cdn.net/wp-content/uploads/2021/11/BAYC-PFP-2-1024x1024.png',
        'https://itsblockchain.com/wp-content/uploads/2021/08/https___bucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com_public_images_52d339b8-5254-4182-b519-2c404df70dd1_609x462-1.jpeg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUpqEDxbfPr5DM3LKSBvSFiGuLuykYa61oOj4hTSIPnWTuxiN6hhQIw-8bZCibYfXw72g&usqp=CAU',
        'https://cdn.coingape.com/wp-content/uploads/2022/03/17194826/unnamed-122.png'
    ];

    // https://docs.opensea.io/docs/metadata-standards
    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory image_url = image_urls[tokenId % image_urls.length];
        string memory json = Base64.encode(
          bytes(
              string(
                  abi.encodePacked(
                      '{"name": "BoredApeYachtClub", "description": "for testing", "image": "', image_url, '"}'
                  )
              )
          )
        );
        return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function mint(address to) public override {
        _mint(to, tokenIdTracker.current());
        tokenIdTracker.increment();
    }
}