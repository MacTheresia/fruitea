import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

type Language = "fr" | "en";

const texts = {
  fr: {
    title: "Historique des commandes",
    noOrders: "Aucune commande passée.",
    orderLabel: "Commande",
    dateLabel: "Date",
    amountLabel: "Montant",
    addressLabel: "Adresse",
    back: "Retour",
  },
  en: {
    title: "Order History",
    noOrders: "No orders placed.",
    orderLabel: "Order",
    dateLabel: "Date",
    amountLabel: "Amount",
    addressLabel: "Address",
    back: "Back",
  },
};

type Props = {
  language: Language;
  onBack: () => void;
};

export default function OrderHistory({ language, onBack }: Props) {
  const t = texts[language];
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.currentUser) return;

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const orderList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data.createdAt?.toDate().toLocaleDateString("fr-FR") || "",
            amount: data.total || 0,
            address: data.address || "",
            items: data.items || [],
          };
        });

        setOrders(orderList);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchOrders();
  }, []);


  const renderItem = ({
    item,
  }: {
    item: { id: string; date: string; amount: number; items: any[]; address: string };
  }) => (
    <View style={styles.orderCard}>
      <View style={styles.row}>
        <MaterialIcons name="date-range" size={20} color="#faae89" />
        <Text style={styles.orderTitle}>
          {t.dateLabel} : <Text style={styles.orderValue}>{item.date}</Text>
        </Text>
      </View>

      <View style={styles.row}>
        <MaterialIcons name="attach-money" size={20} color="#faae89" />
        <Text style={styles.orderText}>
          {t.amountLabel} :{" "}
          <Text style={styles.orderValue}>${item.amount.toFixed(2)}</Text>
        </Text>
      </View>

      <View style={styles.row}>
        <MaterialIcons name="attach-money" size={20} color="#faae89" />
        <Text style={styles.orderText}>
          {t.addressLabel} : <Text style={styles.orderValue}>{item.address}</Text>
        </Text>
      </View>
      <View style={styles.row}>
        <MaterialIcons name="receipt" size={20} color="#faae89" />
        <Text style={styles.orderText}>{t.orderLabel}</Text>
      </View>

      {/* Produits commandés */}
      {item.items.map((product, index) => (
        <View key={index} style={styles.productRow}>
          {typeof product.image === "string" ? (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.productImagePlaceholder} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productQty}>
              x{product.quantity} — ${product.price}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

    return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Feather name="arrow-left" size={26} color="#faae89" />
        </Pressable>
        <Text style={styles.title}>{t.title}</Text>
      </View>

      {isLoading ? ( // ✅ SPINNER
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#faae89" />
        </View>
      ) : orders.length === 0 ? (
        <Text style={styles.noOrders}>{t.noOrders}</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  backBtn: {
    padding: 6,
  },
  pressed: {
    opacity: 0.6,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#faae89",
  },
  noOrders: {
    fontSize: 17,
    color: "#aaa",
    marginTop: 50,
    textAlign: "center",
  },
  orderCard: {
    backgroundColor: "#fff7f5",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f4c6a0",
    ...Platform.select({
      ios: {
        shadowColor: "#faae89",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#bc5d76",
  },
  orderText: {
    fontSize: 15,
    color: "#444",
  },
  orderValue: {
    fontWeight: "600",
    color: "#7e4e60",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  productImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  productName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
  },
  productQty: {
    fontSize: 13,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
