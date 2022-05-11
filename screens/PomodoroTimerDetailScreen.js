import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import {updateTimer, writeTimer} from '../utils/timerDbHelper';
import moment from 'moment';

const PomodoroTimerDetailScreen = ({route, navigation}) => {
  const [createMode, setCreateMode] = useState(route.params.createMode);
  const [timer, setTimer] = useState(() => {
    if (!createMode) {
      return route.params.item;
    }
  });

  const [status, setStatus] = useState(() => {
    if (createMode) {
      return 'Not Started';
    } else {
      return timer.status;
    }
  });

  const calculateTimeLeft = useCallback(() => {
    if (createMode) {
      return '25:00';
    }
    const zeroPad = (num, places) => String(num).padStart(places, '0');

    const countDownTo = moment(timer.countDownTo, 'DD/MM/YYYY h:mm:ss A');
    const timeLeft = countDownTo.diff(moment(), 'seconds');
    if (timeLeft <= 0) {
      const attempt = timer.attempt + 1;
      const updateInfo = {
        attempt,
      };
      if (status === 'Working') {
        if (attempt % 5 === 0) {
          updateInfo.countDownTo = moment()
            .add(20, 'seconds')
            .format('DD/MM/YYYY h:mm:ss A');
        } else {
          updateInfo.countDownTo = moment()
            .add(60, 'seconds')
            .format('DD/MM/YYYY h:mm:ss A');
        }
        setStatus('Break');
      } else if (status === 'Break') {
        updateInfo.countDownTo = moment()
          .add(10, 'seconds')
          .format('DD/MM/YYYY h:mm:ss A');
        setStatus('Working');
      }

      updateTimer(timer.id, updateInfo).then(updatedTimer => {
        setTimer(updatedTimer);
      });
    }

    const minutes = timeLeft / 60;
    const seconds = timeLeft % 60;
    return `${zeroPad(minutes.toFixed(0), 2)}:${zeroPad(
      seconds.toFixed(0),
      2,
    )}`;
  }, [createMode, status, timer]);

  const [timerText, setTimerText] = useState(calculateTimeLeft());

  useEffect(() => {
    if (createMode) {
      return;
    }

    let intervalID;
    if (status === 'Working' || status === 'Break') {
      intervalID = setInterval(() => {
        setTimerText(calculateTimeLeft());
      }, 1000);
    }

    return () => {
      clearInterval(intervalID);
    };
  }, [calculateTimeLeft, createMode, status]);

  const [buttonText, setButtonText] = useState(() => {
    switch (status) {
      case 'Not Started':
        return 'Start';
      case 'Working':
      case 'Break':
        return 'Stop';
      default:
        return 'End';
    }
  });

  const buttonHandler = async () => {
    switch (status) {
      case 'Not Started':
        const timerObj = await writeTimer();
        setTimer(timerObj);
        setStatus('Working');
        setCreateMode(false);
        setButtonText('Stop');
        break;
      case 'Working':
        setStatus('Failed');
        setButtonText('End');
        break;
      case 'Break':
        setStatus('End');
        setButtonText('End');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
      <View>
        <Text style={styles.timerText}>{timerText}</Text>
      </View>
      <Pressable onPress={buttonHandler}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default PomodoroTimerDetailScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: '20%',
    backgroundColor: '#ffffff1A',
  },
  statusContainer: {
    backgroundColor: 'red',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },
  timerText: {
    fontSize: 100,
    fontFamily: 'arial',
    color: '#5b5959',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  buttonText: {
    color: '#D95550',
    fontWeight: 'bold',
    fontSize: 22,
  },
});
