import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (err) {
      setError("Invalid email or password ❌");
    }
  };

  return (
    <View style={styles.container}>
      {/* Big sneaker icon */}
      <MaterialCommunityIcons
        name="shoe-sneaker"
        size={84}
        color="#B21B1B"
        style={styles.icon}
      />

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your ShoesToGo account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.primaryButtonText}>Login</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/auth/signup")}>
        <Text style={styles.link}>Don’t have an account? Sign up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Palette: red #B21B1B, black #000, white, light grey #F5F5F5
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 22,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    color: "#000",
  },
  error: {
    color: "#B21B1B",
    marginBottom: 10,
    textAlign: "center",
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#B21B1B", // brand red
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 12,
    elevation: 2,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    color: "#000",
    marginTop: 6,
    fontSize: 15,
  },
});
