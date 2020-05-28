import React from "react";
import { useSelector } from "react-redux";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { 
    Button, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Dialog, 
    Table, 
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse, 
    IconButton,
    Grid,
} from "@material-ui/core";
import { Close, TableChart, Refresh, Info } from "@material-ui/icons";
import { Alert, AlertTitle } from "@material-ui/lab";
import * as d3 from "d3";
import * as d3Array from "d3-array"
import * as d3Hierarchy from "d3-hierarchy";
import * as d3Collection from "d3-collection";
import NetworkFrame from "semiotic/lib/NetworkFrame";
import { scaleThreshold } from "@vx/scale";
import { LegendThreshold, LegendItem, LegendLabel } from "@vx/legend";

export default () => {
    const countryData = useSelector(state => state.countryData);
    console.log("statedata", countryData)

    const countriesByCases = countryData
        .filter(data => data.cases > 0)
        .sort((a, b) => b.cases - a.cases)
    console.log("all confirmed cases", countriesByCases);

    const worldChange = (countryChange, globalChange) => {
        return ((countryChange / globalChange) * 100).toFixed(4)
    };

    const contChange = (countryChange, regionChange) => {
        return ((countryChange / regionChange) * 100).toFixed(4)
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
    };
    
    const arrangeAllData = (data) => {
        let globalChange = data.reduce((a, c) => a + c.cases, 0);
        return data.map(datum => {
            return {
                globalpercent: parseFloat(worldChange(datum.cases, globalChange)),
                country: datum.country,
                countrycode: datum.countryInfo.iso2,
                countryflag: datum.countryInfo.flag,
                dateupdated: formatDate(datum.updated),
                totalconfirmed: datum.cases,
                totaldeaths: datum.deaths,
                newcases: datum.todayCases,
                newdeaths: datum.todayDeaths,
                continent: datum.continent,
                recovered: datum.recovered
            }
        })
    };

    //-----------------------------LEGACY CODE--------------------------------------------------------------------------------------------------------
    // const arrangeRegionData = (data) => {
    //     let regionChange = data.reduce((a, c) => a + c.totalconfirmed, 0);
    //     return data.map(datum => {
    //         return {
    //             ...datum,
    //             regionpercent: contChange(datum.totalconfirmed, regionChange)
    //         }
    //     })
    // };

    
    // const continentData = Array.from(covidContinents, ([key, value, globalvalue]) => ({
    //     key, 
    //     value: value.reduce((a, c) => a + c.totalconfirmed, 0), 
    //     globalvalue: value.reduce((a, c) => a + c.globalpercent, 0)
    // })).slice(0, -1);
    // // console.log("continentData", continentData)
    
    // const continentChildren = Array.from(covidContinents, ([key, value, children]) => ({key, value: value.reduce((a, c) => a + c.totalconfirmed, 0), children: value}));
    // const NorthAmericaData = continentChildren.filter(n => n.key === "North America");
    // const SouthAmericaData = continentChildren.filter(n => n.key === "South America");
    // const EuropeData = continentChildren.filter(n => n.key === "Europe");
    // const AsiaData = continentChildren.filter(n => n.key === "Asia");
    // const AfricaData = continentChildren.filter(n => n.key === "Africa");
    // const AusOceData = continentChildren.filter(n => n.key === "Australia/Oceania");
    
    const continentsum = d3Array.rollup(arrangeAllData(countriesByCases), v => d3.sum(v, d => d.totalconfirmed), v => v.continent, v => v.country, v => v.globalpercent, v => v.countryflag);
    // const continentsum = d3Array.rollup(countryData, v => d3.sum(v, d => d.cases), v => v.continent, v => v.country, v => v.countryInfo);
    // console.log("continentsum", continentsum);
    
    const childrenAccessor = ([ key, value ]) => value.size && Array.from(value);
    
    const hierarchydata = 
    d3Hierarchy.hierarchy([null, continentsum], childrenAccessor)
    .sum(([ key, value ]) => value)
    .sort((a, b) => b.value - a.value)
    // console.log("hierdata", hierarchydata)
    
    //---------------WIP----------------------------------------------------------------------------------------------------
    // const circlepack = () => d3.pack()
    //     .size([window.innerWidth, (window.innerHeight * .65)])
    //     .padding(1)
    //     (hierarchydata)
    
    // const nestedData = d3Collection.nest().key(d =>d.continent).key(d => d.country).entries(countryData);
    // console.log("nestedData", nestedData);
    // const hierdata2 = d3Hierarchy.hierarchy(nestedData, d => d.values);
    // console.log("hdata2", hierdata2);

    // const covidContinents = d3Array.group(arrangeAllData(countriesByCases), d => d.continent);
    // // console.log("coviddata", covidContinents);

    //Legend scale VX
    const LegendDemo = ({ title, children }) => {
        return (
          <div className="legend" style={{color:"white"}}>
            <div className="title">{title}</div>
            {children}
            <div>Updated: {arrangeAllData(countriesByCases)[0].dateupdated}</div>
          </div>
        );
    }      
   
    const thresholdScale = scaleThreshold({
        domain: [0.1, 0.5, 1.0, 2.5, 5.0, 7.5, 10.0, "Above"],
        range: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a" , "#e31a1c", "#b10026"]
    });

    //CirclePack render props
    const frameProps = { 
        /* --- Data --- */
        edges: hierarchydata,

        /* --- Size --- */
        size: [window.innerWidth * .8, window.innerHeight *.7],
        margin: 50,

        /* --- Layout --- */
        networkType: "circlepack",

        /* --- Process --- */
        nodeIDAccessor: "name",

        /* --- Customize --- */
        nodeStyle: d => ({
            fill: d.depth === 1 ? "none" 
            : d.parent[0] <= .1 ? "#ffffcc" 
            : d.parent[0] <= .5 ? "#ffeda0"
            : d.parent[0] <= 1 ? "#fed976"
            : d.parent[0] <= 2.5 ? "#feb24c"
            : d.parent[0] <= 5 ? "#fd8d3c"
            : d.parent[0] <= 7.5 ? "#fc4e2a"
            : d.parent[0] <= 10 ? "#e31a1c"
            : "#b10026",
            stroke: d.depth === 1 ? "#9fd0cb": "black",
        }),
        filterRenderedNodes: d => d.depth !== 0,

        /* --- Interact --- */
        hoverAnnotation: [
            { type: "desaturation-layer", style: { fill: "white", fillOpacity: 0.05 } },
            {
            type: "highlight",
            style: d => ({
                fill: "white",
                stroke: "white",
                fillOpacity: 0.4
            })
            },
            { type: "frame-hover" }
        ],

        /* --- Annotate --- */
        tooltipContent: d => (
            <div className="tooltip-content">
            {d.depth === 1 ? 
            <>
            <h5 style={{margin:5}}>Region: {d.data[0]}</h5>
            <h5 style={{margin:5}}>Total confirmed cases: {d.value}</h5>
            </>
            : 
            <>
            <h5 style={{margin:5}}>Country: {d.parent.parent[0]}</h5>
            <h5 style={{margin:5}}>Total confirmed cases: {d.value}</h5>
            <h5 style={{margin:5}}>% Global cases: {d.parent[0]}%</h5>
            <img width="70%" height="70%" src={d.data[0]}></img>
            </> 
            }
            </div>
            ),
        nodeLabels: d => {
            return d.depth > 1 ? null : (
            <g>
                <text fontSize="1.5em" textAnchor="middle" fill={"#9fd0cb"} stroke={"black"}>
                    {d.inDegree > 0 ? d.data[0] : null}
                </text>
            </g>
            )
        },
    };

    //MUI toggles

    const [expand, setExpand] = React.useState(true); //alert
    const [open, setOpen] = React.useState(false); //showdata
    const [scroll, setScroll] = React.useState('paper'); //rawdata

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    }; //showdata

    const handleClose = () => {
        setOpen(false);
    }; //showdata

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
        }
    }, [open]); //rawdata

    return (
             <TransformWrapper defaultScale={1}>
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <React.Fragment>
                        <div>
                            <Collapse in={expand}>
                                <Alert severity="info"
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setExpand(false);
                                            }}
                                            >
                                            <Close fontSize="inherit" />
                                        </IconButton>
                                    }
                                >
                                    <AlertTitle>
                                        These are countries/regions with confirmed cases.
                                    </AlertTitle>
                                    <strong>
                                        Mouse over data points for additional details.
                                    </strong>
                                </Alert>
                            </Collapse>
                        </div>
                        <div className="svg-menu">
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                            >
                                <Button onClick={resetTransform} endIcon={<Refresh />} variant="contained" color="primary">Reset Zoom</Button>
                                <div className="selection-container">
                                    <Button onClick={() => {setExpand(true)}} disabled={expand} variant="contained" color="primary" style={{marginRight:"5px", color:"white"}}>
                                        <Info/>
                                    </Button>
                                    <Button onClick={handleClickOpen('paper')} endIcon={<TableChart />} variant="contained" color="primary">Show raw data</Button>
                                </div>
                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    scroll={scroll}
                                    aria-labelledby="scroll-dialog-title"
                                    aria-describedby="scroll-dialog-description"
                                    fullWidth={true}
                                    maxWidth="lg"
                                >
                                    <DialogTitle id="scroll-dialog-title">COVID19 Cases (All Time)</DialogTitle>
                                    <DialogContent dividers={scroll === 'paper'}>
                                        <TableContainer component={Paper}>
                                            <Table aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Country</TableCell>
                                                        <TableCell align="right">Total confirmed cases</TableCell>
                                                        <TableCell align="right">% Global cases</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {arrangeAllData(countriesByCases).map((data, index) => {
                                                        return (
                                                            <>
                                                                <TableRow key={index}>
                                                                    <TableCell component="th" scope="row">
                                                                    {data.country}
                                                                    </TableCell>
                                                                    <TableCell align="right">{data.totalconfirmed}</TableCell>
                                                                    <TableCell align="right">{data.globalpercent}%</TableCell>
                                                                </TableRow>
                                                            </>
                                                            )
                                                        })}
                                                    </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary" variant="outlined">
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Grid>
                        </div>
                        <div className="transform-container">    
                            <TransformComponent>
                                <NetworkFrame {...frameProps}/>
                            </TransformComponent>
                            <LegendDemo title="% Confirmed">
                                <LegendThreshold scale={thresholdScale}>
                                    {labels => {
                                        return labels.reverse().map((label, i) => {
                                        const size = 15;
                                        return (
                                            <LegendItem
                                                key={`legend-quantile-${i}`}
                                                margin="1px 0"
                                            >
                                                <svg width={size} height={size}>
                                                    <rect fill={label.value} width={size} height={size} />
                                                </svg>
                                                <LegendLabel align={'left'} margin={'2px 0 0 10px'}>
                                                    {label.text}
                                                </LegendLabel>
                                            </LegendItem>
                                        );
                                        });
                                    }}
                                </LegendThreshold>
                            </LegendDemo>
                        </div>
                    </React.Fragment>
                )}
            </TransformWrapper>
    )

}