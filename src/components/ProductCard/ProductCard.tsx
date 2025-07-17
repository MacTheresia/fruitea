import * as React from "react";
import { View, Text, Button, Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import styleObj from "../../styles";
import { useCart } from "../../contexts/CartContext";

const { CardStyles } = styleObj;

type RootStackParamList = {
  ProductInfo: {
    productInfo: {
      title: string;
      description: string;
      image: any;
      price: number;
    };
  };
};

type ProductCardProps = {
  title: string;
  productInfo: {
    title: string;
    description: string;
    image: any;
    price: number;
  };
};

type ProductCardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductInfo"
>;

const ProductCard: React.FC<ProductCardProps> = ({ title, productInfo }) => {
  const navigation = useNavigation<ProductCardNavigationProp>();
  const { addToCart } = useCart();

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    addToCart({
      id: productInfo.title, // Utilise un vrai id si possible
      name: productInfo.title,
      price: productInfo.price,
      image: productInfo.image,
    });
  };

  return (
    <Pressable
      onPress={() => navigation.navigate("ProductInfo", { productInfo })}
    >
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
          <Text style={{ fontStyle: "italic" }}>{productInfo.price} Ar</Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Ajouter au panier"
              onPress={handleAddToCart}
              color="#ff6347"
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 10,
    marginHorizontal: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    flexDirection: "row",
  },
  image: {
    width: 120,
    height: 120,
    margin: 5,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  buttonContainer: {
    alignSelf: "flex-start",
    marginTop: 10,
  },
});
