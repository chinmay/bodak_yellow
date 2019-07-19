import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { SOURCE_CURRENCY } from "../shared/constants";

const Rate = props => {
  const { t, sendingCurrency, rate, showTitle } = props;

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
      </section>
    </React.Fragment>
  );
};

Rate.propTypes = {
  amountType: PropTypes.string,
  t: PropTypes.func.isRequired,
  onShowLoanCurrencies: PropTypes.func,
  amount: PropTypes.string.isRequired,
  sendingCurrency: PropTypes.string,
  showTitle: PropTypes.bool
};

Rate.defaultProps = {
  amountType: "",
  onShowLoanCurrencies: () => {},
  sendingCurrency: SOURCE_CURRENCY,
  showTitle: false
};

export default translate()(Rate);
