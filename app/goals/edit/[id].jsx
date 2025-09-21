import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
  Keyboard,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EditGoal = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Sneakers");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch goal data
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const docRef = doc(db, "goals", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setPrice(String(data.price || ""));
          setCategory(data.category || "Sneakers");
          setImage(data.image || null);
        }
      } catch (error) {
        console.log("Error fetching goal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  // ✅ Pick new image
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  // ✅ Update shoe
  const handleUpdate = async () => {
    if (!title.trim() || !price.trim()) {
      Alert.alert("Validation", "Title and price are required.");
      return;
    }

    try {
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, {
        title,
        price: parseFloat(price),
        category,
        image,
      });
      Keyboard.dismiss();
      router.push("/goals");
    } catch (error) {
      console.log("Error updating goal:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="shoe-sneaker" size={28} color="#B21B1B" />
        <Text style={styles.title}>Edit Shoe</Text>
      </View>

      {/* Shoe Name */}
      <TextInput
        style={styles.input}
        placeholder="Shoe Name"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      {/* Price */}
      <TextInput
        style={styles.input}
        placeholder="Price"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* Category */}
      <View style={styles.dropdown}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Sneakers" value="Sneakers" />
          <Picker.Item label="Boots" value="Boots" />
          <Picker.Item label="Formal" value="Formal" />
          <Picker.Item label="Running" value="Running" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>

      {/* Image Picker */}
      <Pressable onPress={pickImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>
          {image ? "Change Image" : "Pick an Image"}
        </Text>
      </Pressable>

      {image && <Image source={{ uri: image }} style={styles.previewImage} />}

      {/* Update Button */}
      <Pressable onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Update Shoe</Text>
      </Pressable>
    </ScrollView>
  );
};

export default EditGoal;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 6,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  input: {
    width: "100%",
    backgroundColor: "#FAFAFA",
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  dropdown: {
    width: "100%",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imageButton: {
    marginVertical: 12,
    padding: 15,
    backgroundColor: "#B21B1B",
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  imageButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  previewImage: {
    width: 220,
    height: 220,
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#21cc8d",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
