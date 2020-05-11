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
import { Close, TableChart, Refresh } from "@material-ui/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Alert, AlertTitle } from "@material-ui/lab";

export default () => {
    const countryData = useSelector(state => state.countryData);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
    }
    
    const percentageChange = (countryChange, globalChange) => {
        return ((countryChange / globalChange) * 100).toFixed(2)
    };

    //TOP 50 COUNTRIES BY CONFIRMED DEATHS (All Time)---------------------------------------------
    const top50AllDeaths = countryData
        .filter(data => data.deaths > 0)
        .sort((a, b) => b.deaths - a.deaths).slice(0, 50)
    // console.log("all-time confirmed deaths", top50AllDeaths);

    const arrange50AllDeathsData = (data) => {
        let globalChange = data.reduce((a, c) => a + c.deaths, 0);
        return data.map(datum => {
            return {
                key: datum.countryInfo._id,
                value: percentageChange(datum.deaths, globalChange),
                country: datum.country,
                countrycode: datum.countryInfo.iso2,
                countryflag: datum.countryInfo.flag,
                dateupdated: formatDate(datum.updated),
                totalconfirmed: datum.cases,
                totaldeaths: datum.deaths,
                newcases: datum.todayCases,
                newdeaths: datum.todayDeaths
            }
        })
    };
    //-------------------------------------------------------------------------------------------
    let colorChange;

    const colorCode = (data) => {
        colorChange = data.totaldeaths === 0 ? "#DEF5FF" 
        : data.value <= .1 ? "#FFFFFF" 
        : data.value <= .5 ? "#D0D0D0"
        : data.value <= 1 ? "#FFFF00"
        : data.value <= 2 ? "#F4C430"
        : data.value <= 5 ? "#FFA000"
        : data.value <= 7.5 ? "#FF681F"
        : data.value <= 10 ? "#9B2D01"
        : "#860111";
        return (
            colorChange
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

    return (
        <div>
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
                            These are the top 50 countries with the most confirmed deaths
                        </AlertTitle>
                        <strong>
                            Mouse over data points for additional details.
                        </strong>
                    </Alert>
                </Collapse>
            </div>
            <TransformWrapper defaultScale={1}>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                <React.Fragment>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Button onClick={resetTransform} endIcon={<Refresh />} variant="contained" color="primary">Reset Zoom</Button>
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
                                                <TableCell>Country</TableCell>
                                                <TableCell align="right">Total confirmed deaths</TableCell>
                                                <TableCell align="right">% Global deaths</TableCell>
                                                <TableCell align="right">Date updated</TableCell>
                                            </TableRow>
                                        </TableHead>
                                            <TableBody>
                                                {arrange50AllDeathsData(top50AllDeaths).map((data, index) => {
                                                    return (
                                                        <>
                                                            <TableRow key={index}>
                                                                <TableCell component="th" scope="row">
                                                                    {data.country}
                                                                </TableCell>
                                                                <TableCell align="right">{data.totaldeaths}</TableCell>
                                                                <TableCell align="right">{data.value}</TableCell>
                                                                <TableCell align="right">{data.dateupdated}</TableCell>
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
                    <div className="svg">    
                        <TransformComponent>
                            <Svg width={window.innerWidth * .5} height={window.innerHeight * .9}>
                                <Pack
                                    data={{children: arrange50AllDeathsData(top50AllDeaths)}}
                                    sum={datum => datum.value}
                                    size={[window.innerWidth * .5, (window.innerHeight * .85)]}
                                    includeRoot={false}
                                    padding={5}
                                >
                                    {nodes => nodes.map(({ x, y, r, data, key }) => (
                                    <>
                                        {colorCode(data)}
                                        <Tooltip title={
                                            <Fragment>
                                                <h2>{data.country}</h2>
                                                <h2>Total confirmed deaths: {data.totaldeaths}</h2>
                                                <h2>% Global deaths: {data.value}%</h2>
                                                <h2>Date Updated: {data.dateupdated}</h2>
                                                <img src={data.countryflag}/>
                                            </Fragment>
                                        }>
                                            <Circle
                                                key={data.key}
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
                                                stroke="black"
                                            >
                                                <tspan textAnchor="middle" alignment-baseline="central">
                                                    {data.countrycode}
                                                </tspan>
                                            </Text>
                                    </>
                                    ))}
                                </Pack>
                            </Svg>
                        </TransformComponent>
                    </div>
                </React.Fragment>
            )}
            </TransformWrapper>
        </div>
    );
}