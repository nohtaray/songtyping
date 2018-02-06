import {take, call, put, fork, takeEvery} from 'redux-saga/effects';
import {all, eventChannel, END} from 'redux-saga';
import {acceptStroke, beginWord, finishWord, rejectStroke} from './actions';

/**
 * @param tw {Word} TsuikyoWord
 * @returns {Channel<any>}
 */
function handleStroke(tw) {
  return eventChannel(emit => {
    tw.listen(e => {
      const keyPos = tw.kpos();
      const kanaPos = tw.pos();
      const keys = tw.kstr();

      if (e.finish) {
        emit(finishWord({keyPos, kanaPos, keys}));
        emit(END);
      } else if (e.accept) {
        emit(acceptStroke({keyPos, kanaPos, keys}));
      } else if (e.miss) {
        emit(rejectStroke({keyPos, kanaPos, keys}));
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
  yield put(beginWord({keys: tw.kstr()}));

  const channel = yield call(handleStroke, tw);
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