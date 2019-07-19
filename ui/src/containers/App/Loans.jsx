import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import { Map } from "core-js";
import { getLoans } from "./actions";
import {
  INSTITUTION_ICONS,
  RECIPIENT_ICONS,
  PAYMENT_STATES
} from "../../shared/constants";
import { groupBy } from "../../shared/utils";

import Loader from "../../components/Loader";
import Navigation from "../../components/Navigation";
import rightArrowIcon from "../../shared/images/arrow_right.svg";

const images = require.context("../../shared/images", true);

const TransactionDetail = ({ t, transaction }) => {
  const recipientIcon = RECIPIENT_ICONS[transaction.firstName.toLowerCase()];
  const institutionIcon =
    INSTITUTION_ICONS[transaction.institution.toLowerCase()];
  const name = `${transaction.firstName} ${transaction.lastName.charAt(0)}.`;

  return (
    <div style={{ display: "relative" }}>
      <div className="transaction-container">
        <img
          className="icon"
          src={images(`./${recipientIcon}`)}
          alt="recipient icon"
        />
        {transaction.isProcessing && (
          <React.Fragment>
            <div
              className="pulse-circle large-orange"
              style={{ animationDelay: "-3s" }}
            />
            <div
              className="pulse-circle large-orange"
              style={{ animationDelay: "-2s" }}
            />
            <div
              className="pulse-circle large-orange"
              style={{ animationDelay: "-1s" }}
            />
            <div
              className="pulse-circle large-orange"
              style={{ animationDelay: "0s" }}
            />
          </React.Fragment>
        )}

        <p className="name">{name}</p>

        <div className="row">
          <p className="row-right">{t("you_sent").toUpperCase()}</p>
          <p className="currency">{`${transaction.sourceAmount} ${transaction.sourceCurrency}`}</p>
        </div>

        <div className="row">
          <p className="row-right">{`${name.toUpperCase()} ${t(
            "received"
          ).toUpperCase()}`}</p>
          <p className="currency">
            {`${transaction.destinationAmount} ${transaction.destinationCurrency}`}
          </p>
        </div>

        <div className="row">
          <p className="row-right">{t("account").toUpperCase()}</p>
          <div className="sub-section">
            <img
              className="institution-icon"
              src={images(`./${institutionIcon}`)}
              alt="institution icon"
            />
            <p className="currency">{transaction.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

TransactionDetail.propTypes = {
  t: PropTypes.func.isRequired,
  transaction: PropTypes.object.isRequired
};

const LoansList = ({ onSelectTransaction, recipients, transactions }) => {
  const renderedList = [];

  transactions.forEach((groupedLoans, date) => {
    renderedList.push(
      <React.Fragment key={date.toUpperCase()}>
        <div className="date-row">{date.toUpperCase()}</div>
        <div>
          {groupedLoans.map(transaction => {
            const contractQuoted = transaction.contract_quoted;
            const destinationCurrency = contractQuoted.destination_currency;
            const sourceAmount = contractQuoted.source_amount;
            const sourceCurrency = contractQuoted.DEFAULT_CURRENCY;
            const isProcessing =
              moment(transaction.payment_timestamp).format() !==
                "Invalid date" &&
              (transaction.state === PAYMENT_STATES.EXECUTED ||
                transaction.state === PAYMENT_STATES.EXECUTING ||
                transaction.state === PAYMENT_STATES.ACCEPTED ||
                transaction.state === PAYMENT_STATES.LOCKED);

            const hasFailed = transaction.state === PAYMENT_STATES.FAILED;

            const recipientInfo = recipients.find(
              recipient => recipient.currency === destinationCurrency
            );

            return (
              <div
                className={`transaction-row ${isProcessing &&
                  "processing"} ${hasFailed && "failed"}`}
                onClick={() =>
                  onSelectTransaction({
                    firstName: recipientInfo.first_name,
                    lastName: recipientInfo.last_name,
                    phone: recipientInfo.phone,
                    institution: recipientInfo.institution,
                    sourceAmount,
                    sourceCurrency,
                    destinationAmount: contractQuoted.destination_amount,
                    destinationCurrency,
                    isProcessing
                  })
                }
                onKeyDown={() =>
                  onSelectTransaction({
                    firstName: recipientInfo.first_name,
                    lastName: recipientInfo.last_name,
                    phone: recipientInfo.phone,
                    institution: recipientInfo.institution,
                    sourceAmount,
                    sourceCurrency,
                    destinationAmount: contractQuoted.destination_amount,
                    destinationCurrency,
                    isProcessing
                  })
                }
                role="button"
                tabIndex={0}
              >
                <div className="sub-section">
                  <p className="name">
                    {`${
                      recipientInfo.first_name
                    } ${recipientInfo.last_name.charAt(0)}.`}
                  </p>
                </div>

                <div className="sub-section">
                  {isProcessing ? (
                    <p className="processing-currency">Processing</p>
                  ) : (
                    <p className="currency">{`${sourceAmount} ${sourceCurrency}`}</p>
                  )}
                  <img src={rightArrowIcon} alt="drill down icon" />
                </div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  });

  return <div className="transactions-container">{renderedList}</div>;
};

LoansList.propTypes = {
  onSelectTransaction: PropTypes.func.isRequired,
  recipients: PropTypes.array.isRequired,
  transactions: PropTypes.instanceOf(Map).isRequired
};

class Loans extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      selectedTransaction: null
    };
  }

  componentDidMount() {
    const { actions } = this.props;

    Promise.all([actions.getLoans()]).then(() => {
      this.setState({
        isLoading: false
      });
    });
  }

  handlePreviousStep = () => {
    const { selectedTransaction } = this.state;

    if (!selectedTransaction) {
      this.props.history.push("/create-payment");
    } else {
      this.setState({
        selectedTransaction: null
      });
    }
  };

  handleTransactionSelection = transactionInfo => {
    this.setState({
      selectedTransaction: transactionInfo
    });
  };

  render() {
    const { recipients, transactions, t } = this.props;
    const { isLoading, selectedTransaction } = this.state;

    const sortedLoans = groupBy(transactions, transaction =>
      moment(transaction.payment_timestamp).format() === "Invalid date"
        ? moment("12/31/1969")
            .add(transaction.payment_timestamp, "seconds")
            .format("ddd, MMM D")
        : moment(transaction.payment_timestamp).format("ddd, MMM D")
    );
    const navTitle = selectedTransaction ? "" : t("transaction_history");

    if (isLoading) {
      return (
        <div className="full-screen">
          <Loader />
        </div>
      );
    }

    return (
      <React.Fragment>
        {selectedTransaction ? (
          <React.Fragment>
            <Navigation
              onPreviousStep={this.handlePreviousStep}
              title={
                selectedTransaction.isProcessing
                  ? t("payment_processing").toUpperCase()
                  : ""
              }
              processing
            />
            <TransactionDetail t={t} transaction={selectedTransaction} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Navigation
              onPreviousStep={this.handlePreviousStep}
              title={navTitle}
            />
            <LoansList
              recipients={recipients}
              transactions={sortedLoans}
              onSelectTransaction={this.handleTransactionSelection}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

Loans.propTypes = {
  history: PropTypes.object.isRequired,
  recipients: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  transactions: PropTypes.array,
  actions: PropTypes.shape({
    getLoans: PropTypes.func
  }).isRequired
};

Loans.defaultProps = {
  transactions: []
};

export default connect(
  state => ({
    recipients: state.app.recipients,
    transactions: state.app.transactions
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        getLoans
      },
      dispatch
    )
  })
)(translate()(withRouter(Loans)));
