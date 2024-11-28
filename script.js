const form = document.getElementById('calculator-form');
const resultDiv = document.getElementById('result');

// CoinGecko API endpoint
const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=pinocoin,dogecoin,pepe,bonk&vs_currencies=usd&include_market_cap=true';

// Function to fetch market cap data
async function fetchMarketCaps() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch market data');
    const data = await response.json();

    // Extract market caps for the relevant coins
    return {
      pino: data.pinocoin.market_cap,
      doge: data.dogecoin.market_cap,
      pepe: data.pepe.market_cap,
      bonk: data.bonk.market_cap,
    };
  } catch (error) {
    console.error('Error fetching market caps:', error);
    resultDiv.textContent = 'Unable to fetch market data. Please try again later.';
    return null;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const pinoHoldings = parseFloat(document.getElementById('pino-holdings').value);
  const selectedCoin = document.getElementById('meme-coin').value;

  if (isNaN(pinoHoldings) || pinoHoldings <= 0) {
    resultDiv.textContent = 'Please enter a valid amount of $PINO holdings.';
    return;
  }

  // Fetch live market cap data
  const marketCaps = await fetchMarketCaps();
  if (!marketCaps) return; // Stop if there's an API error

  const pinoMarketCap = marketCaps.pino;
  const selectedCoinMarketCap = marketCaps[selectedCoin];

  // Calculate equivalent value
  const equivalentValue = (pinoHoldings * selectedCoinMarketCap) / pinoMarketCap;

  resultDiv.textContent = `Your current $PINO holdings with the market cap of ${selectedCoin.toUpperCase()} would be worth $${equivalentValue.toFixed(2)}`;
});
