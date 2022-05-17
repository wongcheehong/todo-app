import React, {useRef, useEffect, useState} from 'react';
import {Text, StyleSheet, Animated} from 'react-native';
import ActionButtonGroup from '../ActionButtonGroup';
import {useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionCreators} from '../../state/index';

const TodoItem = ({todo, onEdit, onDelete}) => {
  const dispatch = useDispatch();
  const {checkTodo} = bindActionCreators(actionCreators, dispatch);

  const swipeAnim = useRef(new Animated.Value(1000)).current;
  const [completed, setCompleted] = useState(todo.completed);

  useEffect(() => {
    Animated.timing(swipeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  });

  const swipeToRightAndDelete = () => {
    Animated.timing(swipeAnim, {
      toValue: 1000,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setTimeout(() => onDelete(), 500);
  };
  const onCheck = id => {
    dispatch(checkTodo(id));
    setCompleted(previosuState => !previosuState);
  };

  return (
    <Animated.View
      style={
        completed
          ? [styles.todoItem, {left: swipeAnim, backgroundColor: '#808080'}]
          : [styles.todoItem, {left: swipeAnim}]
      }>
      <Text style={styles.innerText}>{todo.title}</Text>
      <ActionButtonGroup
        onEdit={onEdit}
        onDelete={swipeToRightAndDelete}
        onCheck={onCheck.bind(this, todo.id)}
        checkStatus={completed}
      />
    </Animated.View>
  );
};

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.todo.id === nextProps.todo.id &&
    prevProps.todo.title === nextProps.todo.title &&
    prevProps.todo.completed === nextProps.todo.completed
  );
};

export default React.memo(TodoItem, areEqual);

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
    marginHorizontal: 24,
    padding: 16,
    backgroundColor: '#4caaf2',
    borderRadius: 8,
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    shadowOpacity: 0.25,
  },
  innerText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
