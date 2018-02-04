import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import {Game} from './game.jsx';

const audioSrc = '/audio/romeo_and_cinderella.mp3';
const lyricSrc = '/lyric/romeo_and_cinderella.xml';

// ========================================

ReactDOM.render(
    (
        <div>
          <Game lyricSrc={lyricSrc} audioSrc={audioSrc} />
        </div>
    ),
    document.getElementById('root'),
);
