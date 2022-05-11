import React, {useState, useEffect, useRef} from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  Animated,
  Pressable,
  LogBox,
} from 'react-native';
import TodoItem from '../components/Todo/TodoItemSwipe';
import {readTodos, storeTodos, deleteTodo, editTodo} from '../utils/dbHelper';
import Dialog from 'react-native-dialog';

LogBox.ignoreLogs(['ViewPropTypes will be removed from React Native']);

const Home = ({navigation}) => {
  const [inputValue, setInput] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    readTodos().then(todosList => {
      setTodos(todosList);
    });
  }, []);

  function onChangeText(value) {
    setInput(value);
  }

  async function onAdd() {
    console.log(inputValue);
    await storeTodos(inputValue, setTodos);
    setInput('');
  }

  function onEdit(id, title) {
    setSelectedId(id);
    setNewTitle(title);
    showDialog();
  }

  async function onDelete(id) {
    await deleteTodo(id);
    const newTodos = await readTodos();
    setTodos(newTodos);
  }

  const swipeInAnim = useRef(new Animated.Value(1000)).current;

  const swipeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(swipeInAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
    // swipeInAnim.setValue(1000);
  };

  function renderItem({item}) {
    swipeIn();
    return (
      <Animated.View style={{left: swipeInAnim}}>
        <Pressable
          onPress={() => {
            navigation.push('Details', {item});
          }}>
          <TodoItem
            todo={item}
            onEdit={onEdit.bind(this, item.id, item.title)}
            onDelete={onDelete.bind(this, item.id)}
          />
        </Pressable>
      </Animated.View>
    );
  }

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleConfirm = async () => {
    await editTodo(selectedId, newTitle);
    setVisible(false);
    setNewTitle('');
    const newTodos = await readTodos();
    setTodos(newTodos);
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your todo"
          onChangeText={onChangeText}
          value={inputValue}
        />
        <View style={styles.buttonContainer}>
          <Button onPress={onAdd} title="Add Todo" color="#1c73ee" />
        </View>
      </View>
      <View style={styles.todoListContainer}>
        <Animated.FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Change Title</Dialog.Title>
        <Dialog.Input
          onChangeText={value => setNewTitle(value)}
          value={newTitle}
        />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Confirm" onPress={handleConfirm} />
      </Dialog.Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  inputContainer: {
    marginTop: 14,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: '70%',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonContainer: {
    justifyContent: 'center',
  },
  todoListContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
  },
});

export default Home;
