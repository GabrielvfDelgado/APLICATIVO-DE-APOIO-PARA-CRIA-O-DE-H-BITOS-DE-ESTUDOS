import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Icon } from '@rneui/base';
import HomeScreen from './pages/HomeScreen';
import RegisterTask from './pages/RegisterTasks';
import TaskScreen from './pages/TaskScreen';
import TimerScreen from './pages/TimerScreen';
import EditScreen from './pages/EditScreen';
import { SafeAreaView } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1A4167' }}>
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
            options={({ route }) => ({ title: route.params.taskName })}
          />
          <Stack.Screen
            name="TimerScreen"
            component={TimerScreen}
            options={{ title: 'Pomodoro' }}
          />
          <Stack.Screen
            name="EditScreen"
            component={EditScreen}
            options={{ title: 'Editar tarefa' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
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
