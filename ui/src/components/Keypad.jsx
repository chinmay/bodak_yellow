import React from 'react';
import PropTypes from 'prop-types';
import deleteIcon from '../shared/images/delete.svg';

const Key = props => {
  const { keyValue, onClick } = props;

  return (
    <div
      className="key"
      onClick={() => onClick(keyValue)}
      onKeyDown={() => onClick(keyValue)}
      role="button"
      tabIndex={0}
    >
      {keyValue}
    </div>
  );
};

Key.propTypes = {
  keyValue: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  onClick: PropTypes.func.isRequired
};

class KeyPad extends React.PureComponent {
  handleUpdateAmount = value => {
    const { onUpdateAmount, amount } = this.props;
    let updatedAmount;

    if (amount.charAt(0) === '0') {
      const tempAmount = amount.replace('.', '');

      updatedAmount = `${tempAmount.charAt(1)}.${tempAmount.charAt(2) + value}`;
    } else if (amount.length === 5) {
      updatedAmount = amount;
    } else {
      const tempAmount = amount.replace('.', '');

      updatedAmount = `${tempAmount.slice(0, -1)}.${tempAmount.slice(-1) + value}`;
    }

    onUpdateAmount(updatedAmount);
  };

  handleDeleteAmount = () => {
    const { onUpdateAmount, amount } = this.props;
    const tempAmount = amount.replace('.', '');
    let updatedAmount;

    if (tempAmount.length === 3) {
      if (tempAmount.charAt(0) === '0') {
        updatedAmount = `0.0${tempAmount.slice(-2)}`;
      }
      updatedAmount = `0.${tempAmount.slice(0, 2)}`;
    } else {
      updatedAmount = `${tempAmount.slice(0, -3)}.${tempAmount.slice(-3, -1)}`;
    }

    onUpdateAmount(updatedAmount);
  };

  render() {
    return (
      <div className="keypad-container">
        <div className="keypad-row">
          <Key keyValue="1" onClick={this.handleUpdateAmount} />
          <Key keyValue="2" onClick={this.handleUpdateAmount} />
          <Key keyValue="3" onClick={this.handleUpdateAmount} />
        </div>

        <div className="keypad-row">
          <Key keyValue="4" onClick={this.handleUpdateAmount} />
          <Key keyValue="5" onClick={this.handleUpdateAmount} />
          <Key keyValue="6" onClick={this.handleUpdateAmount} />
        </div>

        <div className="keypad-row">
          <Key keyValue="7" onClick={this.handleUpdateAmount} />
          <Key keyValue="8" onClick={this.handleUpdateAmount} />
          <Key keyValue="9" onClick={this.handleUpdateAmount} />
        </div>
        <div className="keypad-row">
          <Key keyValue="" onClick={this.handleUpdateAmount} />
          <Key keyValue="0" onClick={this.handleUpdateAmount} />
          <Key keyValue={<img src={deleteIcon} alt="delete" />} onClick={this.handleDeleteAmount} />
        </div>
      </div>
    );
  }
}

KeyPad.propTypes = {
  amount: PropTypes.string.isRequired,
  onUpdateAmount: PropTypes.func.isRequired
};

export default KeyPad;
