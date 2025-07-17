import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../hooks/useAuths";

const mockCartItems = [
  {
    id: "1",
    name: "Bubble Tea Mocha",
    quantity: 2,
    price: 100,
    image: require("../../assets/images/buble_tea.jpg"),
  },
];

export default function Basket() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const { user } = useAuth(); //  vérifie si l'utilisateur est connecté
  const navigation = useNavigation<any>();

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleConfirmRemove = () => {
    if (selectedItem) {
      setCartItems((prev) =>
        prev.filter((item) => item.id !== selectedItem.id)
      );
      setSelectedItem(null);
    }
    setModalVisible(false);
  };

  const handleValidateOrder = () => {
    if (user) {
      navigation.navigate("Commandes", {
        cartItems: JSON.stringify(cartItems),
      });
    } else {
      setShowLoginAlert(true);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="shopping-cart" size={26} color="#faae89" />
        <Text style={styles.headerText}>Mon panier</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#fcdcc7" />
          <Text style={styles.emptyText}>Votre panier est vide</Text>
          <Text style={styles.emptySubText}>
            Ajoutez de délicieux bubble tea depuis l’accueil
          </Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Pressable
                    onPress={() => {
                      setSelectedItem({ id: item.id, name: item.name });
                      setModalVisible(true);
                    }}
                  >
                    <Ionicons name="trash-outline" size={30} color="#f44336" />
                  </Pressable>
                </View>
                <Text style={styles.price}>
                  Prix unitaire : {item.price} Ar
                </Text>
                <View style={styles.quantityContainer}>
                  <Pressable
                    onPress={() => updateQuantity(item.id, -1)}
                    style={styles.qtyButton}
                  >
                    <Text style={styles.qtyText}>−</Text>
                  </Pressable>
                  <Text style={styles.qtyNumber}>{item.quantity}</Text>
                  <Pressable
                    onPress={() => updateQuantity(item.id, 1)}
                    style={styles.qtyButton}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {cartItems.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total : {total} Ar</Text>
          <Pressable
            onPress={handleValidateOrder}
            style={styles.validateButton}
          >
            <Text style={styles.validateButtonText}>Valider la commande</Text>
          </Pressable>
        </View>
      )}

      {/* Modal suppression */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons
              name="alert-circle"
              size={36}
              color="#faae89"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.modalTitle}>Tu es sûre ?</Text>
            <Text style={styles.modalText}>
              Tu veux supprimer « {selectedItem?.name} » du panier ?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#fcdcc7" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#f44336" }]}
                onPress={handleConfirmRemove}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                  Supprimer
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal connexion requise */}
      <Modal
        visible={showLoginAlert}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoginAlert(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { width: "85%" }]}>
            <Ionicons
              name="warning"
              size={40}
              color="#faae89"
              style={{ marginBottom: 10 }}
            />
            <Text style={[styles.modalTitle, { fontSize: 22 }]}>
              Connexion requise
            </Text>
            <Text
              style={[styles.modalText, { fontSize: 16, marginBottom: 24 }]}
            >
              Tu dois être connecté pour valider ta commande.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#fcdcc7" }]}
                onPress={() => setShowLoginAlert(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#faae89" }]}
                onPress={() => {
                  setShowLoginAlert(false);
                  navigation.navigate("auth");
                }}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                  Se connecter
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcf9f7",
    paddingTop: 36,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 45,
    paddingHorizontal: 22,
    paddingBottom: 12,
    gap: 10,
  },
  headerText: {
    color: "#faae89",
    fontSize: 30,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff7f5",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    elevation: 2,
    borderColor: "#fcdcc7",
    borderWidth: 1,
  },
  itemImage: {
    width: 100,
    height: 120,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    flexShrink: 1,
  },
  price: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  qtyButton: {
    backgroundColor: "#faae89",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  qtyNumber: {
    fontSize: 16,
    marginHorizontal: 10,
    color: "#444",
  },
  totalContainer: {
    backgroundColor: "#fff7f5",
    paddingTop: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 120,
    borderTopColor: "#fcdcc7",
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 3,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#faae89",
    marginBottom: 16,
  },
  validateButton: {
    backgroundColor: "#faae89",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  validateButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(150, 147, 147, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff7f5",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fcdcc7",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#faae89",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#444",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: "#888",
    fontStyle: "italic",
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 15,
    color: "#aa8c8c",
    textAlign: "center",
  },
  
});
