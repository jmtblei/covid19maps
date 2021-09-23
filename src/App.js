import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import "./App.css"
import { fetchNovelDataCountry, fetchNovelDataCountryYD } from "./actions/index";
import TopNav from "./components/TopNav";
import CasesAT from "./components/CasesAT";
import Cases24H from "./components/Cases24H";
import Deaths24H from "./components/Deaths24H";
import DeathsAT from "./components/DeathsAT";
import RecoveredAT from "./components/RecoveredAT";
import Footer from "./components/Footer";
import { CircularProgress, Grid } from "@material-ui/core";

function App() {
  const dispatch = useDispatch();
  const isFetched = useSelector(state => state.isFetched);
  const isFetched2 = useSelector(state => state.isFetched2)

  useEffect(() => {
    let timer = setInterval(() => {
      dispatch(fetchNovelDataCountry())
    }, 5000);
    return () => clearInterval(timer);
  },);

  useEffect(() => {
    let timer = setInterval(() => {
      dispatch(fetchNovelDataCountryYD())
    }, 5000);
    return () => clearInterval(timer);
  },);

  return (
    <div className="App">
      <TopNav />
      <Switch>
        <Route exact path="/" render={() => !isFetched ? 
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
        <Route exact path="/confirmed-24h" render={() => !isFetched2 ? 
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
        <Route exact path="/deaths-24h" render={() => !isFetched2 ? 
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
        <Route exact path="/deaths-all-time" render={() => !isFetched ? 
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
        <Route exact path="/recoveries-all-time" render={() => !isFetched ? 
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
