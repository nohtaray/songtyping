import React from 'react';
import LyricRow from './LyricRow';

/**
 * @param lyrics {Object[]}
 * @param charPoses {Number[]}
 * @returns {*}
 */
export default ({lyrics, charPoses}) => {
  const lyricRows = lyrics.map((lyric, i) => {
    return (
        <LyricRow
            key={i}
            kanji={lyric.kanji}
            hiragana={lyric.hiragana}
            charPos={charPoses[i]} />
    );
  });

  return (
      <div className="lyric_box">
        {lyricRows}
      </div>
  );
};

