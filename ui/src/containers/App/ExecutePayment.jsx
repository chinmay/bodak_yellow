import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect, withRouter } from "react-router-dom";
import { poll, validateState } from "../../shared/utils";
import { PAYMENT_STATES } from "../../shared/constants";
import runsOnRippleIcon from "../../shared/images/runs_on_ripple.svg";
import downArrowIcon from "../../shared/images/arrow_down.svg";

class ExecutePayment extends React.Component {
  componentDidMount() {
    const { actions, history, quote } = this.props;

    // poll(() =>
    //   actions.getPayment(this.props.paymentId, { testAddress }).then(() =>
    //     validateState(this.props.payment, PAYMENT_STATES.LOCKED, () =>
    //       actions
    //         .executePayment(this.props.payment.test_payment_id, {
    //           testAddress
    //         })
    //         .then(() => {
    //           poll(() =>
    //             actions
    //               .getPayment(this.props.paymentId, { testAddress })
    //               .then(() =>
    //                 validateState(
    //                   this.props.payment,
    //                   PAYMENT_STATES.SUCCEEDED,
    //                   () => {
    //                     history.push("./payment-done");
    //                   }
    //                 )
    //               )
    //           );
    //         })
    //     )
    //   )
    // );

    // Timeout of polling after 30secs
    setTimeout(() => history.push("./payment-done"), 20000);
  }

  render() {
    const { payment, quote, recipients, t } = this.props;

    const images = require.context("../../shared/images", true);

    const contractQuoted = quote.contract_quoted;

    const destinationAmount = Number(
      contractQuoted.destination_amount
    ).toLocaleString();
    const destinationCurrency = contractQuoted.destination_currency;
    const sourceAmount = Number(contractQuoted.source_amount).toFixed(2);
    const sourceCurrency = contractQuoted.DEFAULT_CURRENCY;
    const fxRate = Number(contractQuoted.details[0].fx.rate).toLocaleString();

    const recipientInfo = recipients.find(
      recipient => recipient.currency === destinationCurrency
    );

    if (payment.state === PAYMENT_STATES.FAILED) {
      return <Redirect to="/payment-error" />;
    }

    if (payment.state === PAYMENT_STATES.SUCCEEDED) {
      return <Redirect to="/payment-done" />;
    }

    return (
      <div className="execute-loan-container">
        <p className="title">{t("sending_payment").toUpperCase()}</p>
        <div className="amount-er">
          <p className="amount">{sourceAmount}</p>
          <p className="source-currency">{sourceCurrency}</p>
        </div>

        <div className="down-arrow">
          <img src={downArrowIcon} alt="down arrow" />
        </div>

        <section className="recipient-container">
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
          <div className="pulse-circle blue" style={{ animationDelay: "0s" }} />
        </section>

        <div className="recipient row">
          <p className="recipient-name">
            {`${recipientInfo.first_name} ${recipientInfo.last_name.charAt(
              0
            )}.`}
          </p>

          <p className="text-grey bold">{t("will_receive").toUpperCase()}</p>
        </div>

        <div className="destination-amount-container">
          <p className="destination-amount">{destinationAmount}</p>
          <p className="destination-currency">{destinationCurrency}</p>
        </div>

        <p className="rate">{`1 ${sourceCurrency} = ${fxRate} ${destinationCurrency}`}</p>

        <img
          style={{ marginTop: "225px" }}
          src={runsOnRippleIcon}
          alt="Runs on Ripple"
        />
      </div>
    );
  }
}

ExecutePayment.propTypes = {
  quote: PropTypes.object.isRequired,
  payment: PropTypes.object.isRequired,
  paymentId: PropTypes.string.isRequired,
  recipients: PropTypes.array.isRequired,
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
    quote: state.app.quoteData,
    paymentId: state.app.paymentId,
    payment: state.app.paymentData,
    recipients: state.app.recipients
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        // acceptQuote,
      },
      dispatch
    )
  })
)(translate()(withRouter(ExecutePayment)));
