import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import styleObj from '../../styles';

const { Styles, CardStyles } = styleObj;
type RootStackParamList = {
  ProductInfo: { productInfo: { title: string; description: string; datePublication: string } };
};

type ProductCardProps = {
  title: string;
  productInfo: {
    title: string;
    description: string;
    datePublication: string;
  };
};

type ProductCardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductInfo'>;

const ProductCard: React.FC<ProductCardProps> = ({ title, productInfo }) => {
  const navigation = useNavigation<ProductCardNavigationProp>();

  return (
    <View style={CardStyles.card}>
      <Text style={CardStyles.title}>{title}</Text>
      <View style={CardStyles.buttonContainer}>
        <Button
          title="Voir"
          onPress={() => navigation.navigate('ProductInfo', { productInfo })}
        />
      </View>
    </View>
  );
};

export default ProductCard;
