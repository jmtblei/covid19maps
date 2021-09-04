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
import NetworkFrame from "semiotic/lib/NetworkFrame";
import { scaleThreshold } from "@vx/scale";
import { LegendThreshold, LegendItem, LegendLabel } from "@vx/legend";

export default () => {
    const countryData = useSelector(state => state.countryData);
    // console.log("statedata", countryData)

    const countriesByDeaths = countryData
        .filter(data => data.deaths > 0)
        .sort((a, b) => b.deaths - a.deaths)
    // console.log("all confirmed deaths", countriesByDeaths);

    const worldChange = (countryChange, globalChange) => {
        return ((countryChange / globalChange) * 100).toFixed(4)
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
    };
    
    const arrangeAllData = (data) => {
        let globalChange = data.reduce((a, c) => a + c.deaths, 0);
        return data.map(datum => {
            return {
                globalpercent: parseFloat(worldChange(datum.deaths, globalChange)),
                country: datum.country,
                countrycode: datum.countryInfo.iso2,
                countryflag: datum.countryInfo.flag,
                dateupdated: formatDate(datum.updated),
                totalconfirmed: datum.cases,
                totaldeaths: datum.deaths,
                newcases: datum.todayCases,
                newdeaths: datum.todayDeaths,
                continent: datum.continent ? datum.continent : "Cruise Ships",
                recovered: datum.recovered
            }
        })
    };
    
    const continentsum = d3Array.rollup(arrangeAllData(countriesByDeaths), v => d3.sum(v, d => d.totaldeaths), v => v.continent, v => v.country, v => v.globalpercent, v => v.countryflag);
    // const continentsum = d3Array.rollup(countryData, v => d3.sum(v, d => d.deaths), v => v.continent, v => v.country, v => v.countryInfo);
    // console.log("continentsum", continentsum);
    
    const childrenAccessor = ([ key, value ]) => value.size && Array.from(value);
    
    const hierarchydata = 
    d3Hierarchy.hierarchy([null, continentsum], childrenAccessor)
    .sum(([ key, value ]) => value)
    .sort((a, b) => b.value - a.value)
    // console.log("hierdata", hierarchydata)

    //Legend scale VX
    const LegendDemo = ({ title, children }) => {
        return (
          <div className="legend" style={{color:"white"}}>
            <div className="title">{title}</div>
            {children}
            <div>Updated: {arrangeAllData(countriesByDeaths)[0].dateupdated}</div>
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
            : d.parent[0] > 10 ? "#b10026"
            : "none",
            stroke: d.depth === 1 ? "#9fd0cb" 
            : d.parent[0] <= .1 ? "#ffffcc" 
            : d.parent[0] <= .5 ? "#ffeda0"
            : d.parent[0] <= 1 ? "#fed976"
            : d.parent[0] <= 2.5 ? "#feb24c"
            : d.parent[0] <= 5 ? "#fd8d3c"
            : d.parent[0] <= 7.5 ? "#fc4e2a"
            : d.parent[0] <= 10 ? "#e31a1c"
            : d.parent[0] > 10 ? "#b10026"
            : "none",
            fillOpacity: 0.2,
        }),
        filterRenderedNodes: d => d.depth !== 0,

        /* --- Interact --- */
        hoverAnnotation: [
            { type: "desaturation-layer", style: { fill: "white", fillOpacity: 0.05 } },
            {
            type: "highlight",
            style: d => ({
                fill: d.depth === 1 ? "#9fd0cb" 
                : d.parent[0] <= .1 ? "#ffffcc" 
                : d.parent[0] <= .5 ? "#ffeda0"
                : d.parent[0] <= 1 ? "#fed976"
                : d.parent[0] <= 2.5 ? "#feb24c"
                : d.parent[0] <= 5 ? "#fd8d3c"
                : d.parent[0] <= 7.5 ? "#fc4e2a"
                : d.parent[0] <= 10 ? "#e31a1c"
                : d.parent[0] > 10 ? "#b10026"
                : "none",
                stroke: d.depth === 1 ? "#9fd0cb" 
                : d.parent[0] <= .1 ? "#ffffcc" 
                : d.parent[0] <= .5 ? "#ffeda0"
                : d.parent[0] <= 1 ? "#fed976"
                : d.parent[0] <= 2.5 ? "#feb24c"
                : d.parent[0] <= 5 ? "#fd8d3c"
                : d.parent[0] <= 7.5 ? "#fc4e2a"
                : d.parent[0] <= 10 ? "#e31a1c"
                : d.parent[0] > 10 ? "#b10026"
                : "none",
                fillOpacity: 0.8
            })
            },
            { type: "frame-hover" }
        ],

        /* --- Annotate --- */
        tooltipContent: d => (
            <div className="tooltip-content">
            {d.depth === 1 ? 
            <>
            <h3 style={{margin:5}}>{d.data[0]}</h3>
            <h5 style={{margin:5}}>{Number(d.value).toLocaleString()} Total deaths</h5>
            <h5 style={{margin:5}}>{parseFloat(worldChange(d.value, hierarchydata.value))}% Global deaths</h5>
            </>
            : 
            <>
            <h3 style={{margin:5}}>{d.parent.parent[0]}</h3>
            <h5 style={{margin:5}}>{Number(d.value).toLocaleString()} Confirmed deaths</h5>
            <h5 style={{margin:5}}>{Number(d.parent[0]).toLocaleString()}% Global deaths</h5>
            <img width="70%" height="70%" src={d.data[0]} alt=""></img>
            </> 
            }
            </div>
            ),
        nodeLabels: d => {
            return d.depth > 1 ? null : (
            <g>
                <text fontSize="1.5em" textAnchor="middle" fill={"white"} stroke={"black"}>
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
                                        These are countries/regions with confirmed deaths.
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
                                    <DialogTitle id="scroll-dialog-title">COVID19 Deaths (All Time)</DialogTitle>
                                    <DialogContent dividers={scroll === 'paper'}>
                                        <TableContainer component={Paper}>
                                            <Table aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Country</TableCell>
                                                        <TableCell align="right">Total confirmed deaths</TableCell>
                                                        <TableCell align="right">% Global deaths</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {arrangeAllData(countriesByDeaths).map((data, index) => {
                                                        return (
                                                            <>
                                                                <TableRow key={index}>
                                                                    <TableCell component="th" scope="row">
                                                                    {data.country}
                                                                    </TableCell>
                                                                    <TableCell align="right">{Number(data.totaldeaths).toLocaleString()}</TableCell>
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
                            <LegendDemo title="% Global">
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