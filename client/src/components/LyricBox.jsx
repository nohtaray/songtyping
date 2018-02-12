import React from 'react';
import LyricRow from './LyricRow';

/**
 * @param lyrics {Object[]}
 * @param kanaPoses {Number[]}
 * @param colors {string[]}
 * @returns {*}
 */
export default ({lyrics, kanaPoses, colors}) => {
  const lyricRows = lyrics.map((lyric, i) => {
    return (
        <LyricRow
            key={i}
            kanji={lyric.kanji}
            hiragana={lyric.hiragana}
            kanaPos={kanaPoses[i]}
            color={colors[i]} />
    );
  });

  return (
      <div className="lyric_box">
        {lyricRows}
      </div>
  );
};
