import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';

import HomeScreen from './pages/Home/Home';
import ProductScreen from './pages/Product/Product';
import ProductInfoScreen from './pages/ProductInfo/ProductInfo';
import ChangeColorScreen from './pages/ChangeColor';
import CarteScreen from './pages/Carte';
import FloatingButton from './components/FloatingButton/FloatingButton';
import AuthScreen from './pages/AuthScreen/AuthScreen';
import Header from './components/Header/Header';

const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState<string | undefined>(undefined);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        setCurrentRoute(navigationRef.getCurrentRoute()?.name);
      }}
      onStateChange={() => {
        setCurrentRoute(navigationRef.getCurrentRoute()?.name);
      }}
    >
      <Stack.Navigator initialRouteName="auth">
        <Stack.Screen
          name="auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ header: () => <Header /> }}
        />
        <Stack.Screen
          name="Product"
          component={ProductScreen}
          options={{ header: () => <Header /> }}
        />
        <Stack.Screen
          name="ProductInfo"
          component={ProductInfoScreen}
          options={{ header: () => <Header /> }}
        />
        <Stack.Screen
          name="Carte"
          component={CarteScreen}
          options={{ header: () => <Header /> }}
        />
        <Stack.Screen
          name="ChangeColor"
          component={ChangeColorScreen}
          options={{ header: () => <Header /> }}
        />
      </Stack.Navigator>

      {/* N'affiche le FloatingButton que si ce n’est pas la page d’auth */}
      {currentRoute !== 'auth' && <FloatingButton />}

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
