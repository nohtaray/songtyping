import {take, call, put, fork, takeEvery} from 'redux-saga/effects';
import {all, eventChannel, END} from 'redux-saga';
import {acceptStroke, finishWord, rejectStroke} from './actions';

/**
 * @param tw {Word} TsuikyoWord
 * @returns {Channel<any>}
 */
function handleType(tw) {
  return eventChannel(emit => {
    tw.listen(e => {
      if (e.finish) {
        emit(finishWord());
        emit(END);
      } else if (e.accept) {
        emit(acceptStroke());
      } else if (e.miss) {
        emit(rejectStroke());
      }
    });

    // unsubscribe function
    return () => tw.sleep();
  });
}

/**
 * https://redux-saga.js.org/docs/advanced/Channels.html
 */
function* tsuikyoSaga() {
  const tsuikyo = new window.Tsuikyo({flex: 'flex', prevent: true, im: 'roma'});

  const tw = tsuikyo.make('わたしのこいを');
  const channel = yield call(handleType, tw);
  try {
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } finally {
    // うちおわった
  }
}

export default function* rootSaga() {
  yield fork(tsuikyoSaga);
}