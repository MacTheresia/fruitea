import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './pages/Home/Home';
import ProductScreen from './pages/Product/Product';
import ProductInfoScreen from './pages/ProductInfo/ProductInfo';

import ChangeColorScreen from './pages/ChangeColor';
import CarteScreen from './pages/Carte';
import FloatingButton from './components/FloatingButton/FloatingButton';


// Créer la navigation stack
const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
        {/* Définir Home comme page par défaut */}
      <FloatingButton>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen name="ProductInfo" component={ProductInfoScreen} />

          {/* Pour l'exercice avec changement du backgroundColor */}
          <Stack.Screen name='ChangeColor' component={ChangeColorScreen}/>
          
          {/* Pour l'exercice Carte */}
          <Stack.Screen name='CardRotate' component={CarteScreen}/>

        </Stack.Navigator>
      </FloatingButton>
    </NavigationContainer>
  );
}

