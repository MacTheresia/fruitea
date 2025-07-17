import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import image from '../../assets/images/bubble-tea.png';

import HeaderButton from "../HeaderButton/HeaderButton";
export default function Header() {
  return (
    <View style={styles.headerContainer}>
        <Image source={image} resizeMode="cover" style={styles.logo} />
        <Text style={styles.title}>Fruitea Market</Text>
        <HeaderButton/>

    </View>
  );
}

const styles = StyleSheet.create({
headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: 'tomato',
    height: 70,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
}
,
content:{

},
iconButton :{
    color: "black"
},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    fontFamily: "cursive", 
  },
  logo: {
    width: 40,
    height: 40,
  },
});
