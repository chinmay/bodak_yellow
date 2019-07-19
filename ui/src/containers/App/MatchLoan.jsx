import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect, withRouter } from "react-router-dom";
import { poll, validateState } from "../../shared/utils";
import { PAYMENT_STATES } from "../../shared/constants";
import runsOnRippleIcon from "../../shared/images/runs_on_ripple_inverse.svg";
import { matchBorrowers, matchLenders } from "./actions";

class LoanMatch extends React.Component {
  componentDidMount() {
    const { actions, history, lender, borrower } = this.props;

    if (lender) {
      actions
        .matchBorrowers({ id: lender.id })
        .then(() => history.push("./loan-done"));
    }

    if (borrower) {
      actions
        .matchLenders({ id: borrower.id })
        .then(() => history.push("./loan-done"));
    }

    // Timeout of polling after 10secs
    setTimeout(() => history.push("./loan-done"), 20000);
  }

  render() {
    const { lender, borrower, loan, t } = this.props;

    const images = require.context("../../shared/images", true);
    const amount = lender ? lender.amount : borrower.amount;
    const rate = lender ? lender.interest_rate : borrower.interest_rate;
    const currency = lender ? lender.currency : borrower.currency;

    if (loan) {
      return <Redirect to="/loan-done" />;
    }

    return (
      <div className="execute-loan-container">
        <p className="title">{t("finding_match").toUpperCase()}</p>
        <div className="amount-container">
          <p className="amount">{amount}</p>
          <p className="loan-currency">{currency}</p>
        </div>

        <div className="amount-container">
          <p className="rate">{rate}% APR</p>
        </div>

        <section className="recipient-container">
          {/* <div className="transactions-icon">
            <img src={runsOnRippleIcon} />
          </div> */}

          <React.Fragment>
            <div
              className="pulse-circle blue"
              style={{ animationDelay: "-3s" }}
            />
            <div
              className="pulse-circle blue"
              style={{ animationDelay: "-2s" }}
            />
            <div
              className="pulse-circle blue"
              style={{ animationDelay: "-1s" }}
            />
            <div
              className="pulse-circle blue"
              style={{ animationDelay: "0s" }}
            />
          </React.Fragment>
        </section>

        <img
          style={{ marginTop: "225px" }}
          src={runsOnRippleIcon}
          alt="Runs on Ripple"
        />
      </div>
    );
  }
}

LoanMatch.propTypes = {
  lender: PropTypes.object.isRequired,
  borrower: PropTypes.object.isRequired,
  loan: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  actions: PropTypes.shape({
    acceptQuote: PropTypes.func,
    executePayment: PropTypes.func,
    getPayment: PropTypes.func
  }).isRequired
};

export default connect(
  state => ({
    lender: state.app.lender,
    borrower: state.app.borrower,
    loan: state.app.loan,
    accountId: state.app.paymentId
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        matchLenders,
        matchBorrowers
      },
      dispatch
    )
  })
)(translate()(withRouter(LoanMatch)));
