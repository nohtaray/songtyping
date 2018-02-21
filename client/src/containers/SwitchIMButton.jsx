import React from 'react';
import {connect} from 'react-redux';
import {pushSwitchIMButton} from '../actions';

const SwitchIMButton = ({im, handleClick}) => {
  let displayIM;
  if (im === 'roma') displayIM = 'ローマ字';
  if (im === 'jis') displayIM = 'かな';

  return (
      <button onClick={() => handleClick()}>
        {displayIM}
      </button>
  );
};

export default connect(
    state => ({
      im: state.im,
    }),
    dispatch => ({
      handleClick: () => dispatch(pushSwitchIMButton()),
    }),
)(SwitchIMButton);