import React, {useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const TodoItem = ({title, onEdit, onDelete, id}) => {
  const shrinkAnim = useRef(new Animated.Value(1)).current;
  const shrinkAnimatedStyle = {
    transform: [
      {
        scale: shrinkAnim,
      },
    ],
  };

  const shrinkAndDelete = () => {
    Animated.timing(shrinkAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setTimeout(() => onDelete(), 500);
  };

  return (
    <Animated.View style={[styles.todoItem, shrinkAnimatedStyle]}>
      <Text style={styles.innerText}>{title}</Text>
      <View style={styles.buttonGroupContainer}>
        <View style={styles.buttonContainer}>
          <Icon name="edit" size={20} color="white" onPress={onEdit} />
        </View>
        <View style={styles.buttonContainer}>
          <Icon
            name="delete"
            size={20}
            color="white"
            onPress={shrinkAndDelete}
          />
        </View>
      </View>
    </Animated.View>
  );
};

// const areEqual = (prevProps, nextProps) => {
//   console.log(prevProps.title);
//   console.log(nextProps.title);
//   return prevProps.id === nextProps.id && prevProps.title === nextProps.title;
// };

// export default React.memo(TodoItem, areEqual);
export default TodoItem;

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  buttonGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    backgroundColor: '#284fce',
    marginHorizontal: 3,
    padding: 5,
  },
});
