import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { DEFAULT_CURRENCY } from "../shared/constants";

const Amount = props => {
  const { t, loanCurrency, amount, onShowLoanCurrencies, showTitle } = props;

  return (
    <React.Fragment>
      {showTitle && (
        <p className="amount-title">{t("loan_amount").toUpperCase()}</p>
      )}

      <section className="amount-container">
        <p className="amount">
          {Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
        <button className="button currency" onClick={onShowLoanCurrencies}>
          {loanCurrency}
        </button>
      </section>
    </React.Fragment>
  );
};

Amount.propTypes = {
  amountType: PropTypes.string,
  t: PropTypes.func.isRequired,
  onShowLoanCurrencies: PropTypes.func,
  amount: PropTypes.string.isRequired,
  loanCurrency: PropTypes.string,
  showTitle: PropTypes.bool
};

Amount.defaultProps = {
  amountType: "",
  onShowLoanCurrencies: () => {},
  loanCurrency: DEFAULT_CURRENCY,
  showTitle: false
};

export default translate()(Amount);
