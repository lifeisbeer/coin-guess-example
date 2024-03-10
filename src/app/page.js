'use client'

import React, { useState } from 'react';
import { ethers } from "ethers";

const CoinFlipForm = () => {

  const abi = [
    {
      "inputs": [],
      "name": "bet",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "choice",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        }
      ],
      "name": "getHash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        }
      ],
      "name": "makeBet",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "choice",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        }
      ],
      "name": "reveal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "choice",
          "type": "bool"
        }
      ],
      "name": "takeBet",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ];
  const address = "0x6BdD740E0d36885f952Bc3e4568D0799202BCED2";
  const bet = ethers.parseEther('0.01');
  
  // State variables - will be used later
  const [account, setAccount] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null);

  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('No Bet');
  const [selectedOption, setSelectedOption] = useState(0);
  const [password, setPassword] = useState(0);

  // Event handlers - will be used later
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConnect = async () => {
    // Logic to connect to wallet or DApp
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);

        setConnected(true);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const s = await provider.getSigner();
        
        setSigner(s);

        setContract(new ethers.Contract(address, abi, s));

      } catch (err) {
        console.log(err);
      }
    } else {
      setConnected(false);
    }
  };

  const handleMakeBet = async () => {
    // Logic to make a bet
    try {
      if (!password) {
        alert('Please add a password to make a bet');
        return;
      }
      
      const hash = await contract.getHash(selectedOption, password);
      console.log(hash);
      // "0xfa58b71a6fb66fb38c35354e640506789c3a5ca0c9abe3bb29fa65504a39d89c"
      const tx = await contract.makeBet(hash, { value: bet });
      await tx.wait();
  
      // console.log(ethers.solidityPackedKeccak256(['bool', 'uint256'], [selectedOption, password]));
      // const tx = await contract.makeBet(contract.getHash(selectedOption, password), { value: bet });
      // const tx = await contract.makeBet(ethers.solidityPackedKeccak256(['bool', 'uint256'], [selectedOption, password]), { value: bet });
      
      setMessage('Bet Made: ' + bet);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGuess = async () => {
    // Logic to submit guess
    try {  
      const tx = await contract.takeBet(selectedOption, { value: bet });
      await tx.wait();

      setMessage('Guess Submitted');
    } catch (err) {
      console.log(err);
    }
  };

  const handleReveal = async () => {
    // Logic to reveal result
    try {  
      const tx = await contract.reveal(selectedOption, password);
      await tx.wait();
      
      setMessage('Result Revealed');
    } catch (err) {
      console.log(err);
    }    
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl text-center font-bold mb-6">Coin Flip DApp</h1>
      <div className="mb-4">
        <label className="block mb-2">Account: {account ? account : "Not Connected"} </label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Status: {message}</label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Select Heads or Tails:</label>
        <select value={selectedOption} onChange={handleOptionChange} className="w-full px-4 py-2 border rounded-md">
          <option value={0}>Heads</option>
          <option value={1}>Tails</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Password:</label>
        <input type="text" value={password} onChange={handlePasswordChange} className="w-full px-4 py-2 border rounded-md" />
      </div>
      <div className="flex justify-center">
        {!connected && <button onClick={handleConnect} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">Connect</button>}
        {connected && (
          <>
            <button onClick={handleMakeBet} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">Make Bet</button>
            <button onClick={handleGuess} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">Guess</button>
            <button onClick={handleReveal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Reveal</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CoinFlipForm;