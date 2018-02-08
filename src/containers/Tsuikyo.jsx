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
    hiragana: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.tsuikyo = null;
  }

  componentDidMount() {
    this.tsuikyo = new window.Tsuikyo({
      flex: 'flex',
      prevent: true,
      im: 'roma',
    });
  }

  componentWillUnmount() {
    this.word.sleep();
    this.tsuikyo.sleep();
  }

  componentDidUpdate() {
    if (this.word) this.word.sleep();

    const {hiragana, onBeginWord} = this.props;
    if (hiragana) {
      this.word = this.tsuikyo.make(hiragana).listen(e => this.handleStroke(e));
      onBeginWord(this.word);
    }
  }

  handleStroke(e) {
    if (e.test) return;

    const {onAccept, onReject, onFinish} = this.props;

    if (e.accept) {
      onAccept(this.word);
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
      hiragana: state.kana || '',
      // 2行同じ歌詞が連続で来たとき対策
      identifier: `${state.page} ${state.rowPos}`
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
