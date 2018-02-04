import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import {Game} from './game.jsx';
import {AudioLoader} from './AudioLoader';

const audioSrc = '/audio/romeo_and_cinderella.mp3';
const lyricSrc = '/lyric/romeo_and_cinderella.xml';


// ========================================

ReactDOM.render(
    (
        <div>
          <AudioLoader src={audioSrc} onLoad={(audio) => audio.play()} />
          <Game lyricSrc={lyricSrc} />
        </div>
    ),
    document.getElementById('root'),
);
