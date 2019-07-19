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
import SyntaxHighlighter from "react-syntax-highlighter";
import { railscasts } from "react-syntax-highlighter/styles/hljs";

class LoanDone extends React.Component {
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

    // Timeout of polling after 30secs
    setTimeout(() => history.push("./match-loan"), 20000);
  }

  render() {
    const { lender, borrower, loan, t } = this.props;

    const request = {
      Account: "rBfd8fpG98bYB4dwHY1GSxj4dRo5ayujnx",
      Fee: "12",
      Flags: 2147483648,
      LastLedgerSequence: 21142055,
      Sequence: 1,
      SignerEntries: [
        {
          SignerEntry: {
            Account: "rBXPBLaNoMhRnXGsS56mGU4C64b5PcyqEw",
            SignerWeight: 1
          }
        },
        {
          SignerEntry: {
            Account: "rn2hJyCqPL7dcYwNZvNswJ8YZ6vw7i2snF",
            SignerWeight: 1
          }
        },
        {
          SignerEntry: {
            Account: "r4Ek36hN1GbA9MciWcJFmgiLFgWuPD3Rxb",
            SignerWeight: 1
          }
        }
      ],
      SignerQuorum: 2
    };

    return (
      <div>
        <SyntaxHighlighter
          style={railscasts}
          customStyle={{
            fontSize: "18px",
            lineHeight: "20px",
            backgroundColor: "#000",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            hyphens: "auto"
          }}
          language="json"
        >
          {JSON.stringify(request, null, "\t")}
        </SyntaxHighlighter>
      </div>
    );
  }
}

LoanDone.propTypes = {
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
)(translate()(withRouter(LoanDone)));
