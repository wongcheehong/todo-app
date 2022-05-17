import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
  ScrollView,
} from 'react-native';
import {BarChart, PieChart} from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import {findTodos} from '../utils/dbHelper';
import {findTimers} from '../utils/timerDbHelper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {Card} from '@rneui/themed';
import {useSelector} from 'react-redux';
import Timeline from 'react-native-timeline-flatlist';

const screenWidth = Dimensions.get('window').width;

const StatisticsScreen = ({navigation}) => {
  const [todosData, setTodosData] = useState([]);
  const [timersData, setTimersData] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const todoList = useSelector(state => state.todos);
  const timerList = useSelector(state => state.timers);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const formatDate = date => {
    return moment(date).format('DD/MM/YYYY');
  };

  useEffect(() => {
    findTodos(formatDate(date)).then(todos => {
      if (todos.length === 0) {
        setTodosData([]);
        return;
      }
      let completedNum = 0;
      let uncompletedNum = 0;
      for (const todo of todos) {
        if (todo.completed) {
          completedNum++;
        } else {
          uncompletedNum++;
        }
      }
      const data = [
        {
          name: 'Completed',
          value: completedNum,
          color: 'rgba(131, 167, 234, 1)',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
        {
          name: 'Uncompleted',
          value: uncompletedNum,
          color: 'rgb(0, 0, 255)',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
      ];
      setTodosData(data);
    });
    findTimers(formatDate(date)).then(timers => {
      if (timers.length === 0) {
        setTimersData(null);
        return;
      }
      const attemptList = [];
      const timeList = [];
      const timeLineData = [];
      for (const timer of timers) {
        attemptList.push(timer.attempt);
        const time = moment(timer.createdAt, 'DD/MM/YYYY h:mm:ss A').format(
          'H:mm',
        );
        timeList.push(time);
        timeLineData.push({
          time,
          title: timer.status,
          description: `Attempt: ${timer.attempt}`,
        });
      }
      const barData = {
        labels: timeList,
        datasets: [
          {
            data: attemptList,
          },
        ],
      };
      setTimersData({
        barData,
        timeLineData,
      });
    });
  }, [date, todoList, timerList]);

  const pieConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  };

  const barConfig = {
    backgroundGradientFrom: '#9579D2',
    backgroundGradientTo: '#4062BF',
    color: () => '#fff',
    strokeWidth: 2,
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <ScrollView>
        <Pressable onPress={showDatepicker} style={styles.datePickerContainer}>
          <View>
            <Text>{formatDate(date)}</Text>
          </View>
          <Icon name="calendar" size={30} color="#253858" />
        </Pressable>
        <Card>
          <Card.Title>Todo Statistics</Card.Title>
          <Card.Divider />
          <View>
            {todosData.length > 0 ? (
              <PieChart
                data={todosData}
                width={(screenWidth * 80) / 100}
                height={220}
                chartConfig={pieConfig}
                accessor={'value'}
                backgroundColor={'transparent'}
                paddingLeft={'10'}
                absolute
              />
            ) : (
              <Text>You do not have any todo on this date</Text>
            )}
          </View>
        </Card>
        <Card>
          <Card.Title>Timer Statistics</Card.Title>
          <Card.Divider />
          <View style={styles.chartContainer}>
            {timersData ? (
              <ScrollView horizontal={true} vertical={true}>
                <View>
                  <BarChart
                    data={timersData.barData}
                    width={timersData.barData.labels.length * 65}
                    height={250}
                    chartConfig={barConfig}
                    withInnerLines={false}
                    showValuesOnTopOfBars={true}
                    backgroundColor={'transparent'}
                  />
                </View>
              </ScrollView>
            ) : (
              <Text>You have no timer on this date.</Text>
            )}
          </View>
        </Card>
        <Card>
          <Card.Title>Timer Timeline</Card.Title>
          <Card.Divider />
          <View style={styles.chartContainer}>
            {timersData ? (
              <ScrollView horizontal={true} vertical={true}>
                <View style={styles.timeLineContainer}>
                  <Timeline
                    style={styles.list}
                    data={timersData.timeLineData}
                    circleSize={20}
                    circleColor="rgb(45,156,219)"
                    lineColor="rgb(45,156,219)"
                    timeStyle={styles.timerStyle}
                    descriptionStyle={{color: 'gray'}}
                    innerCircle={'dot'}
                  />
                </View>
              </ScrollView>
            ) : (
              <Text>You have no timer on this date.</Text>
            )}
          </View>
        </Card>
      </ScrollView>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </SafeAreaView>
  );
};

export default StatisticsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    marginHorizontal: 15,
    overflow: 'visible',
    marginBottom: 10,
  },
  datePickerContainer: {
    marginVertical: 10,
    marginLeft: 15,
    padding: 5,
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#808080',
  },
  chartContainer: {
    flex: 1,
  },
  timeLineContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  list: {
    flex: 1,
  },
  timerStyle: {
    textAlign: 'center',
    backgroundColor: '#ff9797',
    color: 'white',
    padding: 5,
    borderRadius: 10,
  },
});
