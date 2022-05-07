const nftNameFixer = name => {
  if (name && (name === "BoredApeYachtClub")) {
    return "Bored Ape Yacht Club";
  } else {
    return name;
  }
};

export default nftNameFixer;