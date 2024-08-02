import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';  //permite a navegação entre páginas
import { createStackNavigator } from '@react-navigation/stack';  //tipo de navegação

//Importar as páginas
import Boasvindas from './src/pages/Boasvindas';
import Login from "./src/pages/Login";
import Scan from "./src/pages/Scan";
import DadosEquipamentos from './src/pages/DadosEquipamentos';
import Inventario from './src/pages/Inventario';

const Stack = createStackNavigator();  //permite criar a navegação para a app

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor='#261E6B' barStyle='light-content' />
      <Stack.Navigator initialRouteName='Boasvindas'>
        <Stack.Screen name='Boasvindas' component={Boasvindas} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='Scan' component={Scan} />
        <Stack.Screen name='DadosEquipamentos' component={DadosEquipamentos} />
        <Stack.Screen name='Inventario' component={Inventario} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
