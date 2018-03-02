import React from 'react';
import {connect} from 'react-redux';
import {sendChat} from '../actions';


const ChatInput = ({handlePressEnter}) => {
  return (
      <div className="chat_input">
        <input type="text" onKeyDown={e => {
          if (e.keyCode === 13) {  // Enter
            handlePressEnter(e.target.value);
            e.target.value = '';
          }
        }} />
      </div>
  );
};

export default connect(
    null,
    dispatch => ({
      handlePressEnter: message => dispatch(sendChat({message})),
    }),
)(ChatInput);