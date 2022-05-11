import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './screens/HomeScreen';
import TodoDetailScreen from './screens/TodoDetailScreen';
import AddSubtaskScreen from './screens/AddSubtaskScreen';
import PomodoroTimerScreen from './screens/PomodoroTimerScreen';
import PomodoroTimerDetailScreen from './screens/PomodoroTimerDetailScreen';
import LoginScreen from './screens/LoginScreen';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginContextProvider, {LoginContext} from './context/LoginContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  const LoginCtx = useContext(LoginContext);

  const isLoggedIn = () => {
    if (LoginCtx.isLogin) {
      return (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Details" component={TodoDetailScreen} />
          <Stack.Screen
            name="AddSubtask"
            component={AddSubtaskScreen}
            options={{title: 'Add Subtask'}}
          />
        </>
      );
    }

    return (
      <>
        <Stack.Screen
          name="SignIn"
          component={LoginScreen}
          options={{title: 'Sign In'}}
        />
      </>
    );
  };

  return <Stack.Navigator>{isLoggedIn()}</Stack.Navigator>;
}

function PomodoroTimerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PomodoroTimer" component={PomodoroTimerScreen} />
      <Stack.Screen
        name="PomodoroTimerDetail"
        component={PomodoroTimerDetailScreen}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <LoginContextProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="HomeTab"
            component={HomeStack}
            options={{
              headerShown: false,
              title: 'Todos',
              tabBarLabel: 'Home',
              tabBarIcon: ({color, size}) => (
                <AntDesignIcon name="home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Second"
            component={PomodoroTimerStack}
            options={{
              headerShown: false,
              title: 'Pomodoro Timer',
              tabBarLabel: 'Pomodoro',
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcon name="timer" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </LoginContextProvider>
  );
};

export default App;
