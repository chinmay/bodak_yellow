import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateLoan from "./CreateLoan";
import Loans from "./Loans";
import UnderHood from "./UnderHood";
import MatchLoan from "./MatchLoan";
import LoanDone from "./LoanDone";
import { Splash } from "../../components";
import "./app.css";

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Splash} />
      <Route
        exact
        path="/create-loan"
        render={props => (
          <div className="demo-app-container">
            <CreateLoan {...props} />
          </div>
        )}
      />
      <Route
        exact
        path="/match-loan"
        render={props => (
          <div className="demo-app-container">
            <MatchLoan {...props} />
          </div>
        )}
      />
      <Route
        exact
        path="/loan-done"
        render={props => <LoanDone {...props} />}
      />
      {/* <Route
        exact
        path="/payment-done"
        render={props => (
          <div className="demo-app-container">
            <PaymentDone {...props} />
          </div>
        )}
      />
      <Route
        exact
        path="/payment-error"
        render={props => (
          <div className="demo-app-container">
            <PaymentError {...props} />
          </div>
        )}
      /> */}
      <Route
        exact
        path="/transactions"
        render={props => (
          <div className="demo-app-container">
            <Loans {...props} />
          </div>
        )}
      />
      <Route exact path="/xvia-api" component={UnderHood} />
    </Switch>
  </Router>
);

export default App;
