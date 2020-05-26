import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Svg, Text, Circle } from "@potion/element";
import { Pack } from "@potion/layout";
import { 
    Tooltip, 
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
import { Close, TableChart, Refresh, Visibility, VisibilityOff, Info } from "@material-ui/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Alert, AlertTitle } from "@material-ui/lab";
import * as d3 from "d3";
import * as d3Array from "d3-array"
import * as d3Hierarchy from "d3-hierarchy";
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

    const contChange = (countryChange, regionChange) => {
        return ((countryChange / regionChange) * 100).toFixed(4)
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
                continent: datum.continent,
                recovered: datum.recovered
            }
        })
    };

    const arrangeRegionData = (data) => {
        let regionChange = data.reduce((a, c) => a + c.totaldeaths, 0);
        return data.map(datum => {
            return {
                ...datum,
                regionpercent: contChange(datum.totaldeaths, regionChange)
            }
        })
    };

    const covidContinents = d3Array.group(arrangeAllData(countriesByDeaths), d => d.continent);
    // console.log("coviddata", covidContinents);

    const continentData = Array.from(covidContinents, ([key, value, globalvalue]) => ({
            key, 
            value: value.reduce((a, c) => a + c.totaldeaths, 0), 
            globalvalue: value.reduce((a, c) => a + c.globalpercent, 0)
        })).slice(0, -1);
    // console.log("continentData", continentData)

    const continentChildren = Array.from(covidContinents, ([key, value, children]) => ({key, value: value.reduce((a, c) => a + c.totaldeaths, 0), children: value}));
    const NorthAmericaData = continentChildren.filter(n => n.key === "North America");
    const SouthAmericaData = continentChildren.filter(n => n.key === "South America");
    const EuropeData = continentChildren.filter(n => n.key === "Europe");
    const AsiaData = continentChildren.filter(n => n.key === "Asia");
    const AfricaData = continentChildren.filter(n => n.key === "Africa");
    const AusOceData = continentChildren.filter(n => n.key === "Australia/Oceania");

    // const continentsum = d3Array.rollup(arrangeAllData(countriesByDeaths), v => d3.sum(v, d => d.totaldeaths), v => v.continent, v => v.country);
    // const continentsum = d3Array.rollup(countryData, v => d3.sum(v, d => d.deaths), v => v.continent, v => v.country)
    // console.log("continentsum", continentsum);

    // const childrenAccessor = ([ key, value ]) => value.size && Array.from(value);

    // const hierarchydata = 
    //     d3Hierarchy.hierarchy([null, continentsum], childrenAccessor)
    //     .sum(([ key, value ]) => value)
    //     .sort((a, b) => b.value - a.value)
    // console.log("hierdata", hierarchydata)

    // const circlepack = () => d3.pack()
    //     .size([window.innerWidth, (window.innerHeight * .65)])
    //     .padding(1)
    //     (hierarchydata)

    //SELECTION-------------------------------------------------------------
    const [selection, setSelection] = React.useState("Continents");

    const handleChange = (e) => {
        setSelection(e.target.value)
    };

    const [toggleRegion, setToggleRegion] = React.useState(false);
    const [toggleFlag, setToggleFlag] = React.useState(true);
    //-------------------------------------------------------------------------------------------
    let colorChange;
    let colorRegionChange;

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

    const globalChange = (data) => {
        switch (selection) {
            case "Continents": {
                colorChange = data.totaldeaths === 0 ? "#FFFFFF" 
                : data.globalvalue <= .1 ? "#ffffcc" 
                : data.globalvalue <= .5 ? "#ffeda0"
                : data.globalvalue <= 1 ? "#fed976"
                : data.globalvalue <= 2.5 ? "#feb24c"
                : data.globalvalue <= 5 ? "#fd8d3c"
                : data.globalvalue <= 7.5 ? "#fc4e2a"
                : data.globalvalue <= 10 ? "#e31a1c"
                : "#b10026";
                return (
                    colorChange
                )
            }
            case "Global": {
                colorChange = data.totaldeaths === 0 ? "#FFFFFF" 
                : data.globalpercent <= .1 ? "#ffffcc" 
                : data.globalpercent <= .5 ? "#ffeda0"
                : data.globalpercent <= 1 ? "#fed976"
                : data.globalpercent <= 2.5 ? "#feb24c"
                : data.globalpercent <= 5 ? "#fd8d3c"
                : data.globalpercent <= 7.5 ? "#fc4e2a"
                : data.globalpercent <= 10 ? "#e31a1c"
                : "#b10026";
                return (
                    colorChange
                )
            }
            case "North America": {
                colorChange = data.totaldeaths === 0 ? "#FFFFFF" 
                : data.globalpercent <= .1 ? "#ffffcc" 
                : data.globalpercent <= .5 ? "#ffeda0"
                : data.globalpercent <= 1 ? "#fed976"
                : data.globalpercent <= 2.5 ? "#feb24c"
                : data.globalpercent <= 5 ? "#fd8d3c"
                : data.globalpercent <= 7.5 ? "#fc4e2a"
                : data.globalpercent <= 10 ? "#e31a1c"
                : "#b10026";
                return (
                    colorChange
                )
            }
            case "South America": {
                colorChange = data.totaldeaths === 0 ? "#FFFFFF" 
                : data.globalpercent <= .1 ? "#ffffcc" 
                : data.globalpercent <= .5 ? "#ffeda0"
                : data.globalpercent <= 1 ? "#fed976"
                : data.globalpercent <= 2.5 ? "#feb24c"
                : data.globalpercent <= 5 ? "#fd8d3c"
                : data.globalpercent <= 7.5 ? "#fc4e2a"
                : data.globalpercent <= 10 ? "#e31a1c"
                : "#b10026";
                return (
                    colorChange
                )
            }
            case "Europe": {
                colorChange = data.totaldeaths === 0 ? "#FFFFFF" 
                : data.globalpercent <= .1 ? "#ffffcc" 
                : data.globalpercent <= .5 ? "#ffeda0"
                : data.globalpercent <= 1 ? "#fed976"
                : data.globalpercent <= 2.5 ? "#feb24c"
                : data.globalpercent <= 5 ? "#fd8d3c"
                : data.globalpercent <= 7.5 ? "#fc4e2a"
                : data.globalpercent <= 10 ? "#e31a1c"
                : "#b10026";
                return (
                    colorChange
                )
            }
            case "Asia": {
                colorChange = data.totaldeaths === 0 ? "#FFFFFF" 
                : data.globalpercent <= .1 ? "#ffffcc" 
                : data.globalpercent <= .5 ? "#ffeda0"
                : data.globalpercent <= 1 ? "#fed976"
                : data.globalpercent <= 2.5 ? "#feb24c"
                : data.globalpercent <= 5 ? "#fd8d3c"
                : data.globalpercent <= 7.5 ? "#fc4e2a"
                : data.globalpercent <= 10 ? "#e31a1c"
                : "#b10026";
                return (
                    colorChange
                )
            }
            case "Africa": {
                colorChange = data.totaldeaths === 0 ? "#FFFFFF" 
                : data.globalpercent <= .1 ? "#ffffcc" 
                : data.globalpercent <= .5 ? "#ffeda0"
                : data.globalpercent <= 1 ? "#fed976"
                : data.globalpercent <= 2.5 ? "#feb24c"
                : data.globalpercent <= 5 ? "#fd8d3c"
                : data.globalpercent <= 7.5 ? "#fc4e2a"
                : data.globalpercent <= 10 ? "#e31a1c"
                : "#b10026";
                return (
                    colorChange
                )
            }
            case "Australia/Oceania": {
                colorChange = data.totaldeaths === 0 ? "#FFFFFF" 
                : data.globalpercent <= .1 ? "#ffffcc" 
                : data.globalpercent <= .5 ? "#ffeda0"
                : data.globalpercent <= 1 ? "#fed976"
                : data.globalpercent <= 2.5 ? "#feb24c"
                : data.globalpercent <= 5 ? "#fd8d3c"
                : data.globalpercent <= 7.5 ? "#fc4e2a"
                : data.globalpercent <= 10 ? "#e31a1c"
                : "#b10026";
                return (
                    colorChange
                )
            }
            default: {
                return selection
            }
        }
    };

    const regionChange = (data) => {
        colorRegionChange = data.totaldeaths === 0 ? "#FFFFFF" 
            : data.regionpercent <= .1 ? "#ffffcc" 
            : data.regionpercent <= .5 ? "#ffeda0"
            : data.regionpercent <= 1 ? "#fed976"
            : data.regionpercent <= 2.5 ? "#feb24c"
            : data.regionpercent <= 5 ? "#fd8d3c"
            : data.regionpercent <= 7.5 ? "#fc4e2a"
            : data.regionpercent <= 10 ? "#e31a1c"
            : "#b10026";
            return (
                colorRegionChange
            )
    };

    //DETAILED DATA------------------------------------------------------
    const [expand, setExpand] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
        }
    }, [open]);

    //RENDER---------------------------------------------------------------------
    let pageRender = (relationalData, continentName) => (
        <div>
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
                                        {
                                            toggleRegion ? 
                                            <>
                                            These are the countries in {continentName} with confirmed deaths, compared globally
                                            </>
                                            :
                                            <>
                                            These are the countries in {continentName} with confirmed deaths, compared regionally
                                            </>
                                        }
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
                                <form className="form-selection">
                                    <select name="choose-region" id="choose-region" onChange={handleChange}>
                                        <option value="Continents">Continents</option>
                                        <option value="Global">Global</option>
                                        <option value="North America">North America</option>
                                        <option value="South America">South America</option>
                                        <option value="Europe">Europe</option>
                                        <option value="Asia">Asia</option>
                                        <option value="Africa">Africa</option>
                                        <option value="Australia/Oceania">Australia/Oceania</option>
                                    </select>
                                </form>
                                <div className="selection-container">
                                    <Button onClick={() => {setExpand(true)}} disabled={expand} variant="contained" color="primary" style={{marginRight:"5px", color:"white"}}>
                                        <Info/>
                                    </Button>
                                    <Button onClick={() => setToggleRegion(!toggleRegion)} variant="contained" color="primary" style={{marginRight:"5px"}}>
                                        {toggleRegion ? "Region" : "Global"}
                                    </Button>
                                    {   toggleFlag ?
                                        <Button endIcon={<Visibility />} onClick={() => setToggleFlag(!toggleFlag)} variant="contained" color="primary" style={{marginRight:"5px"}}>
                                            Flags
                                        </Button>
                                        :
                                        <Button endIcon={<VisibilityOff />} onClick={() => setToggleFlag(!toggleFlag)} variant="contained" color="primary" style={{marginRight:"5px"}}>
                                            Flags
                                        </Button>
                                    }
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
                                                        <TableCell align="right">% Of all deaths in {continentName}</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                    <TableBody>
                                                        {relationalData.map((data, index) => {
                                                            return (
                                                                <>
                                                                    <TableRow key={index}>
                                                                        <TableCell component="th" scope="row">
                                                                            {data.country}
                                                                        </TableCell>
                                                                        <TableCell align="right">{data.totaldeaths}</TableCell>
                                                                        <TableCell align="right">{data.globalpercent}%</TableCell>
                                                                        <TableCell align="right">{data.regionpercent}%</TableCell>
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
                            <div className="transform-container">
                                <TransformComponent>
                                    <Svg width={window.innerWidth * .8} height={window.innerHeight * .7} className="svg-content">
                                        {
                                            toggleRegion ?
                                        <Pack
                                            data={{children: relationalData}}
                                            sum={datum => datum.globalpercent}
                                            size={[window.innerWidth * .8, (window.innerHeight * .65)]}
                                            includeRoot={false}
                                            padding={5}
                                        >
                                            {nodes => nodes.map(({ x, y, r, data, key }) => (
                                            <>
                                                {globalChange(data)}
                                                <Tooltip title={
                                                    <Fragment>
                                                        <h2>{data.country}</h2>
                                                        <h2>Total confirmed deaths: {data.totaldeaths}</h2>
                                                        <h2>% Global deaths: {data.globalpercent}%</h2>
                                                        <img src={data.countryflag}/>
                                                    </Fragment>
                                                }>
                                                    <Circle
                                                        key={key}
                                                        cx={x}
                                                        cy={y}
                                                        r={r}
                                                        fill={colorChange}
                                                        stroke='#404040'
                                                    />
                                                </Tooltip>
                                                    {
                                                        toggleFlag ? 
                                                        <Text
                                                            x={x}
                                                            y={y}
                                                            fontSize={r*.3}
                                                        >
                                                            <tspan textAnchor="middle" dominantBaseline="after-edge">
                                                                {data.countrycode}
                                                            </tspan>
                                                        </Text>
                                                        :
                                                        <>
                                                        <Text
                                                            x={x}
                                                            y={y}
                                                            fontSize={r*.3}
                                                        >
                                                            <tspan textAnchor="middle" dominantBaseline="after-edge">
                                                                {data.countrycode}
                                                            </tspan>
                                                        </Text>
                                                        <image
                                                            x={x}
                                                            y={y}
                                                            width={r*.7}
                                                            height={r*.7}
                                                            href={data.countryflag}
                                                        >
                                                        </image>
                                                        </>
                                                    }
                                            </>
                                            ))}
                                        </Pack>
                                        :
                                        <Pack
                                            data={{children: relationalData}}
                                            sum={datum => datum.regionpercent}
                                            size={[window.innerWidth * .8, (window.innerHeight * .65)]}
                                            includeRoot={false}
                                            padding={5}
                                        >
                                            {nodes => nodes.map(({ x, y, r, data, key }) => (
                                            <>
                                                {regionChange(data)}
                                                <Tooltip title={
                                                    <Fragment>
                                                        <h2>{data.country}</h2>
                                                        <h2>Total confirmed deaths: {data.totaldeaths}</h2>
                                                        <h2>% Of all deaths in {continentName}: {data.regionpercent}%</h2>
                                                        <img src={data.countryflag}/>
                                                    </Fragment>
                                                }>
                                                    <Circle
                                                        key={key}
                                                        cx={x}
                                                        cy={y}
                                                        r={r}
                                                        fill={colorRegionChange}
                                                        stroke='#404040'
                                                    />
                                                </Tooltip>
                                                    {
                                                        toggleFlag ? 
                                                        <Text
                                                            x={x}
                                                            y={y}
                                                            fontSize={r*.3}
                                                        >
                                                            <tspan textAnchor="middle" dominantBaseline="after-edge">
                                                                {data.countrycode}
                                                            </tspan>
                                                        </Text>
                                                        :
                                                        <>
                                                        <Text
                                                            x={x}
                                                            y={y}
                                                            fontSize={r*.3}
                                                        >
                                                            <tspan textAnchor="middle" dominantBaseline="after-edge">
                                                                {data.countrycode}
                                                            </tspan>
                                                        </Text>
                                                        <image
                                                            x={x}
                                                            y={y}
                                                            width={r*.7}
                                                            height={r*.7}
                                                            href={data.countryflag}
                                                        >
                                                        </image>
                                                        </>
                                                    }
                                            </>
                                            ))}
                                        </Pack>
                                        }
                                    </Svg>
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
                        </div>
                    </React.Fragment>
                )}
                </TransformWrapper>
            </div>
    )
    
    return (
        <div>
            {
            selection === "North America" ?
            pageRender(arrangeRegionData(NorthAmericaData[0].children), selection)
            : 
            selection === "South America" ?
            pageRender(arrangeRegionData(SouthAmericaData[0].children), selection)
            :
            selection === "Europe" ?
            pageRender(arrangeRegionData(EuropeData[0].children), selection)
            :
            selection === "Asia" ?
            pageRender(arrangeRegionData(AsiaData[0].children), selection)
            :
            selection === "Africa" ?
            pageRender(arrangeRegionData(AfricaData[0].children), selection)
            :
            selection === "Australia/Oceania" ?
            pageRender(arrangeRegionData(AusOceData[0].children), selection)
            :
            selection === "Global" ?
            <div>
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
                                        These are the top countries worldwide (max. 50) with the most confirmed deaths 
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
                                <form className="form-selection">
                                    <select name="choose-region" id="choose-region" onChange={handleChange}>
                                        <option value="Continents">Continents</option>
                                        <option value="Global">Global</option>
                                        <option value="North America">North America</option>
                                        <option value="South America">South America</option>
                                        <option value="Europe">Europe</option>
                                        <option value="Asia">Asia</option>
                                        <option value="Africa">Africa</option>
                                        <option value="Australia/Oceania">Australia/Oceania</option>
                                    </select>
                                </form>
                                <div className="selection-container">
                                    {   toggleFlag ?
                                        <Button endIcon={<Visibility />} onClick={() => setToggleFlag(!toggleFlag)} variant="contained" color="primary" style={{marginRight:"5px"}}>
                                            Flags
                                        </Button>
                                        :
                                        <Button endIcon={<VisibilityOff />} onClick={() => setToggleFlag(!toggleFlag)} variant="contained" color="primary" style={{marginRight:"5px"}}>
                                            Flags
                                        </Button>
                                    }
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
                                                        {arrangeAllData(countriesByDeaths.slice(0, 50)).map((data, index) => {
                                                            return (
                                                                <>
                                                                    <TableRow key={index}>
                                                                        <TableCell component="th" scope="row">
                                                                            {data.country}
                                                                        </TableCell>
                                                                        <TableCell align="right">{data.totaldeaths}</TableCell>
                                                                        <TableCell align="right">{data.globalpercent.toFixed(4)}%</TableCell>
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
                            <div className="transform-container">
                                <TransformComponent>
                                    <Svg width={window.innerWidth * .8} height={window.innerHeight * .7} className="svg-content">
                                        <Pack
                                            data={{children: arrangeAllData(countriesByDeaths.slice(0, 50))}}
                                            sum={datum => datum.totaldeaths}
                                            size={[window.innerWidth * .8, (window.innerHeight * .65)]}
                                            includeRoot={false}
                                            padding={5}
                                        >
                                            {nodes => nodes.map(({ x, y, r, data, key }) => (
                                            <>
                                                {globalChange(data)}
                                                <Tooltip title={
                                                    <Fragment>
                                                        <h2>{data.country}</h2>
                                                        <h2>Total confirmed deaths: {data.totaldeaths}</h2>
                                                        <h2>% Global deaths: {data.globalpercent.toFixed(4)}%</h2>
                                                        <img src={data.countryflag}/>
                                                    </Fragment>
                                                }>
                                                    <Circle
                                                        key={key}
                                                        cx={x}
                                                        cy={y}
                                                        r={r}
                                                        fill={colorChange}
                                                        stroke='#404040'
                                                    />
                                                </Tooltip>
                                                    {
                                                        toggleFlag ? 
                                                        <Text
                                                            x={x}
                                                            y={y}
                                                            fontSize={r*.3}
                                                        >
                                                            <tspan textAnchor="middle" dominantBaseline="after-edge">
                                                                {data.countrycode}
                                                            </tspan>
                                                        </Text>
                                                        :
                                                        <>
                                                        <Text
                                                            x={x}
                                                            y={y}
                                                            fontSize={r*.3}
                                                        >
                                                            <tspan textAnchor="middle" dominantBaseline="after-edge">
                                                                {data.countrycode}
                                                            </tspan>
                                                        </Text>
                                                        <image
                                                            x={x}
                                                            y={y}
                                                            width={r*.7}
                                                            height={r*.7}
                                                            href={data.countryflag}
                                                        >
                                                        </image>
                                                        </>
                                                    }
                                            </>
                                            ))}
                                        </Pack>
                                    </Svg>
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
                        </div>
                    </React.Fragment>
                )}
                </TransformWrapper>
            </div>
            :
            <div>
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
                                        These are the continents with confirmed deaths
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
                                <form className="form-selection">
                                    <select name="choose-region" id="choose-region" onChange={handleChange}>
                                        <option value="Continents">Continents</option>
                                        <option value="Global">Global</option>
                                        <option value="North America">North America</option>
                                        <option value="South America">South America</option>
                                        <option value="Europe">Europe</option>
                                        <option value="Asia">Asia</option>
                                        <option value="Africa">Africa</option>
                                        <option value="Australia/Oceania">Australia/Oceania</option>
                                    </select>
                                </form>
                                <Button onClick={handleClickOpen('paper')} endIcon={<TableChart />} variant="contained" color="primary">Show raw data</Button>
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
                                                        <TableCell>Continent</TableCell>
                                                        <TableCell align="right">Total confirmed deaths</TableCell>
                                                        <TableCell align="right">% Global deaths</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                    <TableBody>
                                                        {continentData.map((data, index) => {
                                                            return (
                                                                <>
                                                                    <TableRow key={index}>
                                                                        <TableCell component="th" scope="row">
                                                                            {data.key}
                                                                        </TableCell>
                                                                        <TableCell align="right">{data.value}</TableCell>
                                                                        <TableCell align="right">{data.globalvalue.toFixed(4)}%</TableCell>
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
                            <div className="transform-container">
                                <TransformComponent>
                                    <Svg width={window.innerWidth * .8} height={window.innerHeight * .7} className="svg-content">
                                        <Pack
                                            data={{children: continentData}}
                                            sum={datum => datum.value}
                                            size={[window.innerWidth * .8, (window.innerHeight * .65)]}
                                            includeRoot={false}
                                            padding={5}
                                            nodeEnter={d => ({ ...d, r: 0 })}
                                            animate={true}
                                        >
                                            {nodes => nodes.map(({ x, y, r, data, key }) => (
                                            <>
                                                {globalChange(data)}
                                                <Tooltip title={
                                                    <Fragment>
                                                        <h2>{data.key}</h2>
                                                        <h2>Total confirmed deaths: {data.value}</h2>
                                                        <h2>% Global deaths: {data.globalvalue.toFixed(4)}%</h2>
                                                    </Fragment>
                                                }>
                                                    <Circle
                                                        key={key}
                                                        cx={x}
                                                        cy={y}
                                                        r={r}
                                                        fill={colorChange}
                                                        stroke='#404040'
                                                    />
                                                </Tooltip>
                                                    <Text
                                                        x={x}
                                                        y={y}
                                                        fontSize={r*.225}
                                                    >
                                                        <tspan textAnchor="middle" dominantBaseline="after-edge">
                                                            {data.key}
                                                        </tspan>
                                                    </Text>
                                            </>
                                            ))}
                                        </Pack>
                                    </Svg>
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
                        </div>
                    </React.Fragment>
                )}
                </TransformWrapper>
            </div>
            }
        </div>
    );
}
