import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import {Game} from './game.jsx';
import App from './components/App';
import {createStore} from 'redux';
import reducer from './reducer';
import {Provider} from 'react-redux';

const audioSrc = '/audio/romeo_and_cinderella.mp3';
const lyricSrc = '/lyric/romeo_and_cinderella.xml';

// ========================================

let store = createStore(reducer);

ReactDOM.render(
    (
        <div>
          <Provider store={store}>
            <App />
          </Provider>
          {/* あとで消す */}
          <Game lyricSrc={lyricSrc} audioSrc={audioSrc} />
        </div>
    ),
    document.getElementById('root'),
);
