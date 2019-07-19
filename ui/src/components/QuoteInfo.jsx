import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { Redirect, withRouter } from "react-router-dom";
import moment from "moment";
import SwipeableViews from "react-swipeable-views";

import { RECIPIENT_ICONS } from "../shared/constants";
import runsOnRippleIcon from "../shared/images/runs_on_ripple.svg";
import slideArrowIcon from "../shared/images/slide_arrow.svg";
import circleIcon from "../shared/images/circle.svg";

const METHOD_TYPES = {
  STANDARD: "STANDARD",
  RIPPLE: "RIPPLE"
};

const FeeRow = ({ t, fee, feeCurrency }) => (
  <div className="fee row">
    <img style={{ paddingRight: "11px" }} src={circleIcon} alt="fee circle" />

    <p className="fx-rate">
      {`${t("fee").toUpperCase()}: ${Number(fee).toFixed(2)} ${feeCurrency}`}
    </p>
  </div>
);

FeeRow.propTypes = {
  t: PropTypes.func.isRequired,
  fee: PropTypes.string.isRequired,
  feeCurrency: PropTypes.string.isRequired
};

const DeliveryMethod = ({
  t,
  eta,
  onSelect,
  selectedMethod,
  feeCurrency,
  type
}) => (
  <div
    className={`method-card ${selectedMethod === type && "selected"}`}
    onClick={() => onSelect(type)}
    onKeyDown={() => onSelect(type)}
    role="button"
    tabIndex={0}
  >
    {type === METHOD_TYPES.STANDARD ? (
      <p>{t("standard")}</p>
    ) : (
      <img src={runsOnRippleIcon} alt="Runs on Ripple" />
    )}

    <div className={`method-details ${selectedMethod === type && "selected"}`}>
      <div>
        <span className="bold">{`${t("eta").toUpperCase()}: `}</span>
        {eta}
      </div>
    </div>
  </div>
);

DeliveryMethod.propTypes = {
  t: PropTypes.func.isRequired,
  eta: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  selectedMethod: PropTypes.string.isRequired,
  feeCurrency: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

DeliveryMethod.defaultProps = {
  eta: "~3 MIN"
};

class QuoteInfo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedMethod: METHOD_TYPES.RIPPLE
    };
  }

  next() {
    this.reactSwipe.next();
  }

  prev() {
    this.reactSwipe.prev();
  }

  handleMethodSelect = type => {
    this.setState({
      selectedMethod: type
    });
  };

  renderFees = () => {
    const { quote, t } = this.props;

    const quoteDetails = quote.contract_quoted.details;

    return quoteDetails.map(detail => {
      if (!detail.destination_fee) {
        return null;
      }

      let fee = 0;
      let feeCurrency = "";

      if (detail.source_fee.total_fee !== "0.0") {
        fee = Number(detail.source_fee.total_fee)
          .toFixed(2)
          .toLocaleString();
        feeCurrency = detail.source_fee.fee_currency;
      } else {
        fee = Number(detail.destination_fee.total_fee)
          .toFixed(2)
          .toLocaleString();
        feeCurrency = detail.destination_fee.fee_currency;
      }

      return <FeeRow t={t} fee={fee} feeCurrency={feeCurrency} />;
    });
  };

  render() {
    const { t, history, quote, recipient } = this.props;
    const { selectedMethod } = this.state;
    const images = require.context("../shared/images", true);
    const recipientIcon = RECIPIENT_ICONS[recipient.first_name.toLowerCase()];

    const contractQuoted = quote.contract_quoted;

    if (!contractQuoted) {
      return <Redirect to="/payment-error" />;
    }

    const receivingAmount = Number(contractQuoted.destination_amount)
      .toFixed(2)
      .toLocaleString();
    const destinationCurrency = contractQuoted.destination_currency;
    const sourceCurrency = contractQuoted.source_currency;

    const quoteDetails = contractQuoted.details[0];
    const fxRate = Number(quoteDetails.fx.rate).toLocaleString();
    const destinationFeeCurrency = quoteDetails.fx.destination_currency;
    const wireTransferFee = 15 * fxRate;

    return (
      <React.Fragment>
        <div className="quote-container">
          <p className="fx-rate">{`1 ${sourceCurrency} = ${fxRate} ${destinationCurrency}`}</p>

          <div className="fee-container">
            {selectedMethod === METHOD_TYPES.STANDARD ? (
              <FeeRow
                t={t}
                fee={wireTransferFee}
                feeCurrency={destinationFeeCurrency}
              />
            ) : (
              this.renderFees()
            )}
          </div>

          <div className="recipient row">
            <img
              className="recipient-icon"
              src={images(`./${recipientIcon}`)}
              alt="recipient icon"
            />

            <p className="recipient-name">
              {`${recipient.first_name} ${recipient.last_name.charAt(0)}.`}
            </p>

            <p className="text-grey">{t("will_receive").toUpperCase()}</p>
          </div>

          <div className="recipient-amount row">
            <p className="receiving-amount">
              {selectedMethod === METHOD_TYPES.STANDARD
                ? Number(receivingAmount - wireTransferFee).toFixed(2)
                : receivingAmount}
            </p>
            <p className="currency">{destinationCurrency}</p>
          </div>
        </div>

        <div className="delivery-method-container">
          <p className="center title">{t("select_method").toUpperCase()}</p>
          <DeliveryMethod
            t={t}
            eta={moment(Date.now())
              .add(3, "days")
              .format("LL")}
            type={METHOD_TYPES.STANDARD}
            onSelect={this.handleMethodSelect}
            selectedMethod={selectedMethod}
            feeCurrency={destinationFeeCurrency}
          />
          <DeliveryMethod
            t={t}
            type={METHOD_TYPES.RIPPLE}
            onSelect={this.handleMethodSelect}
            selectedMethod={selectedMethod}
            feeCurrency={destinationFeeCurrency}
          />
        </div>

        <SwipeableViews
          className="swipe-button-container"
          disabled={selectedMethod !== METHOD_TYPES.RIPPLE}
          enableMouseEvents
          index={1}
          onChangeIndex={() => {
            selectedMethod === METHOD_TYPES.RIPPLE &&
              history.push("/execute-payment");
          }}
        >
          <div className="swipe-button" />
          <div
            className={`swipe-button ${
              selectedMethod !== METHOD_TYPES.RIPPLE ? "disabled" : ""
            }`}
          >
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

QuoteInfo.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  recipient: PropTypes.object.isRequired,
  quote: PropTypes.object
};

QuoteInfo.defaultProps = {
  quote: null
};

export default translate()(withRouter(QuoteInfo));
