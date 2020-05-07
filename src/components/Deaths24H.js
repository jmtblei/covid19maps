import React, { useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Svg, Rect, Text, Circle } from "@potion/element";
import { Treemap, Pack } from "@potion/layout";
import { Tooltip, Button } from "@material-ui/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { v4 as uuidv4 }from "uuid";
import { fetchSummaryData } from "../actions/index";
import { Alert, AlertTitle } from "@material-ui/lab";

export default () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSummaryData())
    }, []);

    const countryData = useSelector(state => state.summaryData.Countries);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
    }
    
    const percentageChange = (countryChange, globalChange) => {
        return ((countryChange / globalChange) * 100).toFixed(2)
    };

    //TOP 50 COUNTRIES BY NEW CONFIRMED DEATHS (24H)---------------------------------------------
    const top50NewDeaths = countryData
        .filter(data => data.NewDeaths > 0)
        .sort((a, b) => b.NewDeaths - a.NewDeaths).slice(0, 50)
        // .map((a, index) => ({...a, id: uuidv4(index)}));
    // console.log("new confirmed deaths", top50NewDeaths);

    const arrange50NewDeathsData = (data) => {
        let globalChange = data.reduce((a, c) => a + c.NewDeaths, 0);
        return data.map(datum => {
            return {
                key: datum.id,
                value: percentageChange(datum.NewDeaths, globalChange),
                country: datum.Country,
                countrycode: datum.CountryCode,
                dateupdated: formatDate(datum.Date),
                totalconfirmed: datum.TotalConfirmed,
                totaldeaths: datum.TotalDeaths,
                newcases: datum.NewConfirmed,
                newdeaths: datum.NewDeaths
            }
        })
    };
    //-------------------------------------------------------------------------------------------
    
    //-------------------------- only for treemaps
    // const fontResize = (x0, x1, y0, y1) => {
    //     borderMatch =  x1-x0 < y1-y0 ? ((x1 - x0) / 8) : ((y1 - y0) / 8);
    //     return borderMatch  
    // };

    // let borderMatch;
    //--------------------------
    let colorChange;

    const colorCode = (data) => {
            colorChange = data.newdeaths === 0 ? "#DEF5FF" 
            : data.value <= .1 ? "#36BB35" 
            : data.value <= .5 ? "#00FF00"
            : data.value <= 1 ? "#FFFF00"
            : data.value <= 2 ? "#F4C430"
            : data.value <= 5 ? "#FFA000"
            : data.value <= 7.5 ? "#FF681F"
            : data.value <= 10 ? "#FF0000"
            : "#860111";
            return (
                colorChange
            )

    };
    
    return (
        <div>
            {
            top50NewDeaths.length == 0 ?
            <div>
                <Alert severity="info">
                    <AlertTitle>Info</AlertTitle>
                    <strong>
                        The database as reported no new confirmed deaths.
                    </strong>
                </Alert>
            </div>
            :
            <div>
                <div>
                <Alert severity="info">
                    <AlertTitle>
                        These are the top 50 countries with the most confirmed deaths reported in the last 24 hours
                    </AlertTitle>
                    <strong>
                        Mouse over data points for additional details.
                    </strong>
                </Alert>
                </div>
                <TransformWrapper defaultScale={1}>
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <React.Fragment>
                        <div>
                            <Button onClick={resetTransform} variant="outlined">Reset Zoom</Button>
                        </div>
                    <TransformComponent>
                    <Svg width={window.innerWidth} height={window.innerHeight - 100}>
                    {/* REPLACING TREEMAP/RECT WITH PACK/CIRCLES*/}
                    {/* <Treemap
                        data={{children: arrange50NewDeathsData(top50NewDeaths)}}
                        sum={datum => datum.value}
                        size={[window.innerWidth, (window.innerHeight - 100)]}
                    >
                        {nodes => nodes.map(({ key, x0, y0, x1, y1, data }) => (
                        <>
                            {colorCode(data)}
                            {fontResize(x0, x1, y0, y1)}
                            <Tooltip title={
                                <Fragment>
                                    <h2>{data.country}</h2>
                                    <h2>New confirmed deaths: {data.newdeaths}</h2>
                                    <h2>% Global new deaths: {data.value}%</h2>
                                    <h2>Date Updated: {data.dateupdated}</h2>
                                </Fragment>
                            }>
                                <Rect
                                    key={key}
                                    x={x0}
                                    y={y0}
                                    width={x1 - x0}
                                    height={y1 - y0}
                                    fill={colorChange}
                                    stroke='#01579b'
                                />
                            </Tooltip>
                                <Text
                                    x={x0 + (x1 - x0) * .3}
                                    y={y0 + (y1 - y0) / 2}
                                    fontSize={borderMatch}
                                    color="black"
                                >
                                    <tspan>
                                        {data.countrycode}
                                    </tspan>
                                </Text>
                                <Text
                                    x={x0 + (x1 - x0) * .3}
                                    y={y0 + (y1 - y0) / 2}      
                                    fontSize={borderMatch}
                                    color="black"
                                >
                                    <tspan dy={borderMatch}>
                                        +{data.newdeaths}
                                    </tspan>   
                                </Text>
                                <Text
                                    x={x0 + (x1 - x0) * .3}
                                    y={y0 + (y1 - y0) / 2}
                                    fontSize={borderMatch}
                                    color="black"
                                >
                                    <tspan dy={2 * Number(borderMatch)}>
                                        {data.value}%
                                    </tspan>
                                </Text>
                        </>
                        ))}
                    </Treemap> */}
                    <Pack
                        data={{children: arrange50NewDeathsData(top50NewDeaths)}}
                        sum={datum => datum.value}
                        size={[window.innerWidth, (window.innerHeight - 200)]}
                        includeRoot={false}
                    >
                        {nodes => nodes.map(({ x, y, r, data }) => (
                        <>
                            {colorCode(data)}
                            <Tooltip title={
                                <Fragment>
                                    <h2>{data.country}</h2>
                                    <h2>New confirmed deaths: {data.newdeaths}</h2>
                                    <h2>% Global new deaths: {data.value}%</h2>
                                    <h2>Date Updated: {data.dateupdated}</h2>
                                </Fragment>
                            }>
                                <Circle
                                    key={data.id}
                                    cx={x}
                                    cy={y}
                                    r={r}
                                    fill={colorChange}
                                    stroke='#01579b'
                                />
                            </Tooltip>
                                <Text
                                    x={x*.99}
                                    y={y}
                                    stroke="black"
                                >
                                    <tspan>
                                        {data.countrycode}
                                    </tspan>
                                </Text>
                        </>
                        ))}
                    </Pack>
                    </Svg>
                    </TransformComponent>
                    </React.Fragment>
                )}
                </TransformWrapper>
            </div>
            }
        </div>
    );
}