import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { SOURCE_CURRENCY } from "../shared/constants";

const Amount = props => {
  const { t, sendingCurrency, amount, onShowLoanCurrencies, showTitle } = props;

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
        <button className="currency" onClick={onShowLoanCurrencies}>
          {sendingCurrency}
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
  sendingCurrency: PropTypes.string,
  showTitle: PropTypes.bool
};

Amount.defaultProps = {
  amountType: "",
  onShowLoanCurrencies: () => {},
  sendingCurrency: SOURCE_CURRENCY,
  showTitle: false
};

export default translate()(Amount);
