import { useEffect, useRef, useState } from "react";
import axios from 'axios';

const spotPriceUrl = 'https://api.coinbase.com/v2/prices/spot?currency=USD';
// const sellPriceUrl = 'https://api.coinbase.com/v2/prices/BTC-USD/sell';

const currencyFormat = (num) => '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

export default function BitcoinPrice({ className, style }) {
  const [bitcoinPrice, updateBitcoinPrice] = useState(0);
  const [bitcoinPriceDate, updateBitcoinPriceDate] = useState(new Date());

  const stateRef = useRef(bitcoinPrice);

  const getBitcoinPrice = async (isMounted) => {
    const { data: { data: { amount }}} = await axios(spotPriceUrl);
    if (isMounted && amount !== stateRef.current) {
      updateBitcoinPrice(amount);
      updateBitcoinPriceDate(new Date());
      stateRef.current = amount;
    }
  }

  useEffect(() => {
    let isMounted = true; 
    const interval = setInterval(() => {
      getBitcoinPrice(isMounted);
    }, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    }
  }, []);
  return (
    <div style={style} className={className}>
      {currencyFormat(Number(bitcoinPrice)) + ' - Last Updated: ' + bitcoinPriceDate.toLocaleTimeString()}
    </div>
  )
}
