import React from 'react';
import LyricBox from '../components/LyricBox';
import KeysBox from '../components/KeysBox';
import StartButton from './StartButton';
import {connect} from 'react-redux';
import SwitchIMButton from './SwitchIMButton';
import ChatInput from './ChatInput';
import ChatTimeline from '../components/ChatTimeline';

const COLORS = [
  'red',
  'orange',
  'green',
  'aqua',
  'blue',
  'purple',
  'pink',
  'gray',
];

const Game = ({lyrics, kanaPoses, assignments, keys, keyPos, playerNumber}) => {
  const myColor = COLORS[playerNumber];
  const lyricColors = assignments.map(a => COLORS[a]);
  const background = `url("/img/frame_${myColor}.png") top left / contain no-repeat, url("/img/frame.png") top left / contain no-repeat`;

  return (
      <div>
        <div className="game_wrapper">
          <div className="game" style={{background}}>
            <LyricBox
                lyrics={lyrics}
                kanaPoses={kanaPoses}
                colors={lyricColors}
            />
            <KeysBox
                keys={keys}
                charPos={keyPos}
                color={myColor}
            />
            <ChatTimeline contents={[
              'こんにちは',
              'さようならさようならさようならさようならさようならさようならさようならさようなら',
              'またあした',
            ]} />
            <ChatInput />
          </div>
        </div>
        <StartButton />
        <SwitchIMButton />
      </div>
  );
};

export default connect(
    state => ({
      lyrics: state.lyrics || [],
      kanaPoses: state.kanaPoses,
      assignments: state.assignments[state.page] || [],
      keys: state.keys,
      keyPos: state.keyPos,
      playerNumber: state.playerNumber,
    }),
)(Game);