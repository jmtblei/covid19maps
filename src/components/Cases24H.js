import React, { useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
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
    Paper
} from "@material-ui/core";
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

    //TOP 50 COUNTRIES BY NEW CONFIRMED CASES (24H) ---------------------------------------------
    const top50NewCases = countryData
        .filter(data => data.NewConfirmed > 0)
        .sort((a, b) => b.NewConfirmed - a.NewConfirmed).slice(0, 50)
    //     // .map((a, index) => ({...a, id: uuidv4(index)}));
    // console.log("new confirmed cases", top50NewCases);

    const arrange50NewCasesData = (data) => {
        let globalChange = data.reduce((a, c) => a + c.NewConfirmed, 0);
        return data.map(datum => {
            return {
                key: datum.id,
                value: percentageChange(datum.NewConfirmed, globalChange),
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
    let colorChange;

    const colorCode = (data) => {
        colorChange = data.newcases === 0 ? "#DEF5FF" 
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
            top50NewCases.length == 0 ?
            <div>
                <Alert severity="info">
                    <AlertTitle>Info</AlertTitle>
                    <strong>
                        The database as reported no new confirmed cases.
                    </strong>
                </Alert>
            </div>
            :
            <div>
                <div>
                    <Alert severity="info">
                        <AlertTitle>
                            These are the countries with the most confirmed cases reported in the last 24 hours (max. 50 countries)
                        </AlertTitle>
                        <strong>
                            Mouse over data points for additional details.
                        </strong>
                    </Alert>
                </div>
                <div>
                    <Button onClick={handleClickOpen('paper')}>Show raw data</Button>
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
                            <div>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Country</TableCell>
                                                <TableCell align="right">New confirmed casess</TableCell>
                                                <TableCell align="right">% Global new cases</TableCell>
                                                <TableCell align="right">Date updated</TableCell>
                                            </TableRow>
                                        </TableHead>
                                            <TableBody>
                                                {arrange50NewCasesData(top50NewCases).map((data, index) => {
                                                    return (
                                                        <>
                                                        <TableRow key={index}>
                                                            <TableCell component="th" scope="row">
                                                                {data.country}
                                                            </TableCell>
                                                            <TableCell align="right">{data.newcases}</TableCell>
                                                            <TableCell align="right">{data.value}</TableCell>
                                                            <TableCell align="right">{data.dateupdated}</TableCell>
                                                        </TableRow>
                                                        </>
                                                    )
                                                })}
                                            </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <TransformWrapper defaultScale={1}>
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <React.Fragment>
                        <div>
                            <Button onClick={resetTransform} variant="outlined">Reset Zoom</Button>
                        </div>
                    <TransformComponent>
                    <Svg width={window.innerWidth} height={window.innerHeight - 100}>
                    <Pack
                        data={{children: arrange50NewCasesData(top50NewCases)}}
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
                                    <h2>New confirmed cases: {data.newcases}</h2>
                                    <h2>% Global new cases: {data.value}%</h2>
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