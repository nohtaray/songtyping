import {call, fork, put, take} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import io from 'socket.io-client';
import {pushStartButton, startGame} from '../actions';

const EVENT_START_GAME = 'startGame';

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
    return () => {};
  });
}

function* watchForStartGame(socket) {
  while (true) {
    yield take(`${pushStartButton}`);
    socket.emit(EVENT_START_GAME);
  }
}

export default function* socketIO() {
  const socket = yield call(connect);
  yield fork(read, socket);
  yield fork(watchForStartGame, socket);
}
