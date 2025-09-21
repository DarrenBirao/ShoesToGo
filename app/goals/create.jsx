import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Pressable, Keyboard, View, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons} from '@expo/vector-icons'; // ✅ added

const Create = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Sneakers');
  const [image, setImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to pick an image!'
        );
      }
    })();
  }, []);

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
      console.log('Error picking image:', error);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price.trim() || !category) return;

    await addDoc(collection(db, 'goals'), {
      title: name,
      price: parseFloat(price),
      category,
      imageUrl: image || '',
      isFavorite: false,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });

    setName('');
    setPrice('');
    setCategory('Sneakers');
    setImage(null);
    Keyboard.dismiss();
    router.push('/goals');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Shoe Icon */}
      <MaterialCommunityIcons name="shoe-sneaker" size={72} color="#B21B1B" style={styles.icon} />

      <Text style={styles.title}>Add a New Shoe</Text>

      <TextInput
        style={styles.input}
        placeholder="Shoe Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        placeholderTextColor="#999"
      />

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

      <Pressable onPress={pickImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>
          {image ? 'Change Image' : 'Pick an Image'}
        </Text>
      </Pressable>

      {image && <Image source={{ uri: image }} style={styles.previewImage} />}

      <Pressable onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Add Shoe</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000000',
  },
  input: {
    width: 300,
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#000',
  },
  dropdown: {
    width: 300,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imageButton: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#B21B1B',
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  imageButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  previewImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
  button: {
    marginTop: 20,
    padding: 18,
    backgroundColor: '#000000',
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
