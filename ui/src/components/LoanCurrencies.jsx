import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

const DestinationCurrencyRow = props => {
  const { onSelectLoanCurrency, destinationCurrency, t } = props;

  return (
    <div
      className="dest-currencies-row"
      onClick={() => onSelectLoanCurrency(destinationCurrency)}
      onKeyDown={() => onSelectLoanCurrency(destinationCurrency)}
      role="button"
      tabIndex="0"
    >
      <p className="dest-currency">{destinationCurrency}</p>

      <p className="dest-currency-desc text-grey">
        {t(destinationCurrency.toLowerCase())}
      </p>
    </div>
  );
};

DestinationCurrencyRow.propTypes = {
  onSelectLoanCurrency: PropTypes.func.isRequired,
  destinationCurrency: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

const LoanCurrencies = props => {
  const { t, onSelectLoanCurrency, LoanCurrencies } = props;

  return (
    <div className="dest-currencies-container">
      <p className="recipient-title">{t("dest_currencies_title")}</p>
      <div className="dest-currencies-list">
        {LoanCurrencies.map((destinationCurrency, index) => (
          <DestinationCurrencyRow
            key={destinationCurrency}
            onSelectLoanCurrency={onSelectLoanCurrency}
            destinationCurrency={destinationCurrency}
            t={t}
          />
        ))}
      </div>
    </div>
  );
};

LoanCurrencies.propTypes = {
  t: PropTypes.func.isRequired,
  onSelectLoanCurrency: PropTypes.func.isRequired,
  LoanCurrencies: PropTypes.array.isRequired
};

export default translate()(LoanCurrencies);
