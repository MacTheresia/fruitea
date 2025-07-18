import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../../hooks/useAuths"; // adapte

import OrderHistory from "../OrderHistory/OrderHistory";

const flags: Record<string, string> = {
  fr: "https://flagcdn.com/w80/fr.png",
  en: "https://flagcdn.com/w80/gb.png",
};

const texts = {
  fr: {
    title: "Paramètres",
    darkMode: "Mode sombre",
    language: "Langue",
    orderHistory: "Historique de commandes",
    login: "Se connecter",
    logout: "Se déconnecter",
    logoutAlert: "Vous avez été déconnecté.",
    confirm: "Confirmer",
    cancel: "Annuler",
    confirmLogout: "Souhaitez-vous vraiment vous déconnecter ?",
  },
  en: {
    title: "Settings",
    darkMode: "Dark mode",
    language: "Language",
    orderHistory: "Order history",
    login: "Log in",
    logout: "Log out",
    logoutAlert: "You have been logged out.",
    confirm: "Confirm",
    cancel: "Cancel",
    confirmLogout: "Do you really want to log out?",
  },
};

type Language = "fr" | "en";

export default function Settings() {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [language, setLanguage] = useState<Language>("fr");
  const [showHistory, setShowHistory] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { user } = useAuth();

  const navigation = useNavigation<any>();
  const t = texts[language];

  const confirmLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutModal(false);
    } catch (error) {
      console.error("Erreur de déconnexion", error);
    }
  };

  if (showHistory) {
    return (
      <OrderHistory language={language} onBack={() => setShowHistory(false)} />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="settings" size={32} color="#faae89" />
        <Text style={styles.headerText}>{t.title}</Text>
      </View>

      <SettingsActionItem
        label={t.orderHistory}
        iconName="history"
        iconColor="#ff9800"
        onPress={() => setShowHistory(true)}
      />

      {user ? (
        <SettingsActionItem
          label={t.logout}
          iconName="logout"
          iconColor="#f44336"
          onPress={() => setShowLogoutModal(true)}
        />
      ) : (
        <SettingsActionItem
          label={t.login}
          iconName="login"
          iconColor="#4caf50"
          onPress={() => navigation.navigate("auth")}
        />
      )}

      {/* Modal de déconnexion */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <MaterialIcons name="logout" size={36} color="#f44336" />
            <Text style={styles.modalText}>{t.confirmLogout}</Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalButtonText}>{t.cancel}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#f44336" }]}
                onPress={confirmLogout}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                  {t.confirm}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const SettingsOptionItem = ({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}) => (
  <View style={styles.optionContainer}>
    <Text style={styles.label}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ true: "#faae89" }}
    />
  </View>
);

const SettingsActionItem = ({
  label,
  iconName,
  iconColor,
  onPress,
}: {
  label: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} style={styles.optionContainer}>
    <Text style={[styles.label, { color: iconColor, fontWeight: "bold" }]}>
      {label}
    </Text>
    <MaterialIcons name={iconName} size={24} color={iconColor} />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    paddingBottom: 12,
    gap: 10,
  },
  headerText: {
    color: "#faae89",
    fontSize: 30,
    fontWeight: "bold",
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomColor: "#f3d9c2",
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  pickerWithFlag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flag: {
    width: 36,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerWrapper: {
    borderWidth: Platform.OS === "android" ? 1 : 0,
    borderColor: "#f0c8a0",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff7f5",
    width: 144,
  },
  picker: {
    height: 53,
    color: "#bb7a59",
    fontWeight: "bold",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 16,
    color: "#555",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
