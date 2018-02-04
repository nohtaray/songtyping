import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import 'normalize.css';
import './index.css';
import {Game} from './game.jsx';
import {LyricLoader} from './LyricLoader.jsx';

const audioSrc = '/audio/romeo_and_cinderella.mp3';
const lyricSrc = '/lyric/romeo_and_cinderella.xml';

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


// TODO: このクラス Game の中に入れる
class LyricViewer extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      lyrics: null,
    };
  }

  handleLoad(lyrics) {
    // this.setState({lyrics});
    this.setState({lyrics: lyrics.slice(1)});

  }

  render() {
    return (
        <div>
          {
            this.state.lyrics
                ? <Game lyricPages={this.state.lyrics} />
                : ''
          }
          <LyricLoader
              src={this.props.src}
              onLoad={(lyric) => this.handleLoad(lyric)} />
        </div>
    );
  }
}

// ========================================

ReactDOM.render(
    (
        <div>
          <AudioPlayer src={audioSrc} />
          <LyricViewer src={lyricSrc} />
        </div>
    ),
    document.getElementById('root'),
);
