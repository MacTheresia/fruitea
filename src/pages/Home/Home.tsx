import * as React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import styleObj from '../../styles';

const { Styles, CardStyles } = styleObj;



// Définir les types de routes si tu utilises TypeScript
type RootStackParamList = {
  Home: undefined;
  Product: undefined;
};

const HomeScreen : React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Bienvenue sur mon app React Native</Text>
      <View style={Styles.buttonWrapper}>
        <Button title="Liste des Produits" onPress={() => navigation.navigate('Product')} />
      </View>
    </View>
  );
}


export default HomeScreen;
