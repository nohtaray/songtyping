import {createAction} from 'redux-actions';

export const ACCEPT_STROKE = '@@app/ACCEPT_STROKE';
export const REJECT_STROKE = '@@app/REJECT_STROKE';
export const FINISH_WORD = '@@app/FINISH_WORD';

export const acceptStroke = createAction(
    ACCEPT_STROKE,
    ({keyPos, kanaPos}) => ({keyPos, kanaPos}),
);
export const rejectStroke = createAction(
    REJECT_STROKE,
    ({keyPos, kanaPos}) => ({keyPos, kanaPos}),
);
export const finishWord = createAction(
    FINISH_WORD,
    (({keyPos, kanaPos}) => ({keyPos, kanaPos})),
);
