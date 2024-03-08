const path = require("path");
const fs = require("fs");
const solc = require("solc");

const inboxPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(inboxPath, "utf8");

const input = {
  language: "Solidity",
  sources: { main: { content: source } },
  settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
};

const output = solc.compile(JSON.stringify(input));
//console.log(output);
//console.log("hello");
const artifact = JSON.parse(output).contracts.main["Lottery"];

//console.log(artifact);
module.exports = {
  abi: artifact.abi,
  bytecode: artifact.evm.bytecode.object,
};
