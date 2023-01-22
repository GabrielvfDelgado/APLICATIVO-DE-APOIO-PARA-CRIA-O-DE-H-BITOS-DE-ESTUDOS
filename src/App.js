import 'react-native-gesture-handler';

import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Button, Icon } from '@rneui/base';

import HomeScreen from './pages/HomeScreen';
import RegisterTask from './pages/RegisterTasks';
import TaskScreen from './pages/TaskScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='HomeScreen'
        screenOptions={screenOptions}>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={({ navigation }) => {
            return {
              title: 'Lista de Tarefas',
              headerRight: () => (
                <Button
                  onPress={() => navigation.navigate('RegisterTask')}
                  type="clear"
                  icon={<Icon name="add" size={25} color='white' />}
                />
              )
            };
          }}
        />
        <Stack.Screen
          name="RegisterTask"
          component={RegisterTask}
          options={{ title: 'Registro de Tarefas' }}
        />
        <Stack.Screen
          name="TaskScreen"
          component={TaskScreen}
          options={{ title: 'Página da tarefa' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const screenOptions = {
  headerStyle: {
    backgroundColor: '#1A4167'
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold'
  }
};