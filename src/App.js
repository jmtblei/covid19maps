import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import { fetchSummaryData } from "./actions/index";
import View from "./components/View";

function App() {
  const dispatch = useDispatch();
  const isFetched = useSelector(state => state.isFetched);

  useEffect(() => {
    dispatch(fetchSummaryData())
  }, []);

  return (
    <div>
      <Switch>
        <Route exact path="/" render={() => !isFetched ? <div>Loading...</div> : <View />} />
      </Switch>
    </div>
  );
}

export default App;
