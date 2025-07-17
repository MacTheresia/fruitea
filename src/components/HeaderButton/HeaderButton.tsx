import { View, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function HeaderButton() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <TouchableOpacity style={styles.iconButton} onPress={() => console.log("Ajouté au panier !")}>
          <AntDesign name="shoppingcart" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => console.log("Profil ouvert !")}>
          <AntDesign name="user" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end", 
    alignItems: "center",
    paddingHorizontal: 15,
    position: "absolute",
    right: 0,
  },
  iconWrapper: {
    flexDirection: "row",
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 30,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
