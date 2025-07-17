import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import FlavorSelector from '../../components/FlavorSelector/FlavorSelector';
import ToppingSelector from '../../components/ToppingSelector/ToppingSelector';
import QuantitySelector from '../../components/QuantitySelector/QuantitySelector';

import ProductList from '../../datas/ProductList/productList';
import ToppingData from '../../datas/ToppingList/toppingList';
import datas from '../../datas/ParfumsList/parfumList';

const flavorOptions = ['Mangue', 'Ananas', 'Fraise', 'Banane', 'Citron'];

const ActionButton = ({ text, onPress }: { text: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const PersonnalizeScreen: React.FC = () => {
  const [isVisible, setVisible] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState<string | null>(null);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const quantityOptions = ['250 ml', '500 ml', '750 ml'];
  const flavorOptions = datas.map(option => option.title);;
  const toppingOptions = ToppingData.map(topping => topping.titre);;

  const toggleFlavor = (flavor: string) => {
    if (selectedFlavors.includes(flavor)) {
      setSelectedFlavors(selectedFlavors.filter((item) => item !== flavor));
    } else {
      setSelectedFlavors([...selectedFlavors, flavor]);
    }
  };

  const toggleTopping = (topping: string) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter((item) => item !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Personnalisation du Jus</Text>

        <QuantitySelector
          options={quantityOptions}
          selected={selectedQuantity}
          onSelect={setSelectedQuantity}
        />

        <FlavorSelector
          options={flavorOptions}
          selectedOptions={selectedFlavors}
          toggleOption={toggleFlavor}
        />

        <ToppingSelector
          options={toppingOptions}
          selectedOptions={selectedToppings}
          toggleOption={toggleTopping}
        />

        <View style={{display:"flex", flexDirection: "row"}}>
          <ActionButton text="Commander" onPress={() => console.log('Commande validée !')} />
          <ActionButton text="Fermer" onPress={() => setVisible(false)} />
        </View>
      </View>
    </View>
  );
};

export default PersonnalizeScreen;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '90%',
    padding: 20,
    bottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'tomato',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  section: {
    marginBottom: 15,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'tomato',
    borderRadius: 20,
    margin: 5,
  },
  radioButtonSelected: {
    backgroundColor: 'tomato',
  },
  radioText: {
    color: 'tomato',
    fontWeight: '600',
  },
  radioTextSelected: {
    color: 'white',
  },
  checkboxButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 20,
    margin: 5,
  },
  checkboxButtonSelected: {
    backgroundColor: 'green',
  },
  checkboxText: {
    color: 'green',
    fontWeight: '600',
  },
  checkboxTextSelected: {
    color: 'white',
  },
  button: {
    backgroundColor: 'tomato',
    padding: 12,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
