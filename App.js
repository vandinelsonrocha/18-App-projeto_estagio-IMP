import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';  //permite a navegação entre páginas
import { createStackNavigator } from '@react-navigation/stack';  //tipo de navegação

//Importar as páginas
import Home from './src/pages/Home';
import Login from "./src/pages/Login";
import Scan from "./src/pages/Scan";
import DadosEquipamentos from './src/pages/DadosEquipamentos';
import Inventario from './src/pages/Inventario';
import EditarEquipamento from './src/pages/EditarEquipamento';

const Stack = createStackNavigator();  //permite criar a navegação para a app

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor='#261E6B' barStyle='light-content' />
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='Scan' component={Scan} />
        <Stack.Screen name='DadosEquipamentos' component={DadosEquipamentos} />
        <Stack.Screen name='Inventario' component={Inventario} />
        <Stack.Screen name='EditarEquipamento' component={EditarEquipamento} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
