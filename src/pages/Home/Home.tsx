import React from 'react';
import { View, FlatList, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import styleObj from '../../styles';
import AnimatedText from '../../components/AnimatedText/AnimatedText';
import CardItem from '../../components/CardItem/CardItem';
import ToppingCard from '../../components/ToppingCard/ToppingCard';

import datas from '../../datas/ParfumsList/parfumList';
import ToppingData from '../../datas/ToppingList/toppingList';

const { Styles } = styleObj;

// Types de navigation stack
type RootStackParamList = {
  Home: undefined;
  Product: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ScrollView>
      <View style={Styles.container}>
        <Image
          source={require('../../assets/gif/Trending GIF.gif')}
          style={styles.image}
        />

        <AnimatedText text="Bienvenue chez Fruitea Market" />

        <View style={{ width: '100%' }}>
          <Text style={styles.sectionTitle}>Nos Parfums</Text>
          <FlatList
            data={datas}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <CardItem titre={item.titre} image={item.image} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
        </View>

        <View style={{ width: '100%' }}>
          <Text style={styles.sectionTitle}>Nos Toppings</Text>
          <FlatList
            data={ToppingData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <ToppingCard titre={item.titre} description={item.desc} image={item.image} />
            )}
            vertical
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingHorizontal: 8,
  },
  image: {
    alignSelf: 'center',
    width: '70%',
    height: 240,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3a3a3a',
    marginVertical: 16,
    marginLeft: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'tomato',
    paddingBottom: 4,
  },
});

export default HomeScreen;
