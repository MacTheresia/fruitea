import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';

type Props = {
  titre: string;
  image: string | ImageSourcePropType; // string = URL, sinon require(...)
};

const CardItem: React.FC<Props> = ({ titre, image }) => {
  const source: ImageSourcePropType = typeof image === 'string' ? { uri: image } : image;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{titre}</Text>
      <Image
        source={source}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250, // largeur fixe pour le scroll horizontal
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginRight: 12, // espacement horizontal entre les cards
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
});

export default CardItem;
