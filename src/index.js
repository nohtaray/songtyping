import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import 'normalize.css';
import './index.css';
import {KeysBox, LyricBox} from './components.jsx';

const lyricPages = [
  [
    {kanji: '私の恋を', hiragana: 'わたしのこいを'},
    {kanji: '悲劇のジュリエットにしないで', hiragana: 'ひげきのじゅりえっとにしないで'},
    {kanji: 'ここから連れ出して…', hiragana: 'ここからつれだして・・・'},
    {kanji: 'そんな気分よ', hiragana: 'そんなきぶんよ'},
  ],
];
const lyricPageCharPoses = [7, 6, 0, 0];
const keys = 'higekinozyuriettonisinaide'.toUpperCase();
const keysCharPos = 12;

class Game extends React.Component {
  render() {
    return (
        <div>
          <LyricBox
              lyrics={lyricPages[0]}
              charPoses={lyricPageCharPoses}
          />
          <KeysBox
              keys={keys}
              charPos={keysCharPos}
          />
        </div>
    );
  }
}

// ========================================

ReactDOM.render(
    (
        <Game />
    ),
    document.getElementById('root'),
);
