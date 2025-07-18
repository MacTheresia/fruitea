import React, { useState, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Modal,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuths";
import { useStripe } from "@stripe/stripe-react-native";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import {auth, db } from "../../firebase/firebaseConfig";


type CartItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type RouteParams = {
  cartItems: CartItem[];
};

export default function OrderFormScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const [showMessage, setShowMessage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [showInputAlert, setShowInputAlert] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const navigation = useNavigation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const { user } = useAuth();

  let cartItems: CartItem[] = [];

  if (typeof route.params?.cartItems === "string") {
    try {
      cartItems = JSON.parse(route.params.cartItems);
    } catch (error) {
      console.error("Erreur de parsing des cartItems :", error);
    }
  } else if (Array.isArray(route.params?.cartItems)) {
    cartItems = route.params.cartItems;
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const openPopup = () => {
    if (!firstName.trim() || !address.trim() || !phone.trim()) {
      setShowInputAlert(true);
      return;
    }
    setModalVisible(true);
  };

  const confirmOrder = async () => {
    try {
      // 1. Demander au serveur Express Stripe la création du payment intent
      const response = await fetch(
        "http://192.168.88.38:3000/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: total * 100 }), // en centimes
        }
      );

      const { clientSecret } = await response.json();

      // 2. Initialiser la payment sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Fruitea 🧋",
      });

      if (initError) {
        console.error("Erreur Stripe init:", initError);
        alert("Erreur lors de l'initialisation du paiement.");
        return;
      }

      // 3. Présenter la payment sheet à l'utilisateur
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        console.error("Erreur paiement Stripe:", paymentError);
        alert("Le paiement a échoué ou a été annulé.");
        return;
      }

      // 4. Paiement réussi -> enregistrer la commande dans Firestore
      if (user) {
        await addDoc(collection(db, "orders"), {
          userId: user.uid,
          firstName,
          address,
          phone,
          items: cartItems,
          total,
          status: "En cours",
          createdAt: Timestamp.now(),
        });
      }

      // 5. Fermer le modal et afficher message de succès
      setModalVisible(false);
      setShowMessage(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setShowMessage(false);
            navigation.goBack();
          });
        }, 2000);
      });
    } catch (error) {
      console.error("Erreur générale :", error);
      alert("Une erreur est survenue.");
    }
  };
  if (!user) {
    return (
      <View style={styles.authContainer}>
        <MaterialIcons
          name="lock-outline"
          size={60}
          color="#faae89"
          style={{ marginBottom: 20 }}
        />
        <Text style={styles.authTitle}>Tu n'es pas connecté(e) !</Text>
        <Text style={styles.authText}>
          Connecte-toi pour pouvoir commander
        </Text>

        <Pressable
          onPress={() => navigation.navigate("auth")}
          style={styles.authButton}
        >
          <Text style={styles.authButtonText}>Se connecter</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.back}>
          <Pressable onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={30} color="#faae89" />
          </Pressable>
        </View>
        <View style={styles.header}>
          <Feather name="coffee" size={22} color="#faae89" />
          <Text style={styles.title}>Ta commande</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Feather
            name="user"
            size={18}
            color="#aaa"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Nom"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Feather
            name="map-pin"
            size={18}
            color="#aaa"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Adresse de livraison"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Feather
            name="phone"
            size={18}
            color="#aaa"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Téléphone"
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Feather name="shopping-bag" size={20} color="#faae89" />
          <Text style={styles.subtitle}>Résumé de la commande</Text>
        </View>

        <View style={styles.summaryBox}>
          {cartItems.length === 0 ? (
            <Text style={styles.emptyText}>Aucun bubble tea sélectionné</Text>
          ) : (
            cartItems.map((item) => (
              <View style={styles.itemRow} key={item.id}>
                <View style={styles.itemLeft}>
                  <Text style={styles.bubbleDot}>●</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
                <Text style={styles.itemQty}>× {item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  {item.quantity * item.price} Ar
                </Text>
              </View>
            ))
          )}
          {cartItems.length > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total} Ar</Text>
            </View>
          )}
        </View>

        <Pressable onPress={openPopup} style={styles.button}>
          <Text style={styles.buttonText}>Confirmer la commande</Text>
        </Pressable>

        {showMessage && (
          <Animated.View
            style={[styles.animatedMessage, { opacity: fadeAnim }]}
          >
            <Text style={styles.messageText}>Commande envoyée ! Merci</Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Modal confirmation */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Feather
              name="info"
              size={40}
              color="#faae89"
              style={{ marginBottom: 16 }}
            />
            <Text style={styles.modalTitle}>Confirme ta commande</Text>
            <Text style={styles.modalText}>Prénom : {firstName}</Text>
            <Text style={styles.modalText}>Adresse : {address}</Text>
            <Text style={styles.modalText}>Téléphone : {phone}</Text>
            <Text
              style={[styles.modalText, { fontWeight: "bold", marginTop: 10 }]}
            >
              Total : {total} Ar
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmOrder}
              >
                <Text style={styles.confirmButtonText}>Valider</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal champs vides */}
      <Modal visible={showInputAlert} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Feather
              name="alert-triangle"
              size={40}
              color="#faae89"
              style={{ marginBottom: 16 }}
            />
            <Text style={styles.modalTitle}>Oups !</Text>
            <Text style={styles.modalText}>
              Merci de remplir tous les champs pour continuer
            </Text>
            <Pressable
              style={[
                styles.modalButton,
                styles.confirmButton,
                { marginTop: 20 },
              ]}
              onPress={() => setShowInputAlert(false)}
            >
              <Text style={styles.confirmButtonText}>D'accord</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flex: 1,
  },
  back: {
    marginBottom: 20,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#faae89",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fcdcc7",
    borderWidth: 1,
    backgroundColor: "#fef7f4",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    marginTop: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#faae89",
  },
  summaryBox: {
    backgroundColor: "#fff7f5",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fcdcc7",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bubbleDot: {
    fontSize: 12,
    color: "#faae89",
    marginRight: 6,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
    flexShrink: 1,
  },
  itemQty: {
    fontSize: 15,
    color: "#888",
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#fcdcc7",
    marginTop: 10,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#faae89",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#faae89",
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#faae89",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  animatedMessage: {
    position: "absolute",
    bottom: -80,
    left: 40,
    right: 40,
    backgroundColor: "#faae89",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  messageText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#faae89",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    marginVertical: 2,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 24,
    width: "100%",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#eee",
    marginRight: 12,
  },
  cancelButtonText: {
    color: "#777",
    fontWeight: "bold",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#faae89",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  authContainer: {
    flex: 1,
    backgroundColor: "#fcf9f7",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  authTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#faae89",
    marginBottom: 12,
    textAlign: "center",
  },
  authText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  authButton: {
    backgroundColor: "#faae89",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#faae89",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
