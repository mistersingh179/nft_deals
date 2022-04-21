import {ethers} from "ethers";

export const displayWeiAsEther = (wei, decimals) => {
  try{
    if(decimals == undefined){
      decimals = 4
    }
    return ethers.utils.commify(parseFloat(ethers.utils.formatEther(wei)).toFixed(decimals))
  }catch(e){
    return 0
  }
}

