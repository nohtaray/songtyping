import {call, fork, put, take, select} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import io from 'socket.io-client';
import {
  acceptStroke, newChat, othersAcceptStroke, pushStartButton, sendChat,
  startGame,
} from '../actions';
import {getRowPos} from './selectors';

const EVENT_START_GAME = 'startGame';
const EVENT_ACCEPT_STROKE = 'acceptStroke';
const EVENT_NEW_CHAT = 'newChat';

// 真似しよう
// https://github.com/kuy/redux-saga-chat-example/blob/87e6db31df5fa54b9d368cd6975d74c550fdc860/src/client/sagas.js
function connect() {
  const socket = io();
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
}

function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function subscribe(socket) {
  return eventChannel(emit => {
    socket.on(EVENT_START_GAME, payload => {
      emit(startGame(payload));
    });
    socket.on(EVENT_ACCEPT_STROKE, payload => {
      emit(othersAcceptStroke(payload));
    });
    socket.on(EVENT_NEW_CHAT, payload => {
      emit(newChat(payload));
    });
    return () => {};
  });
}

function* watchForStartGame(socket) {
  while (true) {
    yield take(`${pushStartButton}`);
    socket.emit(EVENT_START_GAME);
  }
}

function* watchAcceptStroke(socket) {
  while (true) {
    const action = yield take(`${acceptStroke}`);
    const {kanaPos} = action.payload;
    const rowPos = yield select(getRowPos);

    socket.emit(EVENT_ACCEPT_STROKE, {
      rowPos, kanaPos,
    });
  }
}

function* watchSendChat(socket) {
  while (true) {
    const action = yield take(`${sendChat}`);
    const {message} = action.payload;

    socket.emit(EVENT_NEW_CHAT, {message});
  }
}

export default function* socketIO() {
  const socket = yield call(connect);
  yield fork(read, socket);
  yield fork(watchForStartGame, socket);
  yield fork(watchAcceptStroke, socket);
  yield fork(watchSendChat, socket);
}
