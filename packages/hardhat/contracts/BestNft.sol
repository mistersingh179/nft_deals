pragma solidity ^0.8.13;
// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BestNft is ERC721PresetMinterPauserAutoId {
    constructor() ERC721PresetMinterPauserAutoId("Best NFT", "BN", "http://"){ }
    using Strings for uint;
    using Counters for Counters.Counter;
    Counters.Counter public tokenIdTracker;

    function image_url(uint tokenId) private view returns (string memory) {
        return "https://cdn.lifestyleasia.com/wp-content/uploads/sites/2/2022/01/14164042/ape-007.jpeg";
    }

    // https://docs.opensea.io/docs/metadata-standards
    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory json = Base64.encode(
          bytes(
              string(
                  abi.encodePacked(
                      '{"name": "Best NFT", "description": "for testing", "image": "', image_url(tokenId), '"}'
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