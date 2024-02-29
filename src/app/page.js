'use client'

import React, { useState } from 'react';

const CoinFlipForm = () => {
  
  // State variables - will be used later
  const [account, setAccount] = useState(null)
  const [selectedOption, setSelectedOption] = useState('');
  const [password, setPassword] = useState('');
  const [connected, setConnected] = useState(false);

  // Event handlers - will be used later
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConnect = () => {
    // Logic to connect to wallet or DApp
    setConnected(true);
  };

  const handleMakeBet = () => {
    // Logic to make a bet
  };

  const handleGuess = () => {
    // Logic to submit guess
  };

  const handleReveal = () => {
    // Logic to reveal result
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl text-center font-bold mb-6">Coin Flip DApp</h1>
      <div className="mb-4">
        <label className="block mb-2">Account: Not connected</label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Status: No Bet</label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Select Heads or Tails:</label>
        <select value={selectedOption} onChange={handleOptionChange} className="w-full px-4 py-2 border rounded-md">
          <option value="heads">Heads</option>
          <option value="tails">Tails</option>
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