// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Lottery{

    address [] public accounts ;
    address public manager;
    address public lastWinner;

    constructor(){
        manager = msg.sender;
    }

    modifier restricted(){
         require(manager == msg.sender);
         _;
    }
    function enter() public payable{
        require(msg.value > 0.009 ether);
        accounts.push(msg.sender);
    }   

    function pickWinner() public restricted{
        uint index = generateRandomNumber();
        address winner = accounts[index];

        // winner.transfer(getContractBalance()); --old way of handling no more operational since Dec 2019

        (bool sent, ) = winner.call{value: getContractBalance()}("");
        require(sent, "Failed to send Ether");

        lastWinner = winner;
        accounts = new address[](0);
    }

    function getAccounts() public view returns (address[] memory){
        return accounts;
    }

    function getContractBalance() public view returns (uint){
        return address(this).balance;
    }

    function generateRandomNumber() public view returns (uint){
         return uint(keccak256(abi.encodePacked(block.timestamp, accounts))) % accounts.length;
    }
}