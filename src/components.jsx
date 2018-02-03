import React from 'react';
import PropTypes from 'prop-types';

// Components

class LyricRowHiragana extends React.Component {
  static propTypes = {
    charPos: PropTypes.number.isRequired,
    hiragana: PropTypes.string.isRequired,
  };

  render() {
    let done = this.props.hiragana.slice(0, this.props.charPos);
    let remains = this.props.hiragana.slice(this.props.charPos);
    return (
        <div className="lyric_row_hiragana">
          <span className="lyric_done">{done}</span>
          <span className="lyric_remains">{remains}</span>
        </div>
    );
  }
}

class LyricRowKanji extends React.Component {
  static propTypes = {
    kanji: PropTypes.string.isRequired,
  };

  render() {
    return (
        <div className="lyric_row_kanji">
          {this.props.kanji}
        </div>
    );
  }
}

class LyricRow extends React.Component {
  static propTypes = {
    hiragana: PropTypes.string.isRequired,
    kanji: PropTypes.string.isRequired,
    charPos: PropTypes.number.isRequired,
  };

  render() {
    return (
        <div className="lyric_row">
          <LyricRowHiragana
              hiragana={this.props.hiragana}
              charPos={this.props.charPos} />
          <LyricRowKanji
              kanji={this.props.kanji} />
        </div>
    );
  }
}

class LyricBox extends React.Component {
  static propTypes = {
    lyrics: PropTypes.arrayOf(PropTypes.object).isRequired,
    charPoses: PropTypes.arrayOf(PropTypes.number).isRequired,
  };

  render() {
    const lyricRows = [...Array(4)].map((_, i) => {
      return (
          <LyricRow
              key={i}
              kanji={this.props.lyrics[i].kanji}
              hiragana={this.props.lyrics[i].hiragana}
              charPos={this.props.charPoses[i]} />
      );
    });

    return (
        <div className="lyric_box">
          {lyricRows}
        </div>
    );
  }
}

class KeysBox extends React.Component {
  static propTypes = {
    charPos: PropTypes.number,
    keys: PropTypes.string,
  };

  render() {
    let done = this.props.keys.slice(0, this.props.charPos).toUpperCase();
    let remains = this.props.keys.slice(this.props.charPos).toUpperCase();
    return (
        <div className="keys_box">
          <span className="keys_done">{done}</span>
          <span className="keys_remains">{remains}</span>
        </div>
    );
  }
}

export {LyricBox, KeysBox};
