import * as React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ProductCard from '../../components/ProductCard/ProductCard';
import ProductList from '../../datas/productList';

import styleObj from '../../styles';
const { Styles } = styleObj;

type RootStackParamList = {
  Home: undefined;
};

const ProductScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Voici la liste des produits</Text>

      <FlatList
        data={ProductList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ProductCard
            title={item.title}
            productInfo={item}
          />
        )}
      />

      <Button
        title="Retour"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

export default ProductScreen;
