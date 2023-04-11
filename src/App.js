import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Rates from "./Rates";
import Nav from "./Nav";
import Footer from "./Footer";

const NotFound = () => {
  return <h2>404 Not Found</h2>;
};

const App = () => {
  return (
    <Router basename="/cur">
      <Nav />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/rates" component={Rates} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
