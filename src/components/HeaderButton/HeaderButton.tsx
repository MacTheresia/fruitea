import { View, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  History: undefined;
  Profile: undefined;
  Basket: undefined;
};

export default function HeaderButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Basket")}>
          <AntDesign name="shoppingcart" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Profile")}>
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
