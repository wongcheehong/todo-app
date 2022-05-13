import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import moment from 'moment';

const STORAGE_KEY = '@todo_list';

const findTodos = async date => {
  try {
    const todos = await readTodos();
    const filteredTodos = todos.filter(todo => {
      const createdAt = moment(todo.createdAt, 'DD/MM/YYYY h:mm:ss A');
      if (date === createdAt.format('DD/MM/YYYY')) {
        return true;
      } else {
        return false;
      }
    });
    return filteredTodos;
  } catch (e) {
    console.log('Failed to fetch todos from storage');
  }
};

const readTodos = async () => {
  try {
    let todos = await AsyncStorage.getItem(STORAGE_KEY);

    if (todos !== null) {
      todos = JSON.parse(todos);
      return todos;
    } else {
      return [];
    }
  } catch (e) {
    console.log('Failed to fetch the todos from storage');
  }
};

const readTodo = async id => {
  try {
    let todos = await AsyncStorage.getItem(STORAGE_KEY);

    if (todos !== null) {
      todos = JSON.parse(todos);
      return todos.find(todo => todo.id === id);
    } else {
      return [];
    }
  } catch (e) {
    console.log('Failed to fetch the input from storage');
  }
};

const storeTodos = async (todoTitle, setTodos) => {
  try {
    let todos = await readTodos();
    const todo = {
      id: uuid.v4(),
      title: todoTitle,
      completed: false,
      createdAt: moment().format('DD/MM/YYYY h:mm:ss A'),
      updatedAt: null,
      subTasks: [],
    };

    todos.push(todo);
    setTodos(todos);
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.log('There is an error stroing the data', e);
  }
};

const deleteTodo = async id => {
  try {
    let todos = await readTodos();
    todos = todos.filter(todo => todo.id !== id);
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.log('There is an error delete the data', e);
  }
};

const editTodo = async (id, newTitle) => {
  try {
    const todos = await readTodos();
    const todoToBeEdited = todos.find(todo => todo.id === id);
    todoToBeEdited.title = newTitle;
    todoToBeEdited.updatedAt = moment().format('DD/MM/YYYY h:mm:ss A');
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.log('There is an error edit the data', e);
  }
};

const addSubTask = async (id, subTaskTitle) => {
  try {
    const todos = await readTodos();
    const todoToBeEdited = todos.find(todo => todo.id === id);
    const subTask = {
      id: uuid.v4(),
      title: subTaskTitle,
      completed: false,
      createdAt: moment().format('DD/MM/YYYY h:mm:ss A'),
      updatedAt: null,
    };
    todoToBeEdited.subTasks.push(subTask);
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.log('There is an error adding subtask', e);
  }
};

const editSubTask = async (todoId, subTaskId, subTaskTitle) => {
  try {
    const todos = await readTodos();
    const todoToBeEdited = todos.find(todo => todo.id === todoId);
    const subTask = todoToBeEdited.subTasks.find(
      subtask => subtask.id === subTaskId,
    );
    subTask.title = subTaskTitle;
    subTask.updatedAt = todoToBeEdited.updatedAt = moment().format(
      'DD/MM/YYYY h:mm:ss A',
    );
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.log('There is an error edit subtask', e);
  }
};

const deleteSubTask = async (todoId, subTaskId) => {
  try {
    const todos = await readTodos();
    const todoToBeEdited = todos.find(todo => todo.id === todoId);
    todoToBeEdited.subTasks = todoToBeEdited.subTasks.filter(
      subTask => subTask.id !== subTaskId,
    );
    todoToBeEdited.updatedAt = moment().format('DD/MM/YYYY h:mm:ss A');
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.log('There is an error delete subtask', e);
  }
};

const checkTodo = async todoId => {
  try {
    const todos = await readTodos();
    const todoToBeEdited = todos.find(todo => todo.id === todoId);
    todoToBeEdited.completed = !todoToBeEdited.completed;
    // Check completed for all its subtasks
    todoToBeEdited.subTasks.forEach(subTask => {
      subTask.completed = todoToBeEdited.completed;
    });
    todoToBeEdited.updatedAt = moment().format('DD/MM/YYYY h:mm:ss A');
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.log('There is an error checking todo', e);
  }
};

const checkSubTask = async (todoId, subTaskId) => {
  try {
    const todos = await readTodos();
    const todoToBeEdited = todos.find(todo => todo.id === todoId);
    const subTask = todoToBeEdited.subTasks.find(
      subtask => subtask.id === subTaskId,
    );
    subTask.completed = !subTask.completed;
    subTask.updatedAt = todoToBeEdited.updatedAt = moment().format(
      'DD/MM/YYYY h:mm:ss A',
    );
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.log('There is an error checking subtask', e);
  }
};

export {
  findTodos,
  readTodos,
  readTodo,
  storeTodos,
  deleteTodo,
  editTodo,
  addSubTask,
  editSubTask,
  deleteSubTask,
  checkTodo,
  checkSubTask,
};
