import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { Redirect, withRouter } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { Amount, Rate } from "./";

import runsOnRippleIcon from "../shared/images/runs_on_ripple_inverse.svg";
import slideArrowIcon from "../shared/images/slide_arrow.svg";

class LoanInfo extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  next() {
    this.reactSwipe.next();
  }

  prev() {
    this.reactSwipe.prev();
  }

  render() {
    const { t, history, amount, rate } = this.props;

    return (
      <React.Fragment>
        <div className="loan-info-container">
          <Amount amount={amount} t={t} showTitle />

          <Rate rate={rate} t={t} showTitle />

          <img src={runsOnRippleIcon} alt="Runs on Ripple" />
        </div>
        <SwipeableViews
          className="swipe-button-container"
          enableMouseEvents
          index={1}
          onChangeIndex={() => {
            history.push("/execute-payment");
          }}
        >
          <div className="swipe-button">
            <img
              style={{ paddingRight: "20px" }}
              src={slideArrowIcon}
              alt="slide arrow"
            />
            {t("slide_to_send")}
          </div>
        </SwipeableViews>
      </React.Fragment>
    );
  }
}

LoanInfo.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  recipient: PropTypes.object.isRequired,
  quote: PropTypes.object
};

LoanInfo.defaultProps = {
  quote: null
};

export default translate()(withRouter(LoanInfo));
