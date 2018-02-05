import React from 'react';
import LyricBox from '../components/LyricBox';
import KeysBox from '../components/KeysBox';
import {connect} from 'react-redux';

const TypingBox = ({lyrics, charPoses, keys, keysPos}) => {
  return (
      <div className="game_wrapper">
        {
          <div className="game">
            <LyricBox
                lyrics={lyrics}
                charPoses={charPoses}
            />
            <KeysBox
                keys={keys}
                charPos={keysPos}
            />
          </div>
        }
      </div>
  );
};

export default connect(
    state => ({
      lyrics: state.lyrics || [],
      charPoses: state.charPoses,
      keys: state.keys,
      keysPos: state.keysPos,
    }),
)(TypingBox);