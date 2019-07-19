import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import { acceptQuote, clearForm, getQuote } from "./actions";
import { Loader, QuoteInfo } from "../../components";

class ViewQuote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    const { actions, recipient, amount, sendingCurrency } = this.props;

    // actions.clearForm().then(() =>
    //   actions
    //     .getQuote({
    //       amount: amount,
    //       source_currency: sendingCurrency
    //     })
    //     .then(response => {
    //       if (response) {
    //         actions.acceptQuote({
    //         });
    //       }
    //       this.setState({
    //         isLoading: false
    //       });
    //     })
    // );
  }

  render() {
    const { quote, recipient } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <React.Fragment>
        <QuoteInfo quote={quote} recipient={recipient} />
      </React.Fragment>
    );
  }
}

ViewQuote.propTypes = {
  quote: PropTypes.object.isRequired,
  amount: PropTypes.string.isRequired,
  sendingCurrency: PropTypes.string.isRequired,
  recipient: PropTypes.object.isRequired,
  actions: PropTypes.shape({
    acceptQuote: PropTypes.func,
    clearForm: PropTypes.func,
    getQuote: PropTypes.func
  }).isRequired
};

export default connect(
  state => ({
    quote: state.app.quoteData
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        // acceptQuote,
        // clearForm,
        // getQuote
      },
      dispatch
    )
  })
)(ViewQuote);
