import React from 'react';
import {connect} from 'react-redux';
import {pushStartButton} from '../actions';

const StartButton = ({handleClick}) => {
  return (
      <button onClick={() => handleClick()}>
        すたーと
      </button>
  );
};

export default connect(
    null,
    dispatch => ({
      handleClick: () => dispatch(pushStartButton()),
    }),
)(StartButton);