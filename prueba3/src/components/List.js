
import { StyleSheet, Text, View, Button, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function List() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  const handleEdit = (product) => {
    setEditProduct(product);
  };

  const handleSave = () => {
    fetch(`http://localhost:8000/api/products/${editProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editProduct),
    })
    .then(() => {
      setProducts(products.map(product => product.id === editProduct.id ? editProduct : product));
      setEditProduct(null);
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/api/products/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      setProducts(products.filter(product => product.id !== id));
    });
  };

  if (editProduct) {
    return (
      <View>

        <TextInput
        value={editProduct.name}
        onChangeText={text => setEditProduct({ ...editProduct, name: text })}
        placeholder="Name"
      />
      <TextInput
        value={editProduct.description}
        onChangeText={text => setEditProduct({ ...editProduct, description: text })}
        placeholder="Description"
      />
      <TextInput
        value={editProduct.price.toString()}
        onChangeText={text => setEditProduct({ ...editProduct, price: Number(text) })}
        placeholder="Price"
        keyboardType="numeric"
      />
      <TextInput
        value={editProduct.quantity.toString()}
        onChangeText={text => setEditProduct({ ...editProduct, quantity: Number(text) })}
        placeholder="Quantity"
        keyboardType="numeric"
      />
      <TextInput
        value={editProduct.status}
        onChangeText={text => setEditProduct({ ...editProduct, status: text })}
        placeholder="Status"
      />
        <Button title="Save" onPress={handleSave} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.price}</Text>
            <Text>{item.quantity}</Text>
            <Text>{item.status}</Text>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  product: {
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  editButton: {
    color: 'blue',
  },
  deleteButton: {
    color: 'red',
  },
});