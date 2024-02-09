import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomCandlestickChart from './CandleStickChart';
import './App.css'


const BinanceCandlestickApp = () => {
  const [candlestickData, setCandlestickData] = useState([]);
  const [value, setValue] = useState('');

  const fetchData = async () => {
    try {

      const response = await axios.get(
        'https://fapi.binance.com/fapi/v1/continuousKlines',
        {
          params: {
            pair: 'ETHUSDT',
            interval: '1m',
            limit: 30,
            contractType: 'PERPETUAL'
          },
        }
      );

      const formattedData = response.data.map((candle) => ({
        time: new Date(candle[0]),
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
      }));
      console.log(formattedData);
      setCandlestickData(formattedData);
      console.log("fetching data");
    } catch (error) {
      console.error('Error fetching candlestick data:', error);
    }
  };

  const fetchPrediction = async () => {
    try {
      const response = await axios.post(
        'https://16.171.39.236/predict',
        {},
        {
          httpsAgent: {
            rejectUnauthorized: false,
          },
        }
      );
      console.log(response);
      let prediction = response.data.prediction;
      setValue(prediction);
      console.log(`prediction ${prediction}`);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };


  useEffect(() => {
    fetchData(); // Initial fetch
    fetchPrediction();

    const intervalId = setInterval(() => {
      fetchData();
      fetchPrediction(); // Fetch data at 1-minute interval
    }, 60 * 1000); // 60 seconds * 1000 milliseconds

    return () => {
      clearInterval(intervalId);
    };
  }, []); // Include chartInstance as a dependency to trigger the cleanup effect

  return (
    <div className="app">
      <h1 className='appHeader'> ETH-USDT <span>(1min)</span></h1>
      {candlestickData.length > 0 && (
        <CustomCandlestickChart data={candlestickData} />
      )}
      <h1 className='orderInfo'>Next Order : {value === 2 ? 'Sell 💰' : value === 0 ? 'Buy 💸' : 'Hold ⚖️'}</h1>
    </div>
  );
};

export default BinanceCandlestickApp;
