import {playMode} from 'common/js/config';
import {getSearch} from 'common/js/searchHistory';

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  discSongList: [],
  disc: null,
  searchHistory: getSearch(),
  rankList: []
};

export default state;
