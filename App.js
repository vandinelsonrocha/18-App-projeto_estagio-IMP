import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';  //permite a navegação entre páginas
import { createStackNavigator } from '@react-navigation/stack';  //tipo de navegação

//Importar as páginas
import Home from './src/pages/Home';
import Login from "./src/pages/Login";
import Scan from "./src/pages/Scan";
import DadosScan from './src/pages/DadosScan';
import Equipamentos from './src/pages/Equipamentos';
import EditarEquipamento from './src/pages/EditarEquipamento';
import Mobilias from './src/pages/Mobilias';
import EditarMobilia from './src/pages/EditarMobilia';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://0b0f9d9af0addc0d34cd4f2aaca553f9@o4508811335106560.ingest.de.sentry.io/4508811541938256',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const Stack = createStackNavigator();  //permite criar a navegação para a app

function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor='#261E6B' barStyle='light-content' />
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='Scan' component={Scan} options={{ headerShown: false }} />
        <Stack.Screen name='DadosScan' component={DadosScan} options={{ headerShown: false }} />
        <Stack.Screen name='Equipamentos' component={Equipamentos} options={{ headerShown: false }} />
        <Stack.Screen name='EditarEquipamento' component={EditarEquipamento} options={{ headerShown: false }} />
        <Stack.Screen name='Mobilias' component={Mobilias} options={{ headerShown: false }} />
        <Stack.Screen name='EditarMobilia' component={EditarMobilia} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Sentry.wrap(App);
