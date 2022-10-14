import { Chart as ChartJS, 
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement, 
    Tooltip, 
    Legend,
    Title 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import React from "react";
import { useMediaQuery } from 'react-responsive'

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
);


const pieOptions = {
    plugins: {
        legend: {
          display: true,
          position: "bottom",
          textAlign: "center"
        }
    },
};

const barOptions = {
    plugins: {
        legend: {
          display: true,
          position: "top",
          align:"center",
            padding:20
        }
    },
    scales: {
        x: {
          stacked: true,
        },
        y: {
            stacked: true,
          },
      },
      responsive: true,
      maintainAspectRatio: false   
};

const Graph = ({title, type, data}) => {
    const isMobile = useMediaQuery({ query: '(min-width: 300px)' })
    return(
        <div className={type === 'pie' ? 'w-72' :'sm:w-5/12 xs:w-11/12'} style={{maxHeight:"400px", maxWidth:"700px"}}>
            <h1 className='text-center text-2xl font-bold'>{title}</h1>
            {
                type === "pie" ?
                <Pie data={data}  options={pieOptions} />
                :
                <Bar options={barOptions} data={data} />
            }
        </div>
      
    )
}

export default Graph;