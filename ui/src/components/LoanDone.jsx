import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { translate } from "react-i18next";

import checkIcon from "../shared/images/check.svg";
import runsOnRippleInverseIcon from "../shared/images/runs_on_ripple_inverse.svg";

class LoanDone extends React.PureComponent {
  render() {
    const { history, t } = this.props;

    return (
      <div className="done-container">
        <img
          style={{ marginBottom: "16px" }}
          src={checkIcon}
          alt="Runs on Ripple"
        />
        <p className="text">{t("payment_sent")}</p>

        <button
          className="button inverse"
          onClick={() => history.push("/create-payment")}
        >
          {t("done")}
        </button>

        <img
          className="logo"
          src={runsOnRippleInverseIcon}
          alt="Runs on Ripple"
        />
      </div>
    );
  }
}

LoanDone.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default translate()(withRouter(LoanDone));
