import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const categories = ['All', 'Sneakers', 'Boots', 'Formal', 'Running', 'Others'];

const Shoes = () => {
  const [shoes, setShoes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('All');
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'goals'), 
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShoes(list);
    });

    return unsubscribe;
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Shoe',
      'Are you sure you want to delete this shoe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const docRef = doc(db, 'goals', id);
              await deleteDoc(docRef);
            } catch (error) {
              console.log('Error deleting shoe:', error);
            }
          },
        },
      ]
    );
  };

  const toggleFavorite = async (id, currentValue) => {
    try {
      const docRef = doc(db, 'goals', id);
      await updateDoc(docRef, { isFavorite: !currentValue });
    } catch (error) {
      console.log('Error updating favorite:', error);
    }
  };

  const filteredShoes =
    filter === 'All'
      ? shoes
      : shoes.filter((shoe) => shoe.category === filter);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with icon */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="shoe-sneaker" size={28} color="#B21B1B" />
        <Text style={styles.title}>Your Shoes</Text>
      </View>

      {/* Category filter bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            style={[
              styles.filterButton,
              filter === cat && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(cat)}
          >
            <Text
              style={[
                styles.filterText,
                filter === cat && styles.activeFilterText,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Shoe List */}
      <FlatList
        data={filteredShoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onLongPress={() =>
              setSelectedId(selectedId === item.id ? null : item.id)
            }
          >
            <View style={styles.shoeItem}>
              {/* Shoe image */}
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.shoeImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={{ color: 'gray' }}>No Image</Text>
                </View>
              )}

              {/* Shoe details */}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.row}>
                  <Text style={styles.shoeText}>
                    {item.title || 'Unnamed Shoe'}
                  </Text>
                  <Pressable
                    onPress={() => toggleFavorite(item.id, item.isFavorite)}
                  >
                    <MaterialIcons
                      name={item.isFavorite ? 'favorite' : 'favorite-border'}
                      size={24}
                      color={item.isFavorite ? '#B21B1B' : 'gray'}
                    />
                  </Pressable>
                </View>

                <Text style={styles.priceText}>₱{item.price ?? 0}</Text>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>

              {/* Edit/Delete buttons (long press) */}
              {selectedId === item.id && (
                <View style={styles.buttonsContainer}>
                  <Pressable
                    style={[styles.button, { backgroundColor: '#21cc8d' }]}
                    onPress={() => router.push(`/goals/edit/${item.id}`)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.button, { backgroundColor: '#B21B1B' }]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No shoes yet. Add one!</Text>
        }
      />

      {/* Floating Logout Button */}
      <FAB
        style={styles.fab}
        small
        icon="logout"
        label="Logout"
        color="white"
        onPress={() => signOut(auth)}
      />
    </SafeAreaView>
  );
};

export default Shoes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    
  },
  filterBar: {
    flexGrow: 0,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  activeFilterButton: {
    backgroundColor: '#B21B1B',
    borderColor: '#B21B1B',
  },
  filterText: {
    color: '#333',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '700',
  },
  shoeItem: {
    flexDirection: 'row',
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shoeImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shoeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  button: {
    padding: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 20,
    bottom: 20,
    backgroundColor: '#000',
  },
});
