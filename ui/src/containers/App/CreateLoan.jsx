import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { CSSTransition } from "react-transition-group";
import runsOnRippleIcon from "../../shared/images/runs_on_ripple_inverse.svg";

import {
  LENDER_OR_BORROWER,
  LOAN_STEPS,
  LOAN_CURRENCIES,
  DEFAULT_CURRENCY
} from "../../shared/constants";
import { clearForm, createLender, createBorrower, getLoans } from "./actions";
import {
  LoanCurrencies,
  Keypad,
  Loader,
  Navigation,
  SelectorButtons,
  Amount
} from "../../components";
import Rate from "../../components/Rate";

class CreateLoan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: LOAN_STEPS[0],
      isLoading: false,
      lenderOrBorrower: LENDER_OR_BORROWER.LENDER,
      amount: "0.00",
      currency: "XRP",
      rate: "0.00",
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

    const newType =
      lenderOrBorrower === LENDER_OR_BORROWER.LENDER
        ? LENDER_OR_BORROWER.BORROWER
        : LENDER_OR_BORROWER.LENDER;

    this.setState({
      lenderOrBorrower: newType
    });
  };

  handleUpdateAmount = amount => {
    this.setState({
      amount
    });
  };

  handleUpdateRate = rate => {
    this.setState({
      rate
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

  handleCreateLender = () => {
    const { actions } = this.props;
    const { amount, currency, rate } = this.state;

    this.setState({
      isLoading: true
    });
    actions.createLender({ amount, currency, interest_rate: rate });
  };

  handleCreateBorrower = () => {
    const { actions } = this.props;
    const { amount, currency, rate } = this.state;

    this.setState({
      isLoading: true
    });
    actions.createBorrower({ amount, currency, interest_rate: rate });
  };

  renderBody() {
    const { t, borrower, lender } = this.props;
    const { currency } = this.state;
    const {
      lenderOrBorrower,
      isLoading,
      currentStep,
      amount,
      rate,
      showLoanCurrencies
    } = this.state;

    switch (currentStep) {
      case LOAN_STEPS[0]:
        return (
          <div className="loan-container">
            <SelectorButtons
              lenderOrBorrower={lenderOrBorrower}
              onUpdateLenderBorrower={this.handleUpdateLenderBorrower}
            />

            <CSSTransition
              in={currentStep}
              enter
              exit
              timeout={500}
              classNames="inputs"
            >
              <Amount
                lenderOrBorrower={lenderOrBorrower}
                loanCurrency={currency}
                onShowLoanCurrencies={this.handleShowLoanCurrencies}
                amount={amount}
                showTitle
                t={t}
              />
            </CSSTransition>

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
                onSelectLoanCurrency={this.handleSelectCurrency}
                LoanCurrencies={LOAN_CURRENCIES}
              />
            </CSSTransition>
          </div>
        );
      case LOAN_STEPS[1]:
        return (
          <div className="loan-container">
            <SelectorButtons
              lenderOrBorrower={lenderOrBorrower}
              onUpdateLenderBorrower={this.handleUpdateLenderBorrower}
            />

            <CSSTransition
              in={currentStep}
              enter
              exit
              timeout={500}
              classNames="currencies"
            >
              <Rate rate={rate} showTitle t={t} />
            </CSSTransition>

            <Keypad amount={rate} onUpdateAmount={this.handleUpdateRate} />

            {rate !== "0.00" && (
              <div className="button-container">
                <button className="button" onClick={this.handleNextStep}>
                  {t("continue")}
                </button>
              </div>
            )}
          </div>
        );
      case LOAN_STEPS[2]:
        return (
          <div className="loan-container">
            <SelectorButtons
              lenderOrBorrower={lenderOrBorrower}
              onUpdateLenderBorrower={this.handleUpdateLenderBorrower}
            />

            <Amount
              lenderOrBorrower={lenderOrBorrower}
              loanCurrency={currency}
              amount={amount}
              showTitle
              t={t}
            />

            <Rate rate={rate} showTitle t={t} />

            <div className="button-container">
              <img
                src={runsOnRippleIcon}
                alt="Runs on Ripple"
                style={{ marginBottom: "20px" }}
              />

              <button
                className="button"
                onClick={
                  lenderOrBorrower === LENDER_OR_BORROWER.LENDER
                    ? this.handleCreateLender
                    : this.handleCreateBorrower
                }
              >
                {<div className="lds-ellipsis"></div>}
                {"Submit"}
              </button>
            </div>
          </div>
        );
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
    createLender: PropTypes.func,
    createBorrower: PropTypes.func,
    getLoans: PropTypes.func
  }).isRequired
};

CreateLoan.defaultProps = {
  transactions: []
};

export default connect(
  state => ({
    lender: state.app.lender,
    borrower: state.app.borrower
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        clearForm,
        createLender,
        createBorrower,
        getLoans
      },
      dispatch
    )
  })
)(translate()(CreateLoan));
