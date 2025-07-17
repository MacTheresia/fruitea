import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


import styleObj from '../../styles'

const {_, x, TextStyles} = styleObj


const QuantitySelector = ({ options, selected, onSelect }: {
  options: string[];
  selected: string | null;
  onSelect: (val: string) => void;
}) => {
  return (
    <View style={styles.section}>
      <Text style={TextStyles.sectionTitle}>Quantité</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.radioButton,
              selected === option && styles.radioButtonSelected,
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.radioText,
                selected === option && styles.radioTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default QuantitySelector

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
    marginBottom: 2
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
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
