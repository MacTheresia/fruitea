import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SearchBarCustom from '../../components/SearchBar/SearchBar';

import ProductCard from '../../components/ProductCard/ProductCard';
import ProductList from '../../datas/ProductList/productList';
import PersonnalizeScreen from '../Personnalize/Personnalize';

import styleObj from '../../styles';
const { TextStyles } = styleObj;

type RootStackParamList = {
  Home: undefined;
};

const ProductScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [isVisible, setVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(ProductList);

    // Permets de filtrer les produiits
    useEffect(() => {
      if (searchText.trim() === '') {
        setFilteredProducts(ProductList);
      } else {
        //  Affiche un nouveau list de produit après recherche
        const filtered = ProductList.filter(product =>
          product.title.toLowerCase().includes(searchText.toLowerCase()) ||
          product.description.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
    }, [searchText]);

  return (
    <View style={ProductStyles.container}>
      <Text style={TextStyles.sectionTitle}>Liste des produits</Text>

      {/* récupérer la saisie */}
      <SearchBarCustom
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Rechercher un produit..."
      />

      <TouchableOpacity
        style={ProductStyles.customizeButton}
        onPress={() => setVisible(!isVisible)}
      >
        <Text style={ProductStyles.customizeButtonText}>Personnaliser du jus</Text>
      </TouchableOpacity>

      {isVisible && <PersonnalizeScreen />}

      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ProductCard
            title={item.title}
            productInfo={item}
          />
        )}
      />
    </View>
  );
};

const ProductStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  customizeButton: {
    padding: 10,
    margin: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'tomato',
    borderRadius: 5,
  },
  customizeButtonText: {
    color: 'tomato',
    fontWeight: 'bold',
  },
});

export default ProductScreen;
