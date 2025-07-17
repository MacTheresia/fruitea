import { MaterialIcons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
} from "react-native";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native"; // ✅ React Navigation

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigation = useNavigation<any>();

  const showCuteAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      showCuteAlert("Veuillez remplir tous les champs.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      showCuteAlert("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.reset({
          index: 0,
          routes: [{ name: "Profile" }], // ✅ adapte le nom du screen
        });
      }
    } catch (error: any) {
      showCuteAlert("Mot de passe ou email incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="#faae89" />
      </Pressable>
      <View style={styles.header}>
        <MaterialIcons name="lock" size={32} color="#faae89" />
        <Text style={styles.headerText}>
          {mode === "login" ? "Connexion" : "Inscription"}
        </Text>
      </View>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Votre email"
        placeholderTextColor="#bfa091"
        selectionColor="#faae89"
      />

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="********"
        secureTextEntry
        placeholderTextColor="#bfa091"
        selectionColor="#faae89"
      />

      {mode === "signup" && (
        <>
          <Text style={styles.label}>Confirmation du mot de passe</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="********"
            secureTextEntry
            placeholderTextColor="#bfa091"
            selectionColor="#faae89"
          />
        </>
      )}

      <Pressable
        onPress={handleAuth}
        style={({ pressed }) => [
          styles.saveButton,
          pressed && { opacity: 0.7 },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveText}>
            {mode === "login" ? "Se connecter" : "S'inscrire"}
          </Text>
        )}
      </Pressable>

      <Pressable onPress={() => setMode(mode === "login" ? "signup" : "login")}>
        <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
          {mode === "login"
            ? "Pas encore de compte ? S'inscrire"
            : "Déjà un compte ? Se connecter"}
        </Text>
      </Pressable>

      {/* Modal mignon */}
      <Modal
        transparent
        visible={alertVisible}
        animationType="fade"
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialIcons name="error-outline" size={60} color="#faae89" />
            <Text style={styles.modalTitle}>Oups !</Text>
            <Text style={styles.modalMessage}>{alertMessage}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setAlertVisible(false)}
            >
              <Text style={styles.modalButtonText}>D'accord </Text>
            </Pressable>
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
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: "#fff7f5",
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
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#6b6b6b",
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
  backButton: {
    position: "absolute",
    top: 36,
    left: 20,
    padding: 6,
    zIndex: 10,
  },
});
