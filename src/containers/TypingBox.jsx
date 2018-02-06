import React from 'react';
import LyricBox from '../components/LyricBox';
import KeysBox from '../components/KeysBox';
import {connect} from 'react-redux';

const TypingBox = ({lyrics, charPoses, keys, keyPos}) => {
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
                charPos={keyPos}
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
      keyPos: state.keyPos,
    }),
)(TypingBox);