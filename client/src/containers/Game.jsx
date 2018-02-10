import React from 'react';
import LyricBox from '../components/LyricBox';
import KeysBox from '../components/KeysBox';
import StartButton from './StartButton';
import {connect} from 'react-redux';

const Game = ({lyrics, kanaPoses, keys, keyPos}) => {
  return (
      <div>
        <div className="game_wrapper">
          <div className="game">
            <LyricBox
                lyrics={lyrics}
                kanaPoses={kanaPoses}
            />
            <KeysBox
                keys={keys}
                charPos={keyPos}
            />
          </div>
        </div>

        <StartButton/>
      </div>
  );
};

export default connect(
    state => ({
      lyrics: state.lyrics || [],
      kanaPoses: state.kanaPoses,
      keys: state.keys,
      keyPos: state.keyPos,
    }),
)(Game);