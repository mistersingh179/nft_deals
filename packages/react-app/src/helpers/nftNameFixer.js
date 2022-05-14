import { displayNameMappings } from "../constants";

const nftNameFixer = name => {
  if (name && displayNameMappings[name]) {
    return displayNameMappings[name];
  } else {
    return name;
  }
};

export default nftNameFixer;
