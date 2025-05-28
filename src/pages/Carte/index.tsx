import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import CarteList from '../../datas/carteList';

const CarteScreen: React.FC = () => {
  // On garde une liste d'index individuels pour chaque carte (hors centre)
  const [cardIndices, setCardIndices] = useState<number[]>(
    Array(8).fill(0) // 8 cartes autour du centre
  );

  // Créer une grille de 9 éléments
  const gridData = Array.from({ length: 9 }, (_, index) => {
    if (index === 4) {
      return { id: 'center', isButton: true };
    }

    // Calculer l'index des données de carte correspondantes
    // On ajuste car on saute l'index 4
    const adjustedIndex = index < 4 ? index : index - 1;

    return {
      id: `card-${index}`,
      dataIndex: adjustedIndex,
      isButton: false,
    };
  });

  const handleRotate = () => {
    // Incrémenter chaque index de carte individuellement
    setCardIndices((prevIndices) =>
      prevIndices.map((i) => (i + 1 < CarteList.length ? i + 1 : 0))
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.isButton) {
      return (
        <TouchableOpacity
          style={[styles.carteStyle, styles.buttonStyle]}
          onPress={handleRotate}
        >
          <Text style={styles.buttonText}>Rotate</Text>
        </TouchableOpacity>
      );
    } else {
      const cardContent = CarteList[cardIndices[item.dataIndex]];
      return (
        <View style={styles.carteStyle}>
          <Text style={styles.carteText}>{cardContent}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={gridData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 330,
    height: 330,
    borderWidth: 1,
    borderColor: 'black',
  },
  carteStyle: {
    borderWidth: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
    height: 110,
  },
  carteText: {
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CarteScreen;
