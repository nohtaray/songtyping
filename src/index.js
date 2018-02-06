import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import {Game} from './game.jsx';
import App from './components/App';
import reducer from './reducer';
import {Provider} from 'react-redux';

import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import mySaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const audioSrc = '/audio/romeo_and_cinderella.mp3';
const lyricSrc = '/lyric/romeo_and_cinderella.xml';

// ========================================

const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(mySaga);

ReactDOM.render(
    (
        <div>
          <Provider store={store}>
            <App />
          </Provider>
          {/* あとで消す */}
          {/*<Game lyricSrc={lyricSrc} audioSrc={audioSrc} />*/}
        </div>
    ),
    document.getElementById('root'),
);
