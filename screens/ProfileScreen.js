import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {Badge, Avatar, Card} from '@rneui/themed';
import {useSelector, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionCreators} from '../state/index';

import {readTimers, readTodos} from '../utils/timerDbHelper';

export default function ProfileScreen() {
  const {todos, timers} = useSelector(state => state);

  const dispatch = useDispatch();
  const {setTimers, setTodos} = bindActionCreators(actionCreators, dispatch);

  useEffect(() => {
    if (timers.length === 0) {
      readTimers().then(timerList => setTimers(timerList));
    }
    if (todos.length === 0) {
      readTodos().then(todoList => setTodos(todoList));
    }
  }, []);

  let points = todos.reduce((acc, todo) => {
    if (todo.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  points = timers.reduce((acc, timer) => {
    return acc + timer.attempt;
  }, points);

  return (
    <SafeAreaView style={styles.rootContainer}>
      <Card containerStyle={styles.card}>
        <View style={styles.profileInfoContainer}>
          <Avatar
            size={64}
            rounded
            source={{
              uri: 'https://randomuser.me/api/portraits/men/36.jpg',
            }}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>Wong Chee Hong</Text>
            <View style={styles.pointsContainer}>
              <Badge value={points} status="success" />
              <Text style={styles.pointsText}>Points</Text>
            </View>
          </View>
        </View>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    paddingVertical: 10,
    paddingHorizontal: 50,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'column',
    marginLeft: 30,
    justifyContent: 'space-between',
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#4309f4',
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsText: {
    color: 'black',
    marginLeft: 3,
    fontSize: 15,
  },
});
