import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import "./App.css"
import { fetchNewsData, fetchNovelDataCountry, fetchNovelDataCountryYD } from "./actions/index";
import TopNav from "./components/TopNav";
import News from "./components/News";
import CasesAT from "./components/CasesAT";
import Cases24H from "./components/Cases24H";
import Deaths24H from "./components/Deaths24H";
import DeathsAT from "./components/DeathsAT";
import RecoveredAT from "./components/RecoveredAT";
import Footer from "./components/Footer";
import { CircularProgress, Grid } from "@material-ui/core";

function App() {
  const dispatch = useDispatch();
  const isFetchedData = useSelector(state => state.isFetchedData);
  const isFetchedDataYD = useSelector(state => state.isFetchedDataYD)
  const isFetchedDataNews = useSelector(state => state.isFetchedDataNews)

  useEffect(() => {
      dispatch(fetchNovelDataCountry())
  });

  useEffect(() => {
      dispatch(fetchNovelDataCountryYD())
  });

  useEffect(() => {
    dispatch(fetchNewsData())
  });

  return (
    <div className="App">
      <TopNav />
      <Switch>
        <Route exact path="/" render={() => !isFetchedDataNews ? 
          <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <CircularProgress color="primary" size="10em"/>
          </Grid> : 
            <News />} 
          />
        <Route exact path="/cases-all-time" render={() => !isFetchedData ? 
          <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <CircularProgress color="primary" size="10em"/>
          </Grid> : 
            <CasesAT />} 
          />  
        <Route exact path="/confirmed-24h" render={() => !isFetchedDataYD ? 
          <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <CircularProgress color="primary" size="10em"/>
          </Grid> : 
            <Cases24H />} 
          />
        <Route exact path="/deaths-24h" render={() => !isFetchedDataYD ? 
          <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <CircularProgress color="primary" size="10em"/>
          </Grid> : 
            <Deaths24H />}
          />
        <Route exact path="/deaths-all-time" render={() => !isFetchedData ? 
          <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <CircularProgress color="primary" size="10em"/>
          </Grid> : 
            <DeathsAT />} 
          />
        <Route exact path="/recoveries-all-time" render={() => !isFetchedData ? 
          <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <CircularProgress color="primary" size="10em"/>
          </Grid> : 
            <RecoveredAT />} 
          />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
