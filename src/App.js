import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import { fetchSummaryData } from "./actions/index";
import TopNav from "./components/TopNav";
import CasesAT from "./components/CasesAT";
import Cases24H from "./components/Cases24H";
import Deaths24H from './components/Deaths24H';
import DeathsAT from './components/DeathsAT';

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
        <Route exact path="/" render={() => !isFetched ? <div>Loading...</div> : <CasesAT />} />
          <Route exact path="/confirmed-24h" render={() => !isFetched ? <div>Loading...</div> : <Cases24H />} />
          <Route exact path="/deaths-24h" render={() => !isFetched ? <div>Loading...</div> : <Deaths24H />} />
          <Route exact path="/deaths-all-time" render={() => !isFetched ? <div>Loading...</div> : <DeathsAT />} />
      </Switch>
    </div>
  );
}

export default App;
