import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';

function DistanceChart({ walkData }) {
    const [daysAxis, setDaysAxis] = useState([]);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

    const dataSetter = () => {

        const data = {
            labels: daysOfWeek,
            datasets: [
              {
                label: 'Distance Walked',
                data: walkData,
                borderColor: '#000000', 
                backgroundColor: '#000000'
              },
            ],
          };

          return data;
    }

    const optionsSetter = () => {

        const options = {
            plugins: {
                legend: {
                    display: false, // This will hide the legend and the color box
                },
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
        <Line data={dataSetter()} options={optionsSetter()}></Line>
    );

}

export default DistanceChart;
