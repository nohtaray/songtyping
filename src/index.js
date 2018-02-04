import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import 'normalize.css';
import './index.css';
import {Game} from './game.jsx'

const lyricPages = [
  {
    lyrics: [
      {kanji: '私の恋を', hiragana: 'わたしのこいを'},
      {kanji: '悲劇のジュリエットにしないで', hiragana: 'ひげきのじゅりえっとにしないで'},
      {kanji: 'ここから連れ出して…', hiragana: 'ここからつれだして・・・'},
      {kanji: 'そんな気分よ', hiragana: 'そんなきぶんよ'},
    ],
  },
];

const audioSrc = '/audio/romeo_and_cinderella.mp3';

class AudioPlayer extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.audio = null;
  }

  handleCanPlayThrough() {
    // this.audio.play();
  }

  render() {
    return (
        <div>
          <audio
              src={this.props.src}
              onCanPlayThrough={() => this.handleCanPlayThrough()}
              ref={ref => {this.audio = ref;}}>
          </audio>
        </div>
    );
  }
}

// ========================================

ReactDOM.render(
    (
        <div>
          <Game lyricPages={lyricPages} />
          <AudioPlayer src={audioSrc} />
        </div>
    ),
    document.getElementById('root'),
);
