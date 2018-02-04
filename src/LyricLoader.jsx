import React from 'react';
import PropTypes from 'prop-types';

class LyricLoader extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    onLoad: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    fetch(this.props.src).then(res => res.text()).then(xml => {
      const lyric = this.parseXml(xml);
      this.props.onLoad(lyric);
    });
  }

  parseXml(xml) {
    const dom = (new DOMParser()).parseFromString(xml, 'text/xml');
    const pages = dom.querySelectorAll('data');

    return [].map.call(pages, (page) => {
          window.page = page;
          const time = page.querySelector('time').textContent * 100;
          const kanjiStr = page.querySelector('lyric').textContent;
          const hiraganaStr = page.querySelector('lyric_type').textContent;

          const kanjis = kanjiStr !== '' ? kanjiStr.split('*', 4) : [];
          const hiraganas = hiraganaStr !== '' ? hiraganaStr.split('*', 4) : [];
          return {
            time: time,
            lyrics: hiraganas.map((h, i) => {
              return {hiragana: h, kanji: kanjis[i]};
            }),
          };
        },
    );
  }

  render() {
    return '';
  }
}

export {LyricLoader};
