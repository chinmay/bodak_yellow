import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { INSTITUTION_ICONS, RECIPIENT_ICONS } from '../shared/constants';

const images = require.context('../shared/images', true);

const Recipient = props => {
  const { onSelectRecipient, recipient } = props;

  const recipientIcon = RECIPIENT_ICONS[recipient.first_name.toLowerCase()];
  const institutionIcon = INSTITUTION_ICONS[recipient.institution.toLowerCase()];

  return (
    <div
      className="recipient-row"
      onClick={() => onSelectRecipient(recipient)}
      onKeyDown={() => onSelectRecipient(recipient)}
      role="button"
      tabIndex="0"
    >
      <img className="recipient-icon" src={images(`./${recipientIcon}`)} alt="recipient icon" />

      <div className="recipient-details">
        <p className="recipient-name">
          {`${recipient.first_name} ${recipient.last_name.charAt(0)}.`}
        </p>

        <div className="recipient-info">
          <img
            className="institution-icon"
            src={images(`./${institutionIcon}`)}
            alt="institution icon"
          />
          <span className="recipient-contact text-grey">{recipient.email}</span>
        </div>
      </div>

      <p className="recipient-currency text-grey">{recipient.currency}</p>
    </div>
  );
};

Recipient.propTypes = {
  onSelectRecipient: PropTypes.func.isRequired,
  recipient: PropTypes.object.isRequired
};

const Recipients = props => {
  const { t, onSelectRecipient, recipients } = props;

  return (
    <div className="recipients-container">
      <p className="recipient-title">{t('recipients_title')}</p>
      <div className="recipients-list">
        {recipients.map((recipient, index) => (
          <Recipient
            key={recipient.id}
            onSelectRecipient={onSelectRecipient}
            recipient={recipient}
          />
        ))}
      </div>
    </div>
  );
};

Recipients.propTypes = {
  t: PropTypes.func.isRequired,
  onSelectRecipient: PropTypes.func.isRequired,
  recipients: PropTypes.array.isRequired
};

export default translate()(Recipients);
