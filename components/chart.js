import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
    Brush,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import { useState, useEffect } from 'react';


export default function Chart() {



    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch('/api/get-data' )
        const list = await response.json();

        console.log(list);
        setData(list);
      };
  
      fetchData();
    }, []);

    


    return (
        <div style={{ width: '100%', height: 500 , marginTop: '100px'}}>
            <ResponsiveContainer>
                <BarChart

                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
               
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip />
                    <ReferenceLine y={200} stroke="#FFC300" />
                    <ReferenceLine y={400} stroke="#C70039" />
                    <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                    <Brush dataKey="time" height={50} stroke="#656460" />
                    <Bar dataKey="fiche" stackId="a" fill="#35B2C0" />
                    <Bar dataKey="refs" stackId="b" fill="#356AC0" />
                    <Bar dataKey="avis" stackId="c" fill="#82c" />
                    <Bar dataKey="max" stackId="d" fill="#EE4B2B" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
