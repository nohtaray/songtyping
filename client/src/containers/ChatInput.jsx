import React from 'react';
import {connect} from 'react-redux';

const ChatInput = () => {
  return (
      <div className="chat_input">
        <input type="text" />
      </div>
  );
};

export default connect(
    state => ({}),
    dispatch => ({}),
)(ChatInput);