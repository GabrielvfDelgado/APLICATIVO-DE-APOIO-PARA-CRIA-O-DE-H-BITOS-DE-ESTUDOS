import React from 'react';
import { Text } from 'react-native';


export default props => {
  console.warn(props.route.params);
  return (
    <Text>TimerScreen</Text>
  );
};