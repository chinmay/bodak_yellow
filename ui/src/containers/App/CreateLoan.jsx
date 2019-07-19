import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { CSSTransition } from "react-transition-group";

import {
  LENDER_OR_BORROWER,
  LOAN_STEPS,
  DESTINATION_CURRENCIES,
  SOURCE_CURRENCY
} from "../../shared/constants";
import { clearForm, getLoans } from "./actions";
import {
  LoanCurrencies,
  Keypad,
  Loader,
  Navigation,
  SelectorButtons,
  Amount
} from "../../components";
import ViewQuote from "./ViewQuote";
import Rate from "../../components/Rate";

class CreateLoan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: LOAN_STEPS[0],
      isLoading: false,
      lenderOrBorrower: LENDER_OR_BORROWER.LENDER,
      amount: "0.00",
      currency: "",
      rate: "0",
      showLoanCurrencies: false
    };
  }

  handleNextStep = () => {
    const { currentStep } = this.state;
    const currentStepIndex = LOAN_STEPS.indexOf(currentStep);
    this.setState({
      currentStep: LOAN_STEPS[currentStepIndex + 1]
    });
  };

  handlePreviousStep = () => {
    const { currentStep } = this.state;
    const currentStepIndex = LOAN_STEPS.indexOf(currentStep);
    this.setState({
      currentStep: LOAN_STEPS[currentStepIndex - 1]
    });
  };

  handleShowLoanCurrencies = () => {
    this.setState({
      showLoanCurrencies: true
    });
  };

  handleUpdateLenderBorrower = () => {
    const { lenderOrBorrower } = this.state;

    const newAmountType =
      lenderOrBorrower === LENDER_OR_BORROWER.LENDER
        ? LENDER_OR_BORROWER.BORROWER
        : LENDER_OR_BORROWER.LENDER;

    this.setState({
      lenderOrBorrower: newAmountType,
      rate:
        newAmountType === LENDER_OR_BORROWER.LENDER
          ? SOURCE_CURRENCY
          : DESTINATION_CURRENCIES[0]
    });
  };

  handleUpdateAmount = amount => {
    this.setState({
      amount
    });
  };

  handleSelectCurrency = currency => {
    this.setState({
      currency,
      showLoanCurrencies: false
    });
  };

  handleUpdateRecipient = recipient => {
    this.setState({
      recipient,
      currentStep: LOAN_STEPS[2]
    });
  };

  renderBody() {
    const { t, recipients } = this.props;
    const {
      lenderOrBorrower,
      currentStep,
      recipient,
      amount,
      rate,
      showLoanCurrencies
    } = this.state;

    switch (currentStep) {
      case LOAN_STEPS[0]:
        return (
          <div className="payment-container" style={{ paddingTop: "78px" }}>
            <SelectorButtons
              lenderOrBorrower={lenderOrBorrower}
              onUpdateAmountType={this.handleUpdateLenderBorrower}
            />

            <Amount
              lenderOrBorrower={lenderOrBorrower}
              onShowLoanCurrencies={this.handleShowLoanCurrencies}
              amount={amount}
              rate={rate}
              showTitle
              t={t}
            />

            <Keypad amount={amount} onUpdateAmount={this.handleUpdateAmount} />

            {amount !== "0.00" && (
              <div className="button-container">
                <button className="button" onClick={this.handleNextStep}>
                  {t("continue")}
                </button>
              </div>
            )}

            <CSSTransition
              in={showLoanCurrencies}
              enter
              exit
              timeout={500}
              classNames="currencies"
            >
              <LoanCurrencies
                onSelectSendingCurrency={this.handleSelectCurrency}
                LoanCurrencies={DESTINATION_CURRENCIES}
              />
            </CSSTransition>
          </div>
        );
      case LOAN_STEPS[1]:
        return (
          <div className="payment-container" style={{ paddingTop: "30px" }}>
            <Rate rate={rate} showTitle t={t} />

            <Keypad amount={amount} onUpdateAmount={this.handleUpdateAmount} />

            {rate !== "0.00" && (
              <div className="button-container">
                <button className="button" onClick={this.handleNextStep}>
                  {t("continue")}
                </button>
              </div>
            )}
          </div>
        );
      //   case LOAN_STEPS[2]:
      //     return (
      //       <div className="payment-container" style={{ paddingTop: "30px" }}>
      //         <Amount amount={amount} rate={rate} t={t} showTitle />

      //         <ViewQuote amount={amount} recipient={recipient} rate={rate} />
      //       </div>
      //     );
      default:
        return <React.Fragment />;
    }
  }

  render() {
    const { currentStep, isLoading } = this.state;
    const { transactions } = this.props;
    const hasExecutedLoans =
      transactions.length > 0 &&
      moment().diff(moment(transactions[0].payment_timestamp), "minutes") < 60;

    if (isLoading) {
      return (
        <div className="full-screen">
          <Loader />
        </div>
      );
    }

    return (
      <React.Fragment>
        <Navigation
          currentStep={currentStep}
          hasExecutedLoans={hasExecutedLoans}
          onPreviousStep={this.handlePreviousStep}
        />
        {this.renderBody()}
      </React.Fragment>
    );
  }
}

CreateLoan.propTypes = {
  t: PropTypes.func.isRequired,
  recipients: PropTypes.array.isRequired,
  transactions: PropTypes.array,
  actions: PropTypes.shape({
    clearForm: PropTypes.func,
    executePayment: PropTypes.func,
    getRecipients: PropTypes.func,
    getLoans: PropTypes.func
  }).isRequired
};

CreateLoan.defaultProps = {
  transactions: []
};

export default connect(
  state => ({
    transactions: state.app.transactions,
    recipients: state.app.recipients
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        clearForm,
        getLoans
      },
      dispatch
    )
  })
)(translate()(CreateLoan));
