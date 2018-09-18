const CryptoJS = require("crypto-js");

class Block {
  constructor(index, hash, previousHash, timestamp, data){
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }
};

const genesisBlock = new Block(
  0,
  "5991F4FC1BEC058441306BB6182130918917235BD24B2D1616327C3AC8AD7166",
  null,
  1537182061778,
  "this is genesis block!"
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length - 1];
const getTimestamp = () => new Date().getTime() / 1000;
const createHash = (index, previousHash, timestamp, data) => {
  return CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString();
}

const createNewBlock = data => {
  const previousBlock = getLastBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimestamp = getTimestamp();
  const newHash = createHash(newBlockIndex, previousBlock.hash, newTimestamp, data);
  const newBlock = new Block(
    newBlockIndex,
    newHash,
    previousBlock.hash,
    newTimestamp,
    data
  );
  return newBlock;
};

const getBlockHash = block => {
  return createHash(block.index, block.previousHash, block.timestamp, block.data);
};

const isNewStructureValid = block => {
  return (
    typeof block.index === "number" &&
    typeof block.hash === "string" &&
    typeof block.previousHash === "string" &&
    typeof block.timestamp === "number" &&
    typeof block.data === "string"
  );
};

const isNewBlockValid = (candidateBlock, latestBlock) => {
  if(!isNewStructureValid(candidateBlock)){
    console.log("The candidate block structure is not valid");
    return false;
  } else if(latestBlock.index + 1 !== candidateBlock.index){
    console.log("The candidate block don't have a valid index")
    return false;
  } else if(latestBlock.hash !== candidateBlock.previousHash){
    console.log("The previous of the candidate block is not the hash ofthe latest block");
    return false;
  } else if(getBlockHash(candidateBlock) !== candidateBlock.hash){
    console.log("The hash of this block is invalid");
    return false;
  }
  return true;
};

const isChainValid = candidateChain => {
  const isGenesisValid = block => {
    return JSON.stringify(block) === JSON.stringify(genesisBlock)
  };
  if(!isGenesisValid(candidateChain[0])){
    console.log("The candidateChains's genesisBlock is not the same as our genesisBlock");
    return false;
  };
  for(let i=0;i<candidateChain.length;i++){
    if(!isNewBlockValid(candidateChain[i], candidateChain[i - 1])){
      return false;
    }
  }
  return true;
}
