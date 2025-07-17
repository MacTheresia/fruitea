import { MaterialIcons } from "@expo/vector-icons";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../hooks/useAuths";
import { useNavigation } from "@react-navigation/native";

type Order = {
  id: string;
  status: string;
  date: string;
  total: number;
  items: {
    name: string;
    quantity: number;
  }[];
};

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        setEmail(auth.currentUser.email || "");

        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name || "");
        }
      }
    };

    const fetchOrders = async () => {
      if (!auth.currentUser) return;

      try {
        const ordersSnapshot = await getDocs(
          query(
            collection(db, "orders"),
            where("userId", "==", auth.currentUser.uid),
            orderBy("createdAt", "desc")
          )
        );

        const ordersList: Order[] = ordersSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            status: doc.data().status || "En cours",
            date:
              doc.data().createdAt?.toDate().toLocaleDateString("fr-FR") || "",
            total: doc.data().total || 0,
            items: doc.data().items || [],
          }))
          .filter((order) => order.status !== "Livrée");

        setOrders(ordersList);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      }
    };

    fetchUserData();
    fetchOrders();
  }, []);

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start(() => {
      setModalVisible(false);
    });
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert("Veuillez remplir le nom.");
      return;
    }

    setIsSaving(true);

    try {
      if (auth.currentUser) {
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            name,
            updatedAt: new Date(),
          },
          { merge: true }
        );
      }
      openModal();
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
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
          Connecte-toi pour accéder à ton profil, modifier tes infos et suivre
          tes commandes.
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
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="account-circle" size={34} color="#faae89" />
        <Text style={styles.headerText}>Mon profil</Text>
      </View>

      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Votre nom"
        placeholderTextColor="#bfa091"
        selectionColor="#faae89"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Votre email"
        placeholderTextColor="#bfa091"
        selectionColor="#faae89"
        editable={false}
      />

      <Pressable
        onPress={handleSave}
        disabled={isSaving}
        style={({ pressed }) => [
          styles.saveButton,
          (pressed || isSaving) && { opacity: 0.7 },
        ]}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveText}>Enregistrer</Text>
        )}
      </Pressable>

      <View style={styles.divider} />

      <Text style={styles.subtitle}>Suivi des commandes</Text>

      {orders.length === 0 ? (
        <Text
          style={{ textAlign: "center", color: "#999", fontStyle: "italic" }}
        >
          Aucune commande trouvée
        </Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <View style={styles.orderHeader}>
                <View style={{ flex: 1 }}>
                  {item.items.map((product, index) => (
                    <Text key={index} style={styles.orderText}>
                      {product.name} x{product.quantity}
                    </Text>
                  ))}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === "Livrée"
                      ? styles.statusDelivered
                      : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === "Livrée"
                        ? styles.statusTextDelivered
                        : styles.statusTextPending,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.orderDate}>Date : {item.date}</Text>
              <Text style={styles.orderDate}>Total : {item.total} Ar</Text>
            </View>
          )}
        />
      )}

      <Modal transparent visible={modalVisible} animationType="none">
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <View style={styles.modalContent}>
            <MaterialIcons
              name="check-circle"
              size={64}
              color="#faae89"
              style={{ marginBottom: 16 }}
            />
            <Text style={styles.modalTitle}>Profil mis à jour !</Text>
            <Text style={styles.modalMessage}>
              Tes informations ont bien été enregistrées.
            </Text>
            <Pressable style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcf9f7",
    paddingHorizontal: 24,
    paddingTop: 36,
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
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6b6b6b",
    marginBottom: 8,
    marginTop: 24,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#f0c8a0",
    borderRadius: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#4a4a4a",
    backgroundColor: "#fff7f5",
  },
  saveButton: {
    marginTop: 28,
    backgroundColor: "#faae89",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#faae89",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#f44336",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3d9c2",
    marginVertical: 36,
    borderRadius: 3,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#bb7a59",
    marginBottom: 20,
  },
  orderItem: {
    backgroundColor: "#fff7f5",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#d3a57b",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#bb7a59",
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 30,
  },
  statusDelivered: {
    backgroundColor: "#d3e5cd",
  },
  statusPending: {
    backgroundColor: "#f9d5c3",
  },
  statusText: {
    fontWeight: "700",
    fontSize: 15,
  },
  statusTextDelivered: {
    color: "#4c7a28",
  },
  statusTextPending: {
    color: "#d9704a",
  },
  orderDate: {
    fontSize: 14,
    color: "#9a7b66",
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    shadowColor: "#faae89",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#faae89",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: "#faae89",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    elevation: 4,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
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
