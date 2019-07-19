import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { LENDER_OR_BORROWER } from "../shared/constants";

class SelectorButtons extends React.PureComponent {
  render() {
    const { lenderOrBorrower, onUpdateAmountType, t } = this.props;

    return (
      <div className="selector-buttons-container">
        <button
          className={`selector-button ${
            lenderOrBorrower === LENDER_OR_BORROWER.LENDER ? "selected" : ""
          }`}
          onClick={onUpdateAmountType}
        >
          {t("will_lend").toUpperCase()}
        </button>

        <button
          className={`selector-button ${
            lenderOrBorrower === LENDER_OR_BORROWER.BORROWER ? "selected" : ""
          }`}
          onClick={onUpdateAmountType}
        >
          {t("will_borrow").toUpperCase()}
        </button>
      </div>
    );
  }
}

SelectorButtons.propTypes = {
  lenderOrBorrower: PropTypes.string.isRequired,
  onUpdateAmountType: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default translate()(SelectorButtons);
