import * as React from 'react';
import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import styleObj from '../../styles';

const { Styles, CardStyles } = styleObj;


type RootStackParamList = {
  // Product: undefined;
  ProductInfo: { 
    productInfo: { 
      title: string; 
      description: string; 
      datePublication: string 
    } 
  };
};

type ProductInfoRouteProp = RouteProp<RootStackParamList, 'ProductInfo'>;

const ProductInfoScreen: React.FC = () => {
  const route = useRoute<ProductInfoRouteProp>();

  const {title, description, datePublication } = route.params.productInfo;

  return (
    <View style={CardStyles.card}>
      <Text style={CardStyles.title}>{title}</Text>
      <Text style={CardStyles.content}>Description : {description}</Text>
      <Text style={CardStyles.content}>Date : {datePublication}</Text>
    </View>
  );
};

export default ProductInfoScreen;
