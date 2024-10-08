import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './src/pages/Login';
import Home from './src/pages/Home';
import QrCode from './src/pages/QRCode';
import { Image, Platform, StyleSheet, View } from 'react-native';
import FichaPessoal from './src/pages/FichaPessoal';
import Atividades from './src/pages/Atividades';
import Atividade from './src/pages/Atividade';
import CampeonatoQuadra from './src/pages/CampeonatoQuadra';
import CampeonatoPatio from './src/pages/CampeonatoPatio';
import Oficinas from './src/pages/Oficinas';
import Ranking from './src/pages/Ranking';
import Scanner from './src/pages/Scanner';
import MarcarPontos from './src/pages/MarcarPontos';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CampeonatoP from './src/pages/CampeonatoP';
import CampeonatoQ from './src/pages/CampeonatoQ';
import Oficina from './src/pages/Oficina';
import Perfil from './src/pages/Perfil';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const [show, setShow] = React.useState(false);

  const handleGetAjudantes = async () => {
    const attcodigo = await AsyncStorage.getItem("atividadeCodigo");
    const campcodigo = await AsyncStorage.getItem("campeonatoCodigo");

    setShow(attcodigo || campcodigo);
  };

  React.useEffect(() => {
    handleGetAjudantes();
  }, []);


  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            return <Image source={require('./assets/home.png')} style={{ width: 30, height: 30, objectFit: "contain" }} />;
          } else if (route.name === 'QrCode') {
            return <Image source={require('./assets/qrCode.png')} style={{ width: 66, height: 66, objectFit: "contain" }} />;
          } else if (route.name === 'FichaPessoal2') {
            return <Image source={require('./assets/ficha.png')} style={{ width: 30, objectFit: "contain" }} />;
          }
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#fff', paddingBottom: 22, paddingTop: 8, height: 60 },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="QrCode" component={QrCode} options={{ headerShown: false }} />
      <Tab.Screen name="FichaPessoal2" component={FichaPessoal} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Logado" component={MainTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="FichaPessoal" component={FichaPessoal} options={{ headerShown: false }} />
          <Stack.Screen name="Atividades" component={Atividades} options={{ headerShown: false }} />
          <Stack.Screen name="Atividade" component={Atividade} options={{ headerShown: false }} />
          <Stack.Screen name="CampeonatoQuadra" component={CampeonatoQuadra} options={{ headerShown: false }} />
          <Stack.Screen name="CampeonatoPatio" component={CampeonatoPatio} options={{ headerShown: false }} />
          <Stack.Screen name="Oficinas" component={Oficinas} options={{ headerShown: false }} />
          <Stack.Screen name="Ranking" component={Ranking} options={{ headerShown: false }} />
          <Stack.Screen name="MarcarPontos" component={MarcarPontos} options={{ headerShown: false }} />
          <Stack.Screen name="Scanner" component={Scanner} options={{ headerShown: false }} />
          <Stack.Screen name="CampeonatoP" component={CampeonatoP} options={{ headerShown: false }} />
          <Stack.Screen name="CampeonatoQ" component={CampeonatoQ} options={{ headerShown: false }} />
          <Stack.Screen name="Oficina" component={Oficina} options={{ headerShown: false }} />
          <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
