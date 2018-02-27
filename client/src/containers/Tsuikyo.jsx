import React from 'react';
import {connect} from 'react-redux';
import {acceptStroke, beginWord, finishWord, rejectStroke} from '../actions';
import {PropTypes} from 'prop-types';

class Tsuikyo extends React.Component {
  static propTypes = {
    onAccept: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    onBeginWord: PropTypes.func.isRequired,

    im: PropTypes.string.isRequired,
    hiragana: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.tsuikyo = null;
    this.word = null;
  }

  componentWillUnmount() {
    this.word.sleep();
    this.tsuikyo.sleep();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.identifier !== this.props.identifier;
  }

  componentDidUpdate() {
    // hiragana はなくても sleep しないと前のワードが残る
    if (this.word) this.word.sleep();

    const {hiragana, onBeginWord} = this.props;
    if (hiragana) {
      this.refreshWord(hiragana);
      onBeginWord(this.word);
    }
  }

  refreshTsuikyo() {
    // 新しくつくる前に sleep しないと多重にキーイベントを拾っちゃう
    if (this.tsuikyo) this.tsuikyo.sleep();
    this.tsuikyo = new window.Tsuikyo({
      flex: 'flex',
      prevent: true,
      im: this.props.im,
    });
  }

  refreshWord(hiragana) {
    // 新しくつくる前に sleep しないと多重にキーイベントを拾っちゃう
    if (this.word) this.word.sleep();
    this.refreshTsuikyo();
    this.word = this.tsuikyo.make(hiragana).listen(e => this.handleStroke(e));
  }

  handleStroke(e) {
    if (e.test || e.keyChar === ' ') return;

    const {onAccept, onReject, onFinish} = this.props;

    if (e.accept) {
      onAccept(this.word);
      // スペースは打たなくていい
      while (this.word.nextKeys().toString() === [' '].toString()) {
        this.word.stroke(' ');
      }
    }
    if (e.miss) {
      // 大文字小文字反転して合ってたら受け付ける
      if (this.word.test(e.keyChar.toUpperCase()).accept) {
        return this.word.stroke(e.keyChar.toUpperCase());
      }
      if (this.word.test(e.keyChar.toLowerCase()).accept) {
        return this.word.stroke(e.keyChar.toLowerCase());
      }
      onReject(this.word);
    }
    if (e.finish) {
      onFinish(this.word);
    }
  }

  render() {
    return '';
  }
}

export default connect(
    state => ({
      im: state.im,
      hiragana: state.kana || '',
      // 2行同じ歌詞が連続で来たとき対策
      identifier: `${state.page} ${state.rowPos}`,
    }),
    dispatch => ({
      onBeginWord: tw => dispatch(beginWord({
        keys: tw.kstr(),
      })),
      onAccept: tw => dispatch(acceptStroke({
        keyPos: tw.kpos(),
        kanaPos: tw.pos(),
        keys: tw.kstr(),
      })),
      onReject: tw => dispatch(rejectStroke({
        keyPos: tw.kpos(),
        kanaPos: tw.pos(),
        keys: tw.kstr(),
      })),
      onFinish: tw => dispatch(finishWord({
        keyPos: tw.kpos(),
        kanaPos: tw.pos(),
        keys: tw.kstr(),
      })),
    }),
)(Tsuikyo);
