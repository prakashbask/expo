import mapValues from 'lodash/mapValues';
import { AsyncStorage } from 'react-native';

import * as Kernel from '../kernel/Kernel';
import addListenerWithNativeCallback from '../utils/addListenerWithNativeCallback';

type Settings = object;

const Keys = mapValues(
  {
    Session: 'session',
    History: 'history',
    Settings: 'settings',
  },
  value => `Exponent.${value}`
);

async function getSettingsAsync(): Promise<Settings> {
  let json = await AsyncStorage.getItem(Keys.Settings);
  if (!json) {
    return {};
  }

  try {
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
}

async function updateSettingsAsync(updatedSettings: Partial<Settings>): Promise<void> {
  let currentSettings = await getSettingsAsync();
  let newSettings = {
    ...currentSettings,
    ...updatedSettings,
  };

  await AsyncStorage.setItem(Keys.Settings, JSON.stringify(newSettings));
}

async function getSessionAsync() {
  let results = await Kernel.getSessionAsync();
  if (!results) {
    // NOTE(2018-11-8): we are migrating to storing all session keys
    // using the Kernel module instead of AsyncStorage, but we need to
    // continue to check the old location for a little while
    // until all clients in use have migrated over
    let json = await AsyncStorage.getItem(Keys.Session);
    if (json) {
      try {
        results = JSON.parse(json);
        await saveSessionAsync(results);
        await AsyncStorage.removeItem(Keys.Session);
      } catch (e) {
        return null;
      }
    }
  }

  return results;
}

async function saveSessionAsync(session): Promise<void> {
  await Kernel.setSessionAsync(session);
}

async function getHistoryAsync() {
  let jsonHistory = await AsyncStorage.getItem(Keys.History);
  if (jsonHistory) {
    try {
      return JSON.parse(jsonHistory);
    } catch (e) {
      console.error(e);
    }
  }
  return [];
}

async function saveHistoryAsync(history): Promise<void> {
  await AsyncStorage.setItem(Keys.History, JSON.stringify(history));
}

async function clearHistoryAsync(): Promise<void> {
  await AsyncStorage.removeItem(Keys.History);
}

async function removeSessionAsync(): Promise<void> {
  await Kernel.removeSessionAsync();
}

// adds a hook for native code to query Home's history.
// needed for routing push notifications in Home.
addListenerWithNativeCallback('ExponentKernel.getHistoryUrlForExperienceId', async event => {
  const { experienceId } = event;
  let history = await getHistoryAsync();
  history = history.sort((item1, item2) => {
    // date descending -- we want to pick the most recent experience with this id,
    // in case there are multiple (e.g. somebody was developing against various URLs of the
    // same app)
    let item2time = item2.time ? item2.time : 0;
    let item1time = item1.time ? item1.time : 0;
    return item2time - item1time;
  });
  let historyItem = history.find(item => item.manifest && item.manifest.id === experienceId);
  if (historyItem) {
    return { url: historyItem.url };
  }
  return {};
});

export default {
  clearHistoryAsync,
  getSessionAsync,
  getHistoryAsync,
  getSettingsAsync,
  saveHistoryAsync,
  saveSessionAsync,
  removeSessionAsync,
  updateSettingsAsync,
};
