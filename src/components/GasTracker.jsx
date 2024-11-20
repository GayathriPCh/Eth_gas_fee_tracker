import React, { useState, useEffect } from "react";
import '../App.css'; // Importing custom CSS for the page styling

const GasTracker = () => {
  const [gasData, setGasData] = useState({});
  const [ethPrice, setEthPrice] = useState(0);
  const [gasLimit, setGasLimit] = useState("");
  const [transactionCost, setTransactionCost] = useState({ eth: 0, usd: 0 });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  // Fetch gas fees and ETH price
  const fetchGasFees = async () => {
    setLoading(true);
    try {
      // Fetch gas fees
      const gasResponse = await fetch(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=U9CMNTDPYGJ42Z4IN7CVGXHKPISN2BHE3F`
      );
      const gasData = await gasResponse.json();

      // Fetch ETH price
      const priceResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
      );
      const priceData = await priceResponse.json();

      if (gasData.status === "1") {
        setGasData({
          low: gasData.result.SafeGasPrice,
          medium: gasData.result.ProposeGasPrice,
          high: gasData.result.FastGasPrice,
        });
      }

      setEthPrice(priceData.ethereum.usd);
      setLastUpdated(new Date().toLocaleTimeString()); // Update last updated time
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // Calculate cost based on gas limit
  const calculateCost = () => {
    if (!gasLimit) return;

    const gasPrice = gasData.medium; // Use medium gas price for calculation
    const costInEth = (gasPrice * gasLimit * 1e-9).toFixed(8);
    const costInUsd = (costInEth * ethPrice).toFixed(2);

    setTransactionCost({ eth: costInEth, usd: costInUsd });
  };

  // Fetch gas data on component mount
  useEffect(() => {
    fetchGasFees();
  }, []);

  return (
    <div className="modern-container">
      <div className="glass-card">
        <h1 className="main-title">Ethereum Gas Fee Tracker</h1>
<div className="education-section">
  <div className="info-card">
    <h2>What is Ethereum Gas?</h2>
    <p>Gas is the unit that measures computational effort required to execute operations on the Ethereum network. Every transaction needs gas to be processed.</p>
    
    <h3>Understanding Gas Terms:</h3>
    <div className="terms-grid">
      <div className="term-card">
        <h4>Gas Price (Gwei)</h4>
        <p>The amount you're willing to pay per unit of gas. Measured in Gwei (1 Gwei = 0.000000001 ETH)</p>
      </div>
      <div className="term-card">
        <h4>Gas Limit</h4>
        <p>Maximum amount of gas you're willing to use for a transaction. Common limits:
          • Simple transfer: 21,000
          • Token transfer: ~65,000
          • Smart contract: 100,000+</p>
      </div>
      <div className="term-card">
        <h4>Transaction Priority</h4>
        <p>• Low: Cheaper but slower
           • Medium: Balanced cost/speed
           • High: Faster but more expensive</p>
      </div>
    </div>
  </div>
</div>
        {loading ? (
          <div className="modern-spinner">
            <div className="spinner-ring"></div>
          </div>
        ) : (
          <div className="gas-info-container">
            <div className="gas-price-card">
              <div className="gas-label">Low</div>
              <div className="gas-value">{gasData.low}</div>
              <div className="gas-unit">Gwei</div>
              <div className="gas-description">Slower transaction</div>
            </div>

            <div className="gas-price-card highlight">
              <div className="gas-label">Medium</div>
              <div className="gas-value">{gasData.medium}</div>
              <div className="gas-unit">Gwei</div>
              <div className="gas-description">Recommended</div>
            </div>

            <div className="gas-price-card">
              <div className="gas-label">High</div>
              <div className="gas-value">{gasData.high}</div>
              <div className="gas-unit">Gwei</div>
              <div className="gas-description">Faster transaction</div>
            </div>
          </div>
        )}

        <div className="eth-price-container">
          <div className="eth-price">
            <span className="label">ETH Price:</span>
            <span className="value">${ethPrice}</span>
          </div>
          <div className="last-updated">
            Last Updated: {lastUpdated}
          </div>
        </div>

        <div className="calculator-container">
          <h2>Transaction Cost Calculator</h2>
          <div className="input-group">
            <label htmlFor="gasLimit">Gas Limit</label>
            <input
              type="number"
              id="gasLimit"
              value={gasLimit}
              onChange={(e) => setGasLimit(e.target.value)}
              placeholder="e.g., 21000"
            />
          </div>
          <button className="modern-button calculate" onClick={calculateCost}>
            Calculate Cost
          </button>
          
          {transactionCost.eth > 0 && (
            <div className="cost-results">
              <div className="cost-item">
                <span className="cost-label">ETH Cost:</span>
                <span className="cost-value">{transactionCost.eth} ETH</span>
              </div>
              <div className="cost-item">
                <span className="cost-label">USD Cost:</span>
                <span className="cost-value">${transactionCost.usd}</span>
              </div>
            </div>
          )}
        </div>

        <button className="modern-button refresh" onClick={fetchGasFees}>
          Refresh Prices
        </button>
      </div>
    </div>
  );
};


export default GasTracker;
