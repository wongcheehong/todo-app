import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Checkbox} from 'react-native-paper';

const ActionButtonGroup = ({onEdit, onDelete, onCheck, checkStatus}) => {
  const [checked, setChecked] = useState(checkStatus);

  useEffect(() => {
    setChecked(checkStatus);
  }, [checkStatus]);

  const onCheckboxPress = () => {
    onCheck();
    setChecked(prevState => !prevState);
  };

  const buttonContainerStyle = checked
    ? [styles.buttonContainer, {backgroundColor: '#050a1e'}]
    : styles.buttonContainer;

  return (
    <View style={styles.buttonGroupContainer}>
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={onCheckboxPress}
      />
      <View style={buttonContainerStyle}>
        <Icon name="edit" size={20} color="white" onPress={onEdit} />
      </View>
      <View style={buttonContainerStyle}>
        <Icon name="delete" size={20} color="white" onPress={onDelete} />
      </View>
    </View>
  );
};

export default ActionButtonGroup;

const styles = StyleSheet.create({
  buttonGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: '#284fce',
    marginHorizontal: 2,
    padding: 5,
  },
});
