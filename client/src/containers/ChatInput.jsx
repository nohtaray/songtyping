import React from 'react';
import {connect} from 'react-redux';
import {blurChat, focusChat, sendChat} from '../actions';
import {PropTypes} from 'prop-types';

class ChatInput extends React.Component {
  static propTypes = {
    handlePressEnter: PropTypes.func.isRequired,
    handleFocus: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
  };

  handleKeyDown(e) {
    const content = e.target.value;
    const empty = !!content.match(/^\s*$/g);
    if (!empty && e.keyCode === 13) {  // Enter
      this.props.handlePressEnter(content);
      e.target.value = '';
    }
  }

  render() {
    return (
        <div className="chat_input">
          <input type="text"
                 onKeyDown={e => this.handleKeyDown(e)}
                 onFocus={() => this.props.handleFocus()}
                 onBlur={() => this.props.handleBlur()}
          />
        </div>
    );
  }
}

export default connect(
    null,
    dispatch => ({
      handlePressEnter: message => dispatch(sendChat({message})),
      handleFocus: () => dispatch(focusChat()),
      handleBlur: () => dispatch(blurChat()),
    }),
)(ChatInput);