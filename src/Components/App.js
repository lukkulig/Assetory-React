import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import AssetoryAppBar from './AssetoryAppBar';
import Overview from './Overview/Overview';
import ManageCategories from "./ManageCategories";
import AddAsset from "./AddAsset";

const RootRouter = () => {
  return (
      <Route
          render={() => (
              <Redirect to={{pathname: "/overview"}}/>
          )}
      />
  );
};

const InnerRouter = (props) => {
  return (
      <div>
        <AssetoryAppBar history={props.history}/>

        <Switch>
          <Route exact strict path='/' component={RootRouter} />
          <Route exact strict path='/overview' component={Overview}/>
          <Route exact strict path='/manage-categories' component={ManageCategories}/>*/
          <Route exact strict path='/add-asset' component={AddAsset}/>*/
          <Route exact strict path='*' render={() => "Page not found: 404"}/>
        </Switch>
      </div>
  );
};

class App extends React.Component {
  render() {

    return (
        <div className="App">
          <Switch>
            <Route strict path='/' component={InnerRouter}/>
          </Switch>
        </div>
    );
  }
}

export default App;
