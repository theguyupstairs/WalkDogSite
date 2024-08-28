import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import { useEffect, useState } from 'react';

function FamilyChart({ distanceSum, timeSum, familyUsers }) {

    ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

    const dataSetter = () => {

        const data = {
            labels: familyUsers,
            datasets: [
              {
                label: 'Distance',
                data:  distanceSum,
                borderColor: '#000000', 
                backgroundColor: '#B0D7E5',
                datalabels: {
                    color: '#000000', // Text color for labels
                    anchor: 'end', // Position labels at the end of the bars
                    align: 'top', // Align labels to the top of the bars
                    formatter: (value) => value.toFixed(1) // Format the labels (optional)
                }
              },
              {
                label: 'Time',
                data:  timeSum,
                borderColor: '#000000', 
                backgroundColor: '#FFCDD2',
                datalabels: {
                    color: '#000000', // Text color for labels
                    anchor: 'end', // Position labels at the end of the bars
                    align: 'top', // Align labels to the top of the bars
                    formatter: (value) => value.toFixed(1) // Format the labels (optional)
                }
              }
            ],
          };

          return data;
    }

    const optionsSetter = () => {

        const options = {
            plugins: {
                legend: {
                    display: true, // This will hide the legend and the color box
                    position: 'right'
                },
                datalabels: {
                    display: true
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#00FFFFFF', // Black grid lines on the x-axis
                        borderColor: '#00FFFFFF', // Black border color on the x-axis
                        display: false
                    },
                    ticks: {
                        color: '#000000', // Optional: White color for x-axis labels
                        font: {
                            size: 14, // Increase font size for y-axis labels
                            weight: 'bold' // Make y-axis labels bold
                        }
                    },
                    border: {
                        color: '#000000',
                        width: 2,
                        dash: [5, 5]
                    }
                },
                y: {
                    grid: {
                        color: '', // Black grid lines on the y-axis
                        borderColor: '#C0C0C0', // Black border color on the y-axis
                        display: false
                    },
                    ticks: {
                        color: '#000000', // y label color
                        font: {
                            size: 14, // Increase font size for y-axis labels
                            weight: 'bold' // Make y-axis labels bold
                        },
                    },
                    border: {
                        color: '#000000',
                        width: 2,
                        dash: [5, 5]
                    }
                }
            }
        };

        return options;

    }

    return (
        <Bar data={dataSetter()} options={optionsSetter()}></Bar>
    );
}

export default FamilyChart;