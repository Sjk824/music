const KEY = 'search';

export const getSearch = function() {
  const locHisString = localStorage.getItem(KEY);
  let searchHistory;
  try {
    searchHistory = JSON.parse(locHisString);
  } catch (e) {
    searchHistory = [];
  }
  if (!Array.isArray(searchHistory)) {
    searchHistory = [];
  }
  return searchHistory;
};

export const addSearch = function(itemName) {
  let searchHistory = getSearch();
  const index = searchHistory.indexOf(itemName);
  if (index >= 0) {
    searchHistory.splice(index, 1);
  }
  searchHistory.unshift(itemName);
  localStorage.setItem(KEY, JSON.stringify(searchHistory));
  return searchHistory;
};

export const deleteSearch = function(index) {
  let searchHistory = getSearch();
  searchHistory.splice(index, 1);
  localStorage.setItem(KEY, JSON.stringify(searchHistory));
  return searchHistory;
};

export const clearSearch = function() {
  localStorage.setItem(KEY, JSON.stringify([]));
  return [];
};
