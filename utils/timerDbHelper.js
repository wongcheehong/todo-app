import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import moment from 'moment';

const STORAGE_KEY = '@timer_list';

const readTimers = async () => {
  try {
    let timers = await AsyncStorage.getItem(STORAGE_KEY);
    timers = JSON.parse(timers);
    return timers || [];
  } catch (e) {
    console.log('Failed to fetch the timers from storage');
  }
};

const writeTimer = async () => {
  try {
    const timer = {
      id: uuid.v4(),
      status: 'Working',
      attempt: 0,
      createdAt: moment().format('DD/MM/YYYY h:mm:ss A'),
      countDownTo: moment().add(5, 'seconds').format('DD/MM/YYYY h:mm:ss A'),
    };
    let timers = await readTimers();
    timers.push(timer);
    const jsonValue = JSON.stringify(timers);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    return timer;
  } catch (e) {
    console.log('There is an error storing the timer data', e);
  }
};

const readTimer = async id => {
  try {
    let timers = await AsyncStorage.getItem(STORAGE_KEY);
    if (timers !== null) {
      timers = JSON.parse(timers);
      return timers.find(timer => timer.id === id);
    }
    return null;
  } catch (e) {
    console.log('Failed to fetch the timer from storage');
  }
};

const updateTimer = async (id, updateInfo) => {
  try {
    let timers = await AsyncStorage.getItem(STORAGE_KEY);
    if (timers !== null) {
      timers = JSON.parse(timers);
      // Replace timer with updated timer
      const index = timers.findIndex(item => item.id === id);
      let timer = timers[index];
      timer = {...timer, ...updateInfo};
      timers[index] = timer;
      const jsonValue = JSON.stringify(timers);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      return timer;
    }
    return null;
  } catch (e) {
    console.log('Failed to update the timer');
  }
};

export {readTimers, writeTimer, readTimer, updateTimer};
