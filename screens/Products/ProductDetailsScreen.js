import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';

export default function ProductDetailsScreen({route, navigation}) {
  const product = route.params.item;

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{uri: product.imageURL}} style={styles.image} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.titleText}>{product.title}</Text>
            </View>
            <View>
              <Text style={styles.creditText}>{product.credit} Credit</Text>
            </View>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    margin: 10,
    paddingHorizontal: 10,
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: 200,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  creditText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleText: {
    color: 'black',
    fontSize: 27,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 20,
  },
  description: {
    fontSize: 20,
  },
});
