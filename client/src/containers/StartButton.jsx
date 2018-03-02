import React from 'react';
import {connect} from 'react-redux';
import {pushStartButton} from '../actions';

const StartButton = ({handleClick}) => {
  return (
      <button className="start_button" onClick={() => handleClick()} />
  );
};

export default connect(
    null,
    dispatch => ({
      handleClick: () => dispatch(pushStartButton()),
    }),
)(StartButton);