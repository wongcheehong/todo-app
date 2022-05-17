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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import LoginContextProvider, {LoginContext} from './context/LoginContext';
import StatisticsScreen from './screens/StatisticsScreen';
import {Provider} from 'react-redux';
import {store} from './state/store';
import ProductsScreen from './screens/Products/ProductsScreen';
import ProductDetailsScreen from './screens/Products/ProductDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import {useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionCreators} from './state/index';
import {readTimers} from './utils/timerDbHelper';

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

function ProductsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Marketplace" component={ProductsScreen} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailsScreen}
        options={{title: 'Product Detail'}}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <LoginContextProvider>
        <NavigationContainer>
          <Tab.Navigator initialRouteName="HomeTab">
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
              name="pomodoro"
              component={PomodoroTimerStack}
              options={{
                headerShown: false,
                title: 'Pomodoro Timer',
                tabBarLabel: 'Pomodoro',
                tabBarIcon: ({color, size}) => (
                  <MaterialCommunityIcon
                    name="timer"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="stats"
              component={StatisticsScreen}
              options={{
                title: 'Statistics',
                tabBarLabel: 'Statistics',
                tabBarIcon: ({color, size}) => (
                  <FoundationIcon name="graph-bar" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="market"
              component={ProductsStack}
              options={{
                headerShown: false,
                tabBarIcon: ({color, size}) => (
                  <FontAwesomeIcon
                    name="shopping-cart"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="profile"
              component={ProfileScreen}
              options={{
                title: 'Profile',
                tabBarIcon: ({color, size}) => (
                  <FontAwesomeIcon name="user" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </LoginContextProvider>
    </Provider>
  );
};

export default App;
