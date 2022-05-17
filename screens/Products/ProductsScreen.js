import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
} from 'react-native';
import React from 'react';
import {faker} from '@faker-js/faker';
import {Card} from '@rneui/themed';

export default function ProductsScreen({navigation}) {
  let products = [];
  for (let i = 0; i < 10; i++) {
    const product = {
      id: i,
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      imageURL: faker.image.animals(128, 128, true),
      credit: faker.commerce.price(1, 10, 0),
    };
    products.push(product);
  }

  const renderItem = ({item}) => {
    return (
      <Pressable
        onPress={() => {
          navigation.push('ProductDetail', {item});
        }}
        style={styles.card}>
        <Card>
          <Card.Title style={styles.cardTitle}>{item.title}</Card.Title>
          <Card.Divider />
          <Card.Image source={{uri: item.imageURL}} />
          <View style={styles.subtitleContainer}>
            <Text style={styles.creditText}>{item.credit} Credit</Text>
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        style={styles.listContainer}
        data={products}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  listContainer: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 0,
  },
  creditText: {
    color: 'black',
    fontSize: 15,
  },
  subtitleContainer: {
    alignItems: 'flex-end',
  },
});
