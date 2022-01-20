import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ReferenceLine,
    Brush,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import { useState, useEffect } from 'react';


import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export default function Chart() {

    const [data, setData] = useState([]);
    const [periode, setPeriode] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/get-data')
            const responseJson = await response.json();
            let list = responseJson.map((el) => {
                let dateStr = (new Date(Math.floor(parseFloat(el.time)))).toLocaleString('fr-FR')
                let hms = dateStr.split(',')[1]
                return { ...el, time: hms, date: dateStr, max: parseInt(el.max), avis: parseInt(el.avis), refs: parseInt(el.refs), fiche: parseInt(el.fiche) }
            })

            console.log(list);
            let periode = list[0].date + ' - ' + list[list.length - 1].time
            setPeriode(periode);
            setData(list);

        };

        fetchData();
    }, []);


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="recharts-tooltip-wrapper">
                    <p className="label">{`Id produit=${payload[0].payload.product}`}</p>
                    <p className="label">{`max=${payload[0].payload.max}ms (api fiche: ${payload[0].payload.fiche}ms, api refs: ${payload[0].payload.refs}ms, api avis: ${payload[0].payload.avis}ms)`}</p>
                </div>
            )
        }
        return null;
    };





    return (
        <div style={{ width: '100%', marginTop: '100px', height: 500 }}>
            <div style={{ textAlign: 'center', fontSize: '30px' }}> Dernière exécution :<br /> {periode} <br /> nombre de produits: {data.length}, temps de pause: 1s</div>
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

                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={200} stroke="#FFC300" />
                    <ReferenceLine y={400} stroke="#C70039" />
                    <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                    <Brush dataKey="time" height={50} stroke="#656460" />
                    <Bar dataKey="fiche" stackId="a" fill="#CA6F1E" />
                    <Bar dataKey="refs" stackId="b" fill="#356AC0" />
                    <Bar dataKey="avis" stackId="c" fill="#82c" />

                </BarChart>
            </ResponsiveContainer>
            <div className="ag-theme-alpine" style={{ height: "400px", padding: '50px' }}>
                <AgGridReact
                    rowData={data}>
                    <AgGridColumn field="date" sortable={true}></AgGridColumn>
                    <AgGridColumn field="product" filter={true} sortable={true} ></AgGridColumn>

                    <AgGridColumn field="fiche" sortable={true} ></AgGridColumn>
                    <AgGridColumn field="refs" sortable={true}></AgGridColumn>
                    <AgGridColumn field="avis" sortable={true}></AgGridColumn>
                    <AgGridColumn field="max" sortable={true}></AgGridColumn>
                </AgGridReact>
            </div>


        </div>

    );
}
