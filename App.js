import React from 'react';
import { NavigationContainer } from '@react-navigation/native';  //permite a navegação entre páginas
import { createStackNavigator } from '@react-navigation/stack';  //tipo de navegação

//Importar as páginas
import Login from "./pages/Login";
import Scan from "./pages/Scan";
import DadosEquipamentos from './pages/DadosEquipamentos';
import Inventario from './pages/Inventario';

const Stack = createStackNavigator();  //permite criar a navegação para a app

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Scan' component={Scan} />
        <Stack.Screen name='DadosEquipamentos' component={DadosEquipamentos} />
        <Stack.Screen name='Inventario' component={Inventario} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
