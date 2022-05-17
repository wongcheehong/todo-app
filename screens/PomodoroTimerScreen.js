import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
} from 'react-native';
import {FAB, Card} from '@rneui/themed';
import {readTimers} from '../utils/timerDbHelper';
import {useSelector, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionCreators} from '../state/index';

const PomodoroTimerScreen = ({navigation}) => {
  const timers = useSelector(state => state.timers);
  const dispatch = useDispatch();

  const {setTimers} = bindActionCreators(actionCreators, dispatch);

  useEffect(() => {
    readTimers().then(timerList => setTimers(timerList));
  }, []);

  const addTimer = async () => {
    // Check if any timer running, if yes do not proceed.
    const timerList = await readTimers();
    const timer = timerList.find(
      timer => timer.status === 'Working' || timer.status === 'Break',
    );
    if (timer) {
      // dispatch(updateTimer(timer.id, {status: 'End'}));
      console.log('Timer is already running');
      return;
    }
    navigation.push('PomodoroTimerDetail', {createMode: true});
    console.log('Add timer...');
  };

  const viewTimer = async item => {
    navigation.push('PomodoroTimerDetail', {item});
  };

  const renderItem = ({item}) => {
    return (
      <Pressable
        onPress={viewTimer.bind(this, item)}
        disabled={item.status !== 'Working'}>
        <Card>
          <Card.Title>{item.status}</Card.Title>
          <Card.Divider />
          <View>
            <Text style={styles.cardText}>Attempt: {item.attempt}</Text>
            <Text style={styles.cardText}>Created at {item.createdAt}</Text>
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View>
        <FlatList
          data={timers.reverse()}
          renderItem={renderItem}
          keyExtractor={timer => timer.id}
        />
      </View>
      <FAB
        icon={{name: 'add', color: 'white'}}
        color="blue"
        placement="right"
        onPress={addTimer}
      />
    </SafeAreaView>
  );
};

export default PomodoroTimerScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
  },
  cardText: {
    color: '#000000',
  },
});
