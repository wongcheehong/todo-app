import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, Text, FlatList, StyleSheet} from 'react-native';
import {FAB} from '@rneui/themed';
import ActionButtonGroup from '../components/ActionButtonGroup';
import {
  deleteSubTask,
  readTodo,
  editSubTask,
  checkSubTask,
} from '../utils/dbHelper';
import Dialog from 'react-native-dialog';

function TodoDetailScreen({route, navigation}) {
  const [todo, setTodo] = useState(route.params.item);
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [subTaskTitle, setSubTaskTitle] = useState('');

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      const todoItem = await readTodo(todo.id);
      setTodo(todoItem);
    };
    if (isSubscribed) {
      fetchData();
    }

    return () => {
      isSubscribed = false;
    };
  }, [todo.id]);

  const updateTodo = item => {
    setTodo(item);
  };

  const addSubtask = todo => {
    navigation.push('AddSubtask', {todo, updateTodo});
  };

  const onEditSubTask = (subTaskId, title) => {
    setSelectedId(subTaskId);
    setSubTaskTitle(title);
    showDialog();
  };

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleConfirm = async () => {
    setVisible(false);
    setSubTaskTitle('');
    await editSubTask(todo.id, selectedId, subTaskTitle);
    const newTodo = await readTodo(todo.id);
    updateTodo(newTodo);
  };

  const onDeleteSubTask = async (todoId, subTaskId) => {
    await deleteSubTask(todoId, subTaskId);
    const newTodo = await readTodo(todoId);
    updateTodo(newTodo);
  };

  const onCheck = async (todoId, subTaskId) => {
    await checkSubTask(todoId, subTaskId);
    const newTodo = await readTodo(todoId);
    updateTodo(newTodo);
  };

  const renderItem = (todoId, {item}) => {
    return (
      <View
        style={
          item.completed
            ? [styles.listItem, {backgroundColor: '#808080'}]
            : styles.listItem
        }>
        <View>
          <Text
            style={
              item.completed
                ? [styles.subTaskTitle, {textDecorationLine: 'line-through'}]
                : styles.subTaskTitle
            }>
            {item.title}
          </Text>
          <Text style={styles.subTaskSubTitle}>
            Created at {item.createdAt}
          </Text>
          {item.updatedAt && <Text>Updated at {item.updatedAt}</Text>}
        </View>
        <ActionButtonGroup
          onEdit={onEditSubTask.bind(this, item.id, item.title)}
          onDelete={onDeleteSubTask.bind(this, todoId, item.id)}
          onCheck={onCheck.bind(this, todoId, item.id)}
          checkStatus={item.completed}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View>
        <Text style={styles.title}>
          Title: <Text style={styles.innerText}>{todo.title}</Text>
        </Text>
        <Text style={styles.title}>
          Created at <Text style={styles.innerText}>{todo.createdAt}</Text>
        </Text>
        {todo.updatedAt && (
          <Text style={styles.title}>
            Updated at <Text style={styles.innerText}>{todo.updatedAt}</Text>
          </Text>
        )}
      </View>
      <View style={styles.subTaskContainer}>
        <Text style={styles.title}>My Subtask</Text>
        <FlatList
          data={todo.subTasks}
          renderItem={renderItem.bind(this, todo.id)}
          keyExtractor={subtask => subtask.id}
        />
      </View>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Change Title</Dialog.Title>
        <Dialog.Input
          onChangeText={value => setSubTaskTitle(value)}
          value={subTaskTitle}
        />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Confirm" onPress={handleConfirm} />
      </Dialog.Container>
      <FAB
        icon={{name: 'add', color: 'white'}}
        color="blue"
        placement="right"
        onPress={addSubtask.bind(this, todo)}
      />
    </SafeAreaView>
  );
}

export default TodoDetailScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  innerText: {
    fontWeight: 'normal',
  },
  subTaskContainer: {
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#17d6f4',
  },
  subTaskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  subTaskSubTitle: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#3f3e3e',
  },
});
