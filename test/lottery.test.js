const assert = require("assert");
const { Web3 } = require("web3");
const ganache = require("ganache");
const { abi, bytecode } = require("../compile");

//deploy, test

const web3 = new Web3(ganache.provider());
let accounts;
let contract;
let manager;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  contract = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
  manager = await contract.methods.manager().call();
  console.log("Accounts available", accounts);
});

describe("lottery tests", () => {
  it("is lottery deployed", async () => {
    assert(contract.options.address);
    assert.equal(manager, accounts[0]);
  });

  it("test entering lottery contest", async () => {
    await contract.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("0.02", "ether") });
    const playeraccounts = await contract.methods.getAccounts().call();
    assert.equal(playeraccounts.length, 1);
  });

  it("test picking a winner - called by manager", async () => {
    await contract.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("0.02", "ether") });
    await contract.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei("0.02", "ether") });

    let playeraccounts = await contract.methods.getAccounts().call();
    assert.equal(playeraccounts.length, 2);

    await contract.methods.pickWinner().send({ from: accounts[0] });
    playeraccounts = await contract.methods.getAccounts().call();
  });

  it("test picking a winner - called not by manager", async () => {
    await contract.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("0.02", "ether") });

    try {
      await contract.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (e) {}
  });
});
