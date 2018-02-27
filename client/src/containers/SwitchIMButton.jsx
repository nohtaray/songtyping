import React from 'react';
import {connect} from 'react-redux';
import {pushSwitchIMButton} from '../actions';

const SwitchIMButton = ({im, handleClick}) => {
  let imHumanized;
  if (im === 'roma') imHumanized = 'ローマ字';
  if (im === 'jis') imHumanized = 'かな';

  return (
      <button onClick={() => handleClick()}>
        {imHumanized}
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