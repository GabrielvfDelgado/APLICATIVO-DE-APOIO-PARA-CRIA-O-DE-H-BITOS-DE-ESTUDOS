import 'react-native-gesture-handler';

import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Button, Icon } from '@rneui/base';

import HomeScreen from './pages/HomeScreen';
import RegisterTasks from './pages/RegisterTasks';

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
                  onPress={() => navigation.navigate('RegisterTasks')}
                  type="clear"
                  icon={<Icon name="add" size={25} color='white' />}
                />
              )
            };
          }}
        />
        <Stack.Screen
          name="RegisterTasks"
          component={RegisterTasks}
          options={{ title: 'Formulário de Tarefas' }}
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