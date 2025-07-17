import * as React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import styleObj from '../../styles';

const { CardStyles } = styleObj;

type RootStackParamList = {
  ProductInfo: { productInfo: { title: string; description: string; image: any; price: number } };
};

type ProductCardProps = {
  title: string;
  productInfo: {
    title: string;
    description: string;
    image: any;  // image locale require() a un type any
    price: number;
  };
};

type ProductCardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductInfo'>;

const ProductCard: React.FC<ProductCardProps> = ({ title, productInfo }) => {
  const navigation = useNavigation<ProductCardNavigationProp>();

  return (
    <View style={styles.card}>
      <Image
        source={productInfo.image}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {productInfo.description}
        </Text>
        <Text>
          <i>{productInfo.price} Ar</i>
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Ajouter au panier"
            onPress={() => navigation.navigate('ProductInfo', { productInfo })}
            color="#ff6347"
          />
        </View>
      </View>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
    marginHorizontal: 15,
    elevation: 5, // ombre Android
    shadowColor: '#000', // ombre iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 120,
    margin:5,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  buttonContainer: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
});
