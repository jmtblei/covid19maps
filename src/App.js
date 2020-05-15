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
import About from "./components/About";
import Footer from "./components/Footer";
import { CircularProgress, Grid } from "@material-ui/core";

function App() {
  const dispatch = useDispatch();
  const isFetched = useSelector(state => state.isFetched);
  const isFetched2 = useSelector(state => state.isFetched2)

  useEffect(() => {
    dispatch(fetchNovelDataCountry())
  }, []);

  useEffect(() => {
    dispatch(fetchNovelDataCountryYD())
  }, []);

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
            <CircularProgress color="secondary" size="10em"/>
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
            <CircularProgress color="secondary" size="10em"/>
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
            <CircularProgress color="secondary" size="10em"/>
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
            <CircularProgress color="secondary" size="10em"/>
          </Grid> : 
            <DeathsAT />} 
          />
          <Route exact path="/about" render={() => <About />} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
