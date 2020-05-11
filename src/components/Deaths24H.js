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
import { Close, TableChart } from "@material-ui/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Alert, AlertTitle } from "@material-ui/lab";

export default () => {
    const countryDataYD = useSelector(state => state.countryDataYD);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
    }
    
    const percentageChange = (countryChange, globalChange) => {
        return ((countryChange / globalChange) * 100).toFixed(2)
    };

    //TOP 50 COUNTRIES BY NEW CONFIRMED DEATHS (24H)---------------------------------------------
    const top50NewDeaths = countryDataYD
        .filter(data => data.todayDeaths > 0)
        .sort((a, b) => b.todayDeaths - a.todayDeaths).slice(0, 50)
    // console.log("new confirmed deaths", top50NewDeaths);

    const arrange50NewDeathsData = (data) => {
        let globalChange = data.reduce((a, c) => a + c.todayDeaths, 0);
        return data.map(datum => {
            return {
                key: datum.countryInfo._id,
                value: percentageChange(datum.todayDeaths, globalChange),
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
            {
            top50NewDeaths.length === 0 ?
            <div>
                <div>
                    <Alert severity="info">
                        <AlertTitle>Info</AlertTitle>
                        <strong>
                            The database has reported no new confirmed deaths in the last 24 hours.
                        </strong>
                    </Alert>
                </div>
                <div>
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
                    <DialogTitle id="scroll-dialog-title">COVID19 Cases (All Time)</DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Country</TableCell>
                                        <TableCell align="right">New confirmed deaths (24H)</TableCell>
                                        <TableCell align="right">Date updated</TableCell>
                                    </TableRow>
                                </TableHead>
                                    <TableBody>
                                        {arrange50NewDeathsData(countryDataYD.filter(x => x.NewConfirmed === 0)).map((data, index) => {
                                            return (
                                                <>
                                                    <TableRow key={index}>
                                                        <TableCell component="th" scope="row">
                                                        {data.country}
                                                        </TableCell>
                                                        <TableCell align="right">{data.newdeaths}</TableCell>
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
                </div>
            </div>
            :
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
                                These are the countries with the most confirmed deaths reported in the last 24 hours (max. 50 countries)
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
                                <DialogTitle id="scroll-dialog-title">COVID19 Deaths (24H)</DialogTitle>
                                <DialogContent dividers={scroll === 'paper'}>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Country</TableCell>
                                                    <TableCell align="right">New confirmed deaths (24H)</TableCell>
                                                    <TableCell align="right">% Global new deaths</TableCell>
                                                    <TableCell align="right">Date updated</TableCell>
                                                </TableRow>
                                            </TableHead>
                                                <TableBody>
                                                    {arrange50NewDeathsData(top50NewDeaths).map((data, index) => {
                                                        return (
                                                            <>
                                                                <TableRow key={index}>
                                                                    <TableCell component="th" scope="row">
                                                                        {data.country}
                                                                    </TableCell>
                                                                    <TableCell align="right">{data.newdeaths}</TableCell>
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
                            <Button onClick={resetTransform} variant="outlined">Reset Zoom</Button>
                        </Grid>
                        <TransformComponent>
                            <Svg width={window.innerWidth} height={window.innerHeight - 100}>
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
                                                <img src={data.countryflag}/>
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