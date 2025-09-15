// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetails from './src/screens/ProductDetails';
import ProductsCard from './src/screens/ProductCard';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['https://io.pixelsoftwares.com', 'io.pixelsoftwares://'],
  config: {
    screens: {
      BottomTab: {
        screens: {
          ProductGrid: '',
          ProductList: 'products',
        },
      },
      ProductDetails: 'product/:id',
    },
  },
};


export default function App() {
  return (
    <NavigationContainer linking={linking} fallback={<></>}>
      <Stack.Navigator initialRouteName="Products">
        <Stack.Screen name="Products" component={ProductsCard} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: 'Product Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
