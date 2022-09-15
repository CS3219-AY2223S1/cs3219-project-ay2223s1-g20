import { MATCH_ID } from "../util/constants";

export const getStorageValue = (key, defaultValue) => {
  const saved = localStorage.getItem(key);
  const initial = JSON.parse(saved);
  return initial || defaultValue;
}

export const setStorageValue = (key, value) => {
    localStorage.setItem(key, value);
};

export const removeStorageValue = (key) => {
    localStorage.removeItem(key);
}

export const getMatchId = () => {
    return getStorageValue(MATCH_ID, null);
}

export const removeMatchID = () => {
    removeStorageValue(MATCH_ID);
}

export const isInRoom = () => {
    return getMatchId() != null;
}