import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Link } from "react-router-dom";
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
    Menu,
    MenuItem
} from "@material-ui/core";
import { Close, TableChart, Refresh, FilterList } from "@material-ui/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Colorscale } from "react-colorscales";

export default () => {
    const countryData = useSelector(state => state.countryData);

    const top50AllCases = countryData
        .filter(data => data.cases > 0)
        .sort((a, b) => b.cases - a.cases).slice(0, 50)
    // console.log("all confirmed cases", top50AllCases);

    const percentageChange = (countryChange, globalChange) => {
        return ((countryChange / globalChange) * 100).toFixed(2)
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
    }
    
    const arrange50AllCasesData = (data) => {
        let globalChange = data.reduce((a, c) => a + c.cases, 0);
        return data.map(datum => {
            return {
                key: datum.id,
                value: percentageChange(datum.cases, globalChange),
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
    
    const graphColors = ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a" , "#e31a1c", "#b10026"];

    const colorCode = (data) => {
        colorChange = data.totalconfirmed === 0 ? "#FFFFFF" 
        : data.value <= .1 ? "#ffffcc" 
        : data.value <= .5 ? "#ffeda0"
        : data.value <= 1 ? "#fed976"
        : data.value <= 2.5 ? "#feb24c"
        : data.value <= 5 ? "#fd8d3c"
        : data.value <= 7.5 ? "#fc4e2a"
        : data.value <= 10 ? "#e31a1c"
        : "#b10026";
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

    //FILTER
    const [anchorEl, setAnchorEl] = React.useState(null);

    const toggleClick = event => {
      setAnchorEl(event.currentTarget);
    };
  
    const toggleClose = () => {
      setAnchorEl(null);
    };
    
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
                            These are the top 50 countries with the most confirmed cases
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
                    <div className="svg-menu">
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Button onClick={resetTransform} endIcon={<Refresh />} variant="contained" color="primary">Reset Zoom</Button>
                            <Button 
                                aria-controls="simple-menu" 
                                aria-haspopup="true" 
                                onClick={toggleClick}
                                endIcon={<FilterList />} 
                                variant="contained" 
                                color="primary"
                            >
                                Filter by view
                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={toggleClose}
                            >
                                    <MenuItem onClick={toggleClose} component={Link} to="/">Confirmed Cases (All Time)</MenuItem>
                                    <MenuItem onClick={toggleClose} component={Link} to="/confirmed-24h">Confirmed Cases (24H)</MenuItem>
                                    <MenuItem onClick={toggleClose} component={Link} to="/deaths-24h">Confirmed Deaths (24H)</MenuItem>
                                    <MenuItem onClick={toggleClose} component={Link} to="/deaths-all-time">Confirmed Deaths (All Time)</MenuItem>
                            </Menu>
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
                                                    <TableCell align="right">Total confirmed cases</TableCell>
                                                    <TableCell align="right">% Global cases</TableCell>
                                                    <TableCell align="right">Date updated</TableCell>
                                                </TableRow>
                                            </TableHead>
                                                <TableBody>
                                                    {arrange50AllCasesData(top50AllCases).map((data, index) => {
                                                        return (
                                                            <>
                                                                <TableRow key={index}>
                                                                    <TableCell component="th" scope="row">
                                                                        {data.country}
                                                                    </TableCell>
                                                                    <TableCell align="right">{data.totalconfirmed}</TableCell>
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
                        <div className="colorbar">
                            <Colorscale 
                                colorscale={graphColors}
                            />
                        </div>
                        <div className="colorscale">
                            <h5>&lt;= .1% cases</h5>
                            <h5>&lt;= .2% cases</h5>
                            <h5>&lt;= .5% cases</h5>
                            <h5>&lt;= 1% cases</h5>
                            <h5>&lt;= 2% cases</h5>
                            <h5>&lt;= 5% cases</h5>
                            <h5>&lt;= 7.5% cases</h5>
                            <h5>&gt;= 10% cases</h5>
                        </div>
                        <TransformComponent>
                            <Svg width={window.innerWidth - 50} height={window.innerHeight * .7} className="svg-content">
                                <Pack
                                    data={{children: arrange50AllCasesData(top50AllCases)}}
                                    sum={datum => datum.value}
                                    size={[window.innerWidth, (window.innerHeight * .65)]}
                                    includeRoot={false}
                                    padding={5}
                                >
                                    {nodes => nodes.map(({ x, y, r, data, key }) => (
                                    <>
                                        {colorCode(data)}
                                        <Tooltip title={
                                            <Fragment>
                                                <h2>{data.country}</h2>
                                                <h2>Total confirmed cases: {data.totalconfirmed}</h2>
                                                <h2>% Global cases: {data.value}%</h2>
                                                <h2>Date Updated: {data.dateupdated}</h2>
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