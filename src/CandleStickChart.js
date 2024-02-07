import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export const CustomCandlestickChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (data.length === 0) return;

        const ctx = chartRef.current.getContext('2d');

        const openCloseData = data.map((item) => ({
            x: item.time,
            y: item.close,
            high: item.high,
            low: item.low,
        }));

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Candlestick Chart',
                        data: openCloseData,
                        borderColor: 'red',
                        borderWidth: 5,
                        pointRadius: 2,
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false, // Set to false to hide the legend (title)
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute',
                        },
                        ticks: {
                            color: 'black', // Set x-axis label color
                        },
                    },
                    y: {
                        beginAtZero: false,
                        position: 'right',
                        ticks: {
                            color: 'black', // Set x-axis label color
                        },
                    },
                },
                elements: {
                    line: {
                        tension: 0, // Disable bezier curves to make it look more like a candlestick
                    },
                },
                tooltips: {
                    callbacks: {
                        label: (t, d) => {
                            console.log("t", t);
                            console.log("d", d);
                            const dataItem = data[t.datasetIndex];
                            return `Open: ${dataItem.open} Close: ${dataItem.close} High: ${dataItem.high} Low: ${dataItem.low}`
                        },
                    },
                },
            },
        });

        return () => {
            myChart.destroy();
        };
    }, [data]);

    return (
        <div className='chart'>
            <canvas ref={chartRef} width={300} height={400}></canvas>
        </div>
    );
};

export default CustomCandlestickChart;
