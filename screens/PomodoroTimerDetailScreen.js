import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import {
  writeTimer,
  updateTimer as updateTimerHelper,
} from '../utils/timerDbHelper';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionCreators} from '../state/index';

const PomodoroTimerDetailScreen = ({route, navigation}) => {
  const [createMode, setCreateMode] = useState(route.params.createMode);
  const [timer, setTimer] = useState(() => {
    if (!createMode) {
      return route.params.item;
    }
  });
  const dispatch = useDispatch();

  const {updateTimer, addTimer} = bindActionCreators(actionCreators, dispatch);

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

    const countDownTo = moment(timer.countDownTo, 'DD/MM/YYYY h:mm:ss A');
    let timeLeft = countDownTo.diff(moment(), 'seconds');
    if (timeLeft <= 0) {
      timeLeft = 0;
      const attempt = timer.attempt + 1;
      const updateInfo = {
        attempt,
      };
      if (status === 'Working') {
        if (attempt % 5 === 0) {
          updateInfo.countDownTo = moment()
            .add(22, 'seconds')
            .format('DD/MM/YYYY h:mm:ss A');
        } else {
          updateInfo.countDownTo = moment()
            .add(7, 'seconds')
            .format('DD/MM/YYYY h:mm:ss A');
        }
      } else if (status === 'Break') {
        updateInfo.countDownTo = moment()
          .add(12, 'seconds')
          .format('DD/MM/YYYY h:mm:ss A');
      }

      // dispatch(updateTimer(timer.id, updateInfo));
      // setStatus(status === 'Working' ? 'Break' : 'Working');
      updateTimerHelper(timer.id, updateInfo).then(updatedTimer => {
        setTimer(updatedTimer);
        setStatus(status === 'Working' ? 'Break' : 'Working');
      });
    }

    return timeLeft;
  }, [createMode, status, timer]);

  const formatTime = time => {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    const minutes = parseInt(time / 60, 10);
    const seconds = time % 60;
    return `${zeroPad(minutes.toFixed(0), 2)}:${zeroPad(
      seconds.toFixed(0),
      2,
    )}`;
  };

  const [timerText, setTimerText] = useState(calculateTimeLeft());

  useEffect(() => {
    if (createMode) {
      return;
    }

    let intervalID;
    setTimerText(formatTime(calculateTimeLeft()));
    if (status === 'Working' || status === 'Break') {
      intervalID = setInterval(() => {
        setTimerText(formatTime(calculateTimeLeft()));
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
        addTimer(timerObj);
        setTimer(timerObj);
        setStatus('Working');
        setCreateMode(false);
        setButtonText('Stop');
        break;
      case 'Working':
        // await updateTimer(timer.id, {status: 'Failed'});
        dispatch(updateTimer(timer.id, {status: 'Failed'}));
        setStatus('Failed');
        setButtonText('End');
        break;
      case 'Break':
        // await updateTimer(timer.id, {status: 'End'});
        dispatch(updateTimer(timer.id, {status: 'End'}));
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
