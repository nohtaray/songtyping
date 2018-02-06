import React from 'react';
import PropTypes from 'prop-types';
import {LyricLoader} from './LyricLoader.jsx';
import {AudioLoader} from './AudioLoader';
import LyricBox from './components/LyricBox';
import KeysBox from './components/KeysBox';

// const tsuikyo = new window.Tsuikyo({flex: 'flex', prevent: true, im: 'roma'});
const tsuikyo={}

class Game extends React.Component {
  static propTypes = {
    lyricSrc: PropTypes.string.isRequired,
    audioSrc: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      lyricPages: null,
      lyricPageCharPoses: Array(4).fill(0),
      pageCount: 0,
      rowCount: 0,
      keysPos: 0,
      keys: '',
    };
  }

  startRowTypingIfNeeded() {
    const lyricRow = this.state.lyricPages[this.state.pageCount].lyrics[this.state.rowCount];
    if (lyricRow == null) return;

    const tw = tsuikyo.make(lyricRow.hiragana);
    this.updatePos(tw);
    tw.listen(e => this.handleType(e, tw));
  };

  handleType(e, tw) {
    this.updatePos(tw);

    if (e.finish) {
      tw.sleep();
      this.setState({
        rowCount: this.state.rowCount + 1,
        keys: '',
        keysPos: 0,
      });
      this.startRowTypingIfNeeded();
    }
  }

  updatePos(tw) {
    const lyricPageCharPoses = this.state.lyricPageCharPoses.slice();
    lyricPageCharPoses[this.state.rowCount] = tw.pos();

    this.setState({
      lyricPageCharPoses,
      keysPos: tw.kpos(),
      keys: tw.kstr(),
    });
  }

  handleLoadLyric(lyrics) {
    this.setState({lyricPages: lyrics});

    lyrics.map(p => p.time).forEach((time, i) => {
      setTimeout(() => {
        this.setState({
          pageCount: i,
        });
        this.handleChangePage();
      }, time);
    });
  }

  handleChangePage() {
    this.setState({
      lyricPageCharPoses: Array(4).fill(0),
      rowCount: 0,
      keysPos: 0,
      keys: '',
    });
    tsuikyo.words().forEach(w => w.sleep());

    this.startRowTypingIfNeeded();
  }

  render() {
    return (
        <div className="game_wrapper">
          {
            this.state.lyricPages ? (
                <div className="game">
                  <LyricBox
                      lyrics={this.state.lyricPages[this.state.pageCount].lyrics}
                      charPoses={this.state.lyricPageCharPoses}
                  />
                  <KeysBox
                      keys={this.state.keys}
                      charPos={this.state.keysPos}
                  />
                </div>
            ) : ''
          }
          <LyricLoader
              src={this.props.lyricSrc}
              onLoad={(lyric) => this.handleLoadLyric(lyric)} />
          <AudioLoader
              src={this.props.audioSrc}
              onLoad={(audio) => audio.play()} />
        </div>
    );
  }
}

export {Game};
