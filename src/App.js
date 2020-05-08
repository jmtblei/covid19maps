import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import { fetchSummaryData } from "./actions/index";
import TopNav from "./components/TopNav";
import CasesAT from "./components/CasesAT";
import Cases24H from "./components/Cases24H";
import Deaths24H from "./components/Deaths24H";
import DeathsAT from "./components/DeathsAT";
import About from "./components/About";
import { CircularProgress, Grid } from "@material-ui/core";

function App() {
  const dispatch = useDispatch();
  const isFetched = useSelector(state => state.isFetched);

  useEffect(() => {
    dispatch(fetchSummaryData())
  }, []);

  return (
    <div>
      <TopNav />
      <Switch>
        <Route exact path="/" render={() => !isFetched ? 
          <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <CircularProgress />
          </Grid> : 
          <CasesAT />} 
        />
        <Route exact path="/confirmed-24h" render={() => !isFetched ? 
          <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <CircularProgress />
          </Grid> : 
          <Cases24H />} 
        />
        <Route exact path="/deaths-24h" render={() => !isFetched ? 
          <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <CircularProgress />
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
            <CircularProgress />
          </Grid> : 
          <DeathsAT />} 
        />
          <Route exact path="/about" render={() => <About />} />
      </Switch>
    </div>
  );
}

export default App;
