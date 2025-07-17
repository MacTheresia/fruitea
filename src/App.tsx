import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';

import HomeScreen from './pages/Home/Home';
import ProductScreen from './pages/Product/Product';
import ProductInfoScreen from './pages/ProductInfo/ProductInfo';
import ChangeColorScreen from './pages/ChangeColor';
import CarteScreen from './pages/Carte';
import { StripeProvider } from "@stripe/stripe-react-native";
import FloatingButton from './components/FloatingButton/FloatingButton';
import AuthScreen from './pages/AuthScreen/AuthScreen';
import Header from './components/Header/Header';
import Profile from './pages/Profile/Profile';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import OrderFormScreen from './pages/form/OrderFormScreen';
import Basket from './pages/Basket/Basket';
import Settings from './pages/Settings/Settings';
import { CartProvider } from "./contexts/CartContext";


const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState<string | undefined>(undefined);

  return (
    <StripeProvider publishableKey="pk_test_51Rko7IQ7nSq6aHPE9fy3qExDrNcM216nYZUApsDSew815oCfbiWru5MWJZTAizFz0L0WgXhhcPyiRjQESgCOEGLN00x27cwm9o">
      <CartProvider>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            setCurrentRoute(navigationRef.getCurrentRoute()?.name);
          }}
          onStateChange={() => {
            setCurrentRoute(navigationRef.getCurrentRoute()?.name);
          }}
        >
          <Stack.Navigator initialRouteName="Home">
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
              name="Profile"
              component={Profile}
              options={{ header: () => <Header /> }}
            />
            <Stack.Screen
              name="Basket"
              component={Basket}
              options={{ header: () => <Header /> }}
            />
            <Stack.Screen
              name="History"
              component={OrderHistory}
              options={{ header: () => <Header /> }}
            />
            <Stack.Screen
              name="Commandes"
              component={OrderFormScreen}
              options={{ header: () => <Header /> }}
            />
            <Stack.Screen
              name="Setting"
              component={Settings}
              options={{ header: () => <Header /> }}
            />
          </Stack.Navigator>

          {/* N'affiche le FloatingButton que si ce n’est pas la page d’auth */}
          {currentRoute !== "auth" && <FloatingButton />}

          <StatusBar style="auto" />
        </NavigationContainer>
      </CartProvider>
    </StripeProvider>
  );
}
