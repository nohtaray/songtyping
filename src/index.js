import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import 'normalize.css';
import './index.css';
import {KeysBox, LyricBox} from './components.jsx';

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
const tsuikyo = new window.Tsuikyo({flex: 'flex', prevent: true, im: 'roma'});
tsuikyo.listen();

class Game extends React.Component {
  static propTypes = {
    lyricPages: PropTypes.arrayOf(
        PropTypes.shape({
          lyrics: PropTypes.arrayOf(PropTypes.object).isRequired,
        }),
    ).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      lyricPageCharPoses: Array(4).fill(0),
      pageCount: 0,
      rowCount: 0,
      keysPos: 0,
      keys: '',
    };

    // マウントされるまでちょっと待つ。
    // TODO: ボタンかなにかをトリガにする
    setTimeout(() => {
      this.startRowTypingIfNeeded();
    }, 100);
  }

  startRowTypingIfNeeded() {
    const lyricRow = this.props.lyricPages[this.state.pageCount].lyrics[this.state.rowCount];
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

  render() {
    return (
        <div className="game">
          <LyricBox
              lyrics={this.props.lyricPages[this.state.pageCount].lyrics}
              charPoses={this.state.lyricPageCharPoses}
          />
          <KeysBox
              keys={this.state.keys}
              charPos={this.state.keysPos}
          />
        </div>
    );
  }
}

// ========================================

ReactDOM.render(
    (
        <Game lyricPages={lyricPages} />
    ),
    document.getElementById('root'),
);
