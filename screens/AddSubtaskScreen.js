import React, {useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet, LogBox} from 'react-native';
import {FAB, Input} from '@rneui/themed';
import {addSubTask, readTodo} from '../utils/dbHelper';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const AddSubtaskScreen = ({route, navigation}) => {
  const [subTaskTitle, setSubTaskTitle] = useState('');
  const todo = route.params.todo;
  const updateTodo = route.params.updateTodo;

  const submitSubtask = async () => {
    await addSubTask(todo.id, subTaskTitle);
    const todoItem = await readTodo(todo.id);
    updateTodo(todoItem);
    navigation.pop();
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Add Subtask to {todo.title}</Text>
        <Input
          placeholder="Give your subtask a title"
          value={subTaskTitle}
          onChangeText={text => setSubTaskTitle(text)}
        />
      </View>
      <FAB
        title="Done"
        icon={{name: 'done', color: 'white'}}
        color="green"
        placement="right"
        onPress={submitSubtask}
      />
    </SafeAreaView>
  );
};

export default AddSubtaskScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    padding: 10,
  },
  inputTitle: {
    marginLeft: 10,
  },
});
