import {call, fork, put, take} from 'redux-saga/effects';
import {all, END, eventChannel} from 'redux-saga';
import {
  acceptStroke,
  beginWord,
  CAN_PLAY_THROUGH_AUDIO, COMPLETE_LOAD_LYRIC,
  completeLoadLyric,
  finishWord, lyricTransition,
  rejectStroke,
} from './actions';

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

function* handleCanPlayThroughAudio() {
  while (true) {
    const action = yield take(CAN_PLAY_THROUGH_AUDIO);
    const audio = action.payload;
    audio.play();
  }
}

function* loadLyric() {
  const parseXml = (xml) => {
    const dom = (new DOMParser()).parseFromString(xml, 'text/xml');
    const pages = dom.querySelectorAll('data');

    return [].map.call(pages, (page) => {
          window.page = page;
          const time = page.querySelector('time').textContent * 100;
          const kanjiStr = page.querySelector('lyric').textContent;
          const hiraganaStr = page.querySelector('lyric_type').textContent;

          const kanjis = kanjiStr !== '' ? kanjiStr.split('*', 4) : [];
          const hiraganas = hiraganaStr !== '' ? hiraganaStr.split('*', 4) : [];
          return {
            time: time,
            lyrics: hiraganas.map((h, i) => {
              return {hiragana: h, kanji: kanjis[i]};
            }),
          };
        },
    );
  };

  const src = '/lyric/romeo_and_cinderella.xml';
  const lyrics = yield call(() => {
    return fetch(src).then(res => res.text()).then(xml => {
      return parseXml(xml);
    });
  });
  yield put(completeLoadLyric(lyrics));
}

function setLyricTransitionTicker(times) {
  return eventChannel(emit => {
    const timerIds = times.map((time, i) => {
      return setTimeout(() => emit(i), time);
    });

    return () => timerIds.forEach((timerId) => clearTimeout(timerId));
  });
}

function* handleCompleteLoadLyric() {
  const action = yield take(COMPLETE_LOAD_LYRIC);

  const lyrics = action.payload;
  const times = lyrics.map(p => p.time);
  const tickChannel = yield call(setLyricTransitionTicker, times);

  try {
    while (true) {
      const page = yield take(tickChannel);
      yield put(lyricTransition(page));
      // 最後のページ来たら抜ける
      if (page >= lyrics.length - 1) {
        tickChannel.close();
      }
    }
  } finally {
    tickChannel.close();
  }
}

export default function* rootSaga() {
  yield fork(tsuikyoSaga);

  yield fork(handleCanPlayThroughAudio);

  yield fork(loadLyric);
  yield fork(handleCompleteLoadLyric);
}