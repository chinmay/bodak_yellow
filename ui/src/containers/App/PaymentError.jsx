import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

import flossDance from '../../shared/images/floss_dance.gif';
import runsOnRippleInverseIcon from '../../shared/images/runs_on_ripple_inverse.svg';

class PaymentError extends React.PureComponent {
  render() {
    const { history, t } = this.props;

    return (
      <div className="error-container">
        <img style={{ marginBottom: '16px', height: '300px' }} src={flossDance} alt="floss dance" />
        <p className="text">{t('oops')}</p>
        <p className="text" style={{ marginBottom: '85px' }}>
          {t('payment_error')}
        </p>
        {/* {errorMessage && <p className="text">{errorMessage}</p>} */}

        <button className="button" onClick={() => history.push('/create-payment')}>
          {t('try_again')}
        </button>

        <img className="logo" src={runsOnRippleInverseIcon} alt="Runs on Ripple" />
      </div>
    );
  }
}

PaymentError.propTypes = {
  // errorMessage: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default connect(
  state => ({
    errorMessage: state.app.serverErrorMsg
  }),
  {}
)(translate()(withRouter(PaymentError)));
