import {all, call, fork, put, take} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import {
  CAN_PLAY_THROUGH_AUDIO,
  COMPLETE_LOAD_LYRIC,
  completeLoadLyric,
  lyricTransition,
  START_GAME,
} from '../actions';
import socketIO from './socketio';

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

function* handleCompleteLoadResources() {
  const [lyricAction, audioAction] = yield all([
    take(COMPLETE_LOAD_LYRIC),
    take(CAN_PLAY_THROUGH_AUDIO),
  ]);

  // スタートするまでまつ
  yield take(START_GAME);

  const audio = audioAction.payload;
  audio.play();

  const lyrics = lyricAction.payload;
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
  yield fork(loadLyric);
  yield fork(handleCompleteLoadResources);
  yield fork(socketIO);
}