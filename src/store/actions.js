import * as types from './mutation-types';
import {playMode} from 'common/js/config';
import {addSearch,deleteSearch,clearSearch} from 'common/js/searchHistory';

export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAY_LIST, list);
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING, true);
};

export const selectRondomPlay = function({commit, state}, list) {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAY_LIST, list);
  commit(types.SET_CURRENT_INDEX, Math.floor(Math.random() * list.length) );
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING, true);
  commit(types.SET_MODE, playMode.random);
};

export const addSearchHistory = function({commit, state}, itemName) {
  commit(types.SET_SEARCH_HISTORY, addSearch(itemName));
};

export const clearSearchHistory = function({commit, state}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};

export const deleteSearchHistory = function({commit, state}, index) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(index));
};
