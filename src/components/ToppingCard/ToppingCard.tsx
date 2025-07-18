import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';

type Props = {
  titre: string;
  description: string;
  prix: number;
  image: ImageSourcePropType;
};

const ToppingCard: React.FC<Props> = ({ titre, description, image, prix }) => {
  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{titre}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.prix}>{prix} Ar</Text>
      </View>
      <Image source={image} style={styles.image} resizeMode="cover" />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  prix: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#d45757",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});

export default ToppingCard;
