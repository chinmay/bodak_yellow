import React from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { railscasts } from 'react-syntax-highlighter/styles/hljs';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { bindActionCreators } from '../../../node_modules/redux';

import { getMarketplaceLogs } from './actions';
import { poll } from '../../shared/utils';

import xrapidVideo1 from '../../shared/images/xrapid1.gif';
import xrapidVideo2 from '../../shared/images/xrapid2.gif';
import xrapidVideo3 from '../../shared/images/xrapid3.gif';
import xrapidVideo4 from '../../shared/images/xrapid4.gif';
import xrapidVideo5 from '../../shared/images/xrapid5.gif';

const XRAPID_VIDEO_SEQUENCE = [
  xrapidVideo1,
  xrapidVideo2,
  xrapidVideo3,
  xrapidVideo4,
  xrapidVideo5
];

const UnderHoodLaunchPage = ({ onStartLogs, t }) => (
  <div className="under-hood-start-container">
    <div className="row">
      <button className="button" onClick={onStartLogs}>
        {t('start').toUpperCase()}
      </button>
    </div>
  </div>
);

UnderHoodLaunchPage.propTypes = {
  onStartLogs: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

class UnderHood extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVideoActive: false,
      currentVideoStep: 0,
      showLogs: false
    };

    this.xrapidVideo1 = xrapidVideo1;
  }

  componentDidMount() {
    const { actions } = this.props;

    poll(
      () =>
        actions.getMarketplaceLogs().then(() => {
          throw new Error('continue polling');
        }),
      Infinity,
      3000
    );

    document.addEventListener('keydown', this.handleShowVideo, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  handleShowVideo = e => {
    e.preventDefault();
    const { isVideoActive, currentVideoStep, showLogs } = this.state;

    if (e.code === 'Space') {
      this.setState({
        isVideoActive: !isVideoActive,
        currentVideoStep: 0
      });

      // hack to reload gif on toggle
      if (this.gif) this.gif.src = this.xrapidVideo1;
    }

    if (e.code === 'Enter') {
      const newVideoStep =
        currentVideoStep + 1 < XRAPID_VIDEO_SEQUENCE.length ? currentVideoStep + 1 : 0;

      this.setState({
        currentVideoStep: newVideoStep
      });
    }

    if (e.code === 'Escape') {
      this.setState({
        showLogs: !showLogs
      });
    }
  };

  handleStartLogs = () => {
    const { showLogs } = this.state;

    this.setState({
      showLogs: !showLogs
    });
  };

  render() {
    const { logData, t } = this.props;
    const { isVideoActive, currentVideoStep, showLogs } = this.state;

    const { request = '', response = '' } = logData;

    if (!showLogs) {
      return <UnderHoodLaunchPage onStartLogs={this.handleStartLogs} t={t} />;
    }

    return (
      <div className="under-hood-container">
        {isVideoActive && (
          <img
            className="video"
            src={XRAPID_VIDEO_SEQUENCE[currentVideoStep]}
            alt="xrapid video"
            ref={input => {
              this.gif = input;
            }}
          />
        )}

        <section className="req-res-header">
          <p className="title">{t('request').toUpperCase()}</p>

          <p className="title">{t('response').toUpperCase()}</p>
        </section>
        <section className="req-res-container">
          <section className="request-container">
            <SyntaxHighlighter
              style={railscasts}
              customStyle={{
                fontSize: '18px',
                lineHeight: '20px',
                backgroundColor: '#000',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                hyphens: 'auto'
              }}
              language="json"
            >
              {JSON.stringify(request, null, '\t')}
            </SyntaxHighlighter>
          </section>

          <section className="response-container">
            <SyntaxHighlighter
              style={railscasts}
              customStyle={{ fontSize: '18px', lineHeight: '20px', backgroundColor: '#000' }}
              language="json"
            >
              {JSON.stringify(response, null, '\t')}
            </SyntaxHighlighter>
          </section>
        </section>
      </div>
    );
  }
}

UnderHood.propTypes = {
  logData: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  actions: PropTypes.shape({
    getMarketplaceLogs: PropTypes.func
  }).isRequired
};

export default connect(
  state => ({
    logData: state.app.logData
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        getMarketplaceLogs
      },
      dispatch
    )
  })
)(translate()(withRouter(UnderHood)));
