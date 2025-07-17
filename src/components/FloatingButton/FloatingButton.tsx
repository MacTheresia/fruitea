import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

type RootStackParamList = {
  Home: undefined;
  Jus: undefined;
  Commandes: undefined;
  Infos: undefined;
};

export default function FloatingButton({children}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleMainButtonPress = () => setMenuOpen(v => !v);
  const closeMenu = () => {
    setMenuOpen(false);
    Keyboard.dismiss();
  };

  const menuItems = [
    {
      label: "Accueil",
      icon: <Ionicons name="home" size={18} color="white" />,
      route: "Home",
    },
    {
      label: "Produits",
      icon: (
        <MaterialCommunityIcons name="glass-cocktail" size={18} color="white" />
      ),
      route: "Product",
    },
    {
      label: "Commandes",
      icon: <Ionicons name="receipt" size={18} color="white" />,
      route: "Commandes",
    },
    {
      label: "Paramètre",
      icon: <Feather name="settings" size={18} color="white" />,
      route: "Setting",
    },
  ];

  return (
    <>
    {children}
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={styles.container}>
        {menuOpen && (
          <View style={styles.menuWrapper}>
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.extraButton}
                onPress={() => {
                  navigation.navigate(item.route);
                  setMenuOpen(false);
                }}
              >
                {item.icon}
                <Text style={styles.extraButtonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={e => {
            e.stopPropagation();
            handleMainButtonPress();
          }}
        >
          <Image
            source={require('../../assets/images/bubble-tea.png')}
            style={styles.iconImage}
          />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0, right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  menuWrapper: {
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  extraButton: {
    backgroundColor: 'tomato',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    margin: 4,
    padding: 10,
  },
  extraButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    textTransform: 'capitalize',
    padding: 10,
  },
  floatingButton: {
    backgroundColor: 'tomato',
    width: 80,
    height: 80,
    borderRadius: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    // elevation: 5,
    // marginBottom: 1,
  },
  iconImage: {
    width: 50,
    height: 50,
  },
});
