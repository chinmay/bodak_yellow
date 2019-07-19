import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { DEFAULT_CURRENCY } from "../shared/constants";

const Rate = props => {
  const { t, loanCurrency, rate, showTitle } = props;

  return (
    <React.Fragment>
      {showTitle && <p className="amount-title">{t("rate").toUpperCase()}</p>}

      <section className="amount-container">
        <p className="amount">
          {Number(rate).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>

        <p className="currency">%</p>
      </section>
    </React.Fragment>
  );
};

Rate.propTypes = {
  amountType: PropTypes.string,
  t: PropTypes.func.isRequired,
  onShowLoanCurrencies: PropTypes.func,
  amount: PropTypes.string.isRequired,
  loanCurrency: PropTypes.string,
  showTitle: PropTypes.bool
};

Rate.defaultProps = {
  amountType: "",
  onShowLoanCurrencies: () => {},
  loanCurrency: DEFAULT_CURRENCY,
  showTitle: false
};

export default translate()(Rate);
