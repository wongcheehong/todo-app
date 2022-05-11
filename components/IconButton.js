import React from 'react';
import {IconButton, Colors} from 'react-native-paper';

function _IconButton({icon, color, onPress}) {
  return <IconButton icon={icon} color={Colors.red500} onPress={onPress} />;
}

export default _IconButton;
