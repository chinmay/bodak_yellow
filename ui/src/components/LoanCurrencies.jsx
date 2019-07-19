import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

const DestinationCurrencyRow = props => {
  const { onSelectSendingCurrency, destinationCurrency, t } = props;

  return (
    <div
      className="dest-currencies-row"
      onClick={() => onSelectSendingCurrency(destinationCurrency)}
      onKeyDown={() => onSelectSendingCurrency(destinationCurrency)}
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
  onSelectSendingCurrency: PropTypes.func.isRequired,
  destinationCurrency: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

const LoanCurrencies = props => {
  const { t, onSelectSendingCurrency, LoanCurrencies } = props;

  return (
    <div className="dest-currencies-container">
      <p className="recipient-title">{t("dest_currencies_title")}</p>
      <div className="dest-currencies-list">
        {LoanCurrencies.map((destinationCurrency, index) => (
          <DestinationCurrencyRow
            key={destinationCurrency}
            onSelectSendingCurrency={onSelectSendingCurrency}
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
  onSelectSendingCurrency: PropTypes.func.isRequired,
  LoanCurrencies: PropTypes.array.isRequired
};

export default translate()(LoanCurrencies);
