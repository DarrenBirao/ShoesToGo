import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#B21B1B" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: "https://i.ibb.co/3mcjQKt/shoes-banner.jpg" }} // 👟 shoe banner
      style={styles.bg}
      blurRadius={3}
    >
      {/* Dark + red tint overlay */}
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>
          Shoes
          <Text style={{ color: "#B21B1B" }}>ToGo</Text> 
        </Text>

        {user && (
          <Text style={styles.welcome}>Welcome back, {user.email}</Text>
        )}

        {/* Black button → View Shoes */}
        <Pressable
          style={[styles.card, { backgroundColor: "#000" }]}
          onPress={() => router.push("/goals")}
        >
          <Ionicons name="albums-outline" size={28} color="white" />
          <Text style={styles.cardText}>View Shoes</Text>
        </Pressable>

        {/* Red button → Add Shoe */}
        <Pressable
          style={[styles.card, { backgroundColor: "#B21B1B" }]}
          onPress={() => router.push("/goals/create")}
        >
          <Ionicons name="add-circle-outline" size={28} color="white" />
          <Text style={styles.cardText}>Add a New Shoe</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)", // black overlay
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  welcome: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    width: "80%",
    marginVertical: 10,
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "700",
  },
});

export default Home;
