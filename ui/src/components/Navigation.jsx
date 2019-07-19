import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { LOAN_STEPS } from "../shared/constants";
import backIcon from "../shared/images/back.svg";
import profileIcon from "../shared/images/profile.svg";
import transactionsIcon from "../shared/images/transactions.svg";

class Navigation extends React.PureComponent {
  handlePreviousStep = () => {
    const { onPreviousStep } = this.props;

    onPreviousStep();
  };

  render() {
    const { currentStep, hasExecutedLoans, processing, title } = this.props;

    return (
      <div className="navigation-container">
        <div className="navigation-left">
          {currentStep === LOAN_STEPS[0] ? null : (
            <div
              onClick={this.handlePreviousStep}
              onKeyDown={this.handlePreviousStep}
              role="button"
              tabIndex="0"
            >
              <img src={backIcon} alt="back" />
            </div>
          )}
        </div>

        <div className={`navigation-title bold ${processing && "processing"}`}>
          {title}
        </div>

        <div className="navigation-right">
          {/* <div className="transactions-icon-container">
            {currentStep === LOAN_STEPS[0] && (
              <div className="transactions-icon-container">
                <div className="transactions-icon">
                  <Link to="/transactions">
                    <img src={transactionsIcon} alt="transactions" />
                  </Link>
                </div>

                {hasExecutedLoans && (
                  <React.Fragment>
                    <div
                      className="pulse-circle orange"
                      style={{ animationDelay: "-3s" }}
                    />
                    <div
                      className="pulse-circle orange"
                      style={{ animationDelay: "-2s" }}
                    />
                    <div
                      className="pulse-circle orange"
                      style={{ animationDelay: "-1s" }}
                    />
                    <div
                      className="pulse-circle orange"
                      style={{ animationDelay: "0s" }}
                    />
                  </React.Fragment>
                )}
              </div>
            )}
          </div> */}
        </div>
      </div>
    );
  }
}

Navigation.propTypes = {
  currentStep: PropTypes.string,
  hasExecutedLoans: PropTypes.bool,
  onPreviousStep: PropTypes.func.isRequired,
  processing: PropTypes.bool,
  title: PropTypes.string
};

Navigation.defaultProps = {
  currentStep: null,
  hasExecutedLoans: false,
  processing: false,
  title: ""
};

export default Navigation;
