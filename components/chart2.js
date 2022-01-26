import React from 'react';
import { CanvasJSChart, CanvasJS } from 'canvasjs-react-charts'
import { useState, useEffect } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import DatePicker from "react-datepicker";

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import "react-datepicker/dist/react-datepicker.css";



const ChartWithZoom = () => {

  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [periode, setPeriode] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [targetPeriod, setTargetPeriod] = useState('');
  const [gridApi, setGridApi] = useState(null);


  useEffect(() => {
    const fetchData = async () => {

      const response = await fetch('/api/get-trace-data?tp='+ targetPeriod )
      const responseJson = await response.json();
      let list = responseJson.data.map((el) => {
        let dateStr = (new Date(Math.floor(parseFloat(el.time)))).toLocaleString('fr-FR')
        let hms = dateStr.split(',')[1]
        return { ...el, hms: hms, dateStr: dateStr, date: new Date(Math.floor(parseFloat(el.time))), date: new Date(Math.floor(parseFloat(el.time))), max: parseInt(el.max), avis: parseInt(el.avis), refs: parseInt(el.refs), fiche: parseInt(el.fiche) }
      })

     // console.log(targetHour) 
     //  console.log(list);
      let periode = list.length ? list[0].dateStr + ' - ' + list[list.length - 1].hms : '' 
      setPeriode(periode);
      setData(list);

      let maxData = list.map((el) => {
        return { x: el.date, y: el.max }
      })
      let ficheData = list.map((el) => {
        return { x: el.date, y: el.fiche }
      })
      let avisData = list.map((el) => {
        return { x: el.date, y: el.avis }
      })

      let refsData = list.map((el) => {
        return { x: el.date, y: el.refs }
      })
      let chartData = {
        theme: "light2", // "light1", "dark1", "dark2"
        animationEnabled: true,
        zoomEnabled: true,
        title: {
          text: ``
        },
        axisX: {
          labelFormatter: function (e) {
            return CanvasJS.formatDate(e.value, "hh:mm:ss");
          },
          includeZero: false,
        },
        axisY: {
          includeZero: false,

        },
        toolTip: {
          shared: true,
          contentFormatter: function (e) {
            var str = "";
            for (var i = 0; i < e.entries.length; i++) {
              var temp = e.entries[i].dataSeries.name + " <strong>" + e.entries[i].dataPoint.y + " (ms) </strong> <br/>";
              str = str.concat(temp);
            }
            return (str);
          }
        },
        data: [
          {

            type: "area",
            name: "fiche",
            legendText: "fiche",
            showInLegend: true,
            dataPoints: ficheData
          },
          {
            type: "area",
            name: "refs",
            legendText: "refs",
            showInLegend: true,
            dataPoints: refsData
          },
          {
            type: "area",
            name: "avis",
            legendText: "avis",
            showInLegend: true,
            dataPoints: avisData
          }


        ]
      }
      setChartData(chartData);

    };

    fetchData();
  }, [targetPeriod]);


  const dynamicCellStyle = params => {

    if (params.value > 400  ) {
      //mark police cells as red
      return { backgroundColor: '#FBC0B4'};
    }
    if (params.value > 200  ) {
        //mark police cells as red
        return { backgroundColor: '#F6DE6A'};
    }
    return null;
};
const onGridReady = (params) => {
  setGridApi(params.api);

};

const onBtnExport = () => {
  gridApi.exportDataAsCsv();
};


  return (
    <div className="ChartWithZoom">


      <DatePicker

        selected={selectedDate}
        onChange={(date) =>  { 
          let tp = date.toISOString().slice(0, 10) +'-' + date.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2,useGrouping: false})
          setSelectedDate(date)
          setTargetPeriod(tp)
        }}
        showTimeSelect
        timeFormat="HH"
        timeIntervals={60}
        timeCaption="time"
        dateFormat="yyyy/MM/dd HH"
      />


      <div style={{ textAlign: 'center', fontSize: '30px', margin: '50px' }}> Période : {periode} <br /> nombre de produits: {data.length}, temps de pause: 1s</div>




      <CanvasJSChart options={chartData}
      /* onRef={ref => this.chart = ref} */
      />

      <div className="ag-theme-alpine" style={{ height: "400px", padding: '50px' }}>
        <AgGridReact
        onGridReady={onGridReady}
          rowData={data}  enableCellTextSelection={true} ensureDomOrder={true} >
          <AgGridColumn field="dateStr" sortable={true}></AgGridColumn>
          <AgGridColumn field="product"  filter={true} sortable={true} ></AgGridColumn>
          <AgGridColumn field="fiche" sortable={true} cellStyle={dynamicCellStyle}  ></AgGridColumn>
          <AgGridColumn field="refs" sortable={true} cellStyle={dynamicCellStyle}  ></AgGridColumn>
          <AgGridColumn field="avis" sortable={true} cellStyle={dynamicCellStyle}  ></AgGridColumn>
          <AgGridColumn field="max" sortable={true}  cellStyle={dynamicCellStyle}  ></AgGridColumn>
        </AgGridReact>

        <div style={{ margin: '10px 0' }}>
          <button onClick={() => onBtnExport()}>
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );

}
export default ChartWithZoom;