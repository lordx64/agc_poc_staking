import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';


const buttonStyle: React.CSSProperties = {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  };
  
  const inputStyle: React.CSSProperties = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    width: '150px'
  };
  
  const balanceStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#FFD700'
  };

const AGC_ABI = [
  "function balanceOf(address account) public view returns (uint256)",
  "function symbol() public view returns (string)",
  "function decimals() public view returns (uint8)",
  "function lock(address account, uint256 amount) public",
  "function unlock(address account, uint256 amount) public",
  "function approve(address spender, uint256 value) public returns (bool)"
];

const AGC_CONTRACT_ADDRESS = "0x2Ad2934d5BFB7912304754479Dd1f096D5C807Da";
const POLYGON_CHAIN_ID = "0x89"; // Polygon Mainnet
const APY = 10; // 10% APY, adjust as needed

function AGCStaking() {
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [agcBalance, setAgcBalance] = useState<bigint>(BigInt(0));
  const [stakedBalance, setStakedBalance] = useState<bigint>(BigInt(0));
  const [agcSymbol, setAgcSymbol] = useState<string>("");
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [unstakeAmount, setUnstakeAmount] = useState<string>("");

  useEffect(() => {
    checkWalletConnection();
    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum?.on('chainChanged', handleChainChanged);
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      checkAGCBalance(accounts[0]);
      checkStakedBalance(accounts[0]);
    } else {
      setWalletAddress(null);
      setAgcBalance(BigInt(0));
      setStakedBalance(BigInt(0));
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        checkAGCBalance(accounts[0]);
        checkStakedBalance(accounts[0]);
      }
    }
  };

  const checkAGCBalance = async (address: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const agcContract = new ethers.Contract(AGC_CONTRACT_ADDRESS, AGC_ABI, provider);
    const balance = await agcContract.balanceOf(address);
    setAgcBalance(balance);
    const symbol = await agcContract.symbol();
    setAgcSymbol(symbol);
  };

  const checkStakedBalance = async (address: string) => {
    // In a real-world scenario, you'd need to implement a way to track staked balances
    // This is a placeholder and should be replaced with actual logic
    const provider = new ethers.BrowserProvider(window.ethereum);
    const agcContract = new ethers.Contract(AGC_CONTRACT_ADDRESS, AGC_ABI, provider);
    // This is just an example, you'll need to implement a proper way to track staked balances
    const stakedBalance = await agcContract.balanceOf(AGC_CONTRACT_ADDRESS);
    setStakedBalance(stakedBalance);
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await switchToPolygonNetwork();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        checkAGCBalance(accounts[0]);
        checkStakedBalance(accounts[0]);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const switchToPolygonNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_CHAIN_ID }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: POLYGON_CHAIN_ID,
              chainName: 'Polygon Mainnet',
              nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
              rpcUrls: ['https://polygon-rpc.com/'],
              blockExplorerUrls: ['https://polygonscan.com/']
            }],
          });
        } catch (addError) {
          console.error('Failed to add Polygon network:', addError);
        }
      } else {
        console.error('Failed to switch to Polygon network:', switchError);
      }
    }
  };

  const stakeAGC = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("Please install MetaMask!");
      return;
    }

    const amount = ethers.parseEther(stakeAmount);
    if (amount > agcBalance) {
      alert(`You don't have enough ${agcSymbol} tokens to stake!`);
      return;
    }

    setIsStaking(true);

    try {
      await switchToPolygonNetwork();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const agcContract = new ethers.Contract(AGC_CONTRACT_ADDRESS, AGC_ABI, signer);

      console.log(`Approving AGC tokens for staking...`);
      const approveTx = await agcContract.approve(AGC_CONTRACT_ADDRESS, amount);
      await approveTx.wait();
      console.log(`Approval confirmed: ${approveTx.hash}`);

      console.log(`Initiating stake transaction from wallet: ${await signer.getAddress()}`);
      const stakeTx = await agcContract.lock(await signer.getAddress(), amount);
      console.log(`Transaction sent: ${stakeTx.hash}`);
      await stakeTx.wait();
      console.log(`Transaction confirmed: ${stakeTx.hash}`);

      alert(`${stakeAmount} ${agcSymbol} tokens staked successfully!`);
      checkAGCBalance(await signer.getAddress());
      checkStakedBalance(await signer.getAddress());
      setStakeAmount("");
    } catch (error) {
      console.error("Error staking AGC tokens:", error);
      alert("Failed to stake AGC tokens. Check console for details.");
    } finally {
      setIsStaking(false);
    }
  };

  const unstakeAGC = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("Please install MetaMask!");
      return;
    }

    const amount = ethers.parseEther(unstakeAmount);
    if (amount > stakedBalance) {
      alert(`You don't have enough staked ${agcSymbol} tokens to unstake!`);
      return;
    }

    setIsUnstaking(true);

    try {
      await switchToPolygonNetwork();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const agcContract = new ethers.Contract(AGC_CONTRACT_ADDRESS, AGC_ABI, signer);

      console.log(`Initiating unstake transaction from wallet: ${await signer.getAddress()}`);
      const unstakeTx = await agcContract.unlock(await signer.getAddress(), amount);
      console.log(`Transaction sent: ${unstakeTx.hash}`);
      await unstakeTx.wait();
      console.log(`Transaction confirmed: ${unstakeTx.hash}`);

      alert(`${unstakeAmount} ${agcSymbol} tokens unstaked successfully!`);
      checkAGCBalance(await signer.getAddress());
      checkStakedBalance(await signer.getAddress());
      setUnstakeAmount("");
    } catch (error) {
      console.error("Error unstaking AGC tokens:", error);
      alert("Failed to unstake AGC tokens. Check console for details.");
    } finally {
      setIsUnstaking(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>
      {!walletAddress ? (
        <button onClick={connectWallet} style={buttonStyle}>Connect Wallet</button>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <p style={balanceStyle}>{agcSymbol} Balance: {ethers.formatEther(agcBalance)} {agcSymbol}</p>
          <p style={balanceStyle}>Staked Balance: {ethers.formatEther(stakedBalance)} {agcSymbol}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Amount to stake"
              style={inputStyle}
            />
            <button onClick={stakeAGC} disabled={isStaking || !stakeAmount} style={buttonStyle}>
              {isStaking ? "Staking..." : "Stake"}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
              placeholder="Amount to unstake"
              style={inputStyle}
            />
            <button onClick={unstakeAGC} disabled={isUnstaking || !unstakeAmount} style={buttonStyle}>
              {isUnstaking ? "Unstaking..." : "Unstake"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AGCStaking;