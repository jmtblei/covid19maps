import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Svg, Rect, Text } from "@potion/element";
import { Treemap } from "@potion/layout";
import { Tooltip } from "@material-ui/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { v4 as uuidv4 }from "uuid";

export default () => {
    const countryData = useSelector(state => state.summaryData.Countries);

    const top50AllCases = countryData
        .filter(data => data.TotalConfirmed > 0)
        .sort((a, b) => b.TotalConfirmed - a.TotalConfirmed).slice(0, 50)

    const percentageChange = (countryChange, globalChange) => {
        return ((countryChange / globalChange) * 100).toFixed(2)
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
    }
    
    const arrange50AllCasesData = (data) => {
        let globalChange = data.reduce((a, c) => a + c.TotalConfirmed, 0);
        return data.map(datum => {
            return {
                key: datum.id,
                value: percentageChange(datum.TotalConfirmed, globalChange),
                country: datum.Country,
                countrycode: datum.CountryCode,
                dateupdated: formatDate(datum.Date),
                totalconfirmed: datum.TotalConfirmed,
                totaldeaths: datum.TotalDeaths,
                newcases: datum.TotalConfirmed,
                newdeaths: datum.NewDeaths
            }
        })
    };
    
    const fontResize = (x0, x1, y0, y1) => {
        borderMatch =  x1-x0 < y1-y0 ? ((x1 - x0) / 8) : ((y1 - y0) / 8);
        return borderMatch  
    }

    let borderMatch;
    let colorChange;


    const colorCode = (data) => {
        colorChange = data.totalconfirmed === 0 ? "#DEF5FF" 
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
    }
    
    return (
        <div>
            <TransformWrapper defaultScale={1}>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                <React.Fragment>
                    <div className="tools">
                        <button onClick={resetTransform}>Reset Zoom</button>
                    </div>
                <TransformComponent>
                <Svg width={window.innerWidth} height={window.innerHeight - 200}>
                <Treemap
                    data={{children: arrange50AllCasesData(top50AllCases)}}
                    sum={datum => datum.value}
                    size={[window.innerWidth, (window.innerHeight - 200)]}
                >
                    {nodes => nodes.map(({ key, x0, y0, x1, y1, data }) => (
                    <>
                        {colorCode(data)}
                        {fontResize(x0, x1, y0, y1)}
                        <Tooltip title={
                            <Fragment>
                                <h2>{data.country}</h2>
                                <h2>Total confirmed cases: {data.totalconfirmed}</h2>
                                <h2>% Global cases: {data.value}%</h2>
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
                                    {data.totalconfirmed}
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
                </Treemap>
                </Svg>
                </TransformComponent>
                </React.Fragment>
            )}
            </TransformWrapper>
        </div>
    );
}