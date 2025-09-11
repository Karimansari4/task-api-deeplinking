// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking } from 'react-native';
import ProductList from './src/screens/ProductList';
import ProductDetails from './src/screens/ProductDetails';
import Products from './src/screens/Products';
import BottomTabs from './src/navigation/BottomTabs';

const Stack = createNativeStackNavigator();

/* const linking = {
  prefixes: [
    'https://io.pixelsoftwares.com',
    'io.pixelsoftwares://', // optional custom scheme
  ],
  config: {
    screens: {
      ProductList: {
        path: '',
      },
      ProductDetails: {
        // expect link like: https://io.pixelsoftwares.com/product/123
        path: 'product/:productId',
        parse: {
          productId: (id: any) => `${id}`,
        },
      },
    },
  },
}; */

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
      <Stack.Navigator initialRouteName="BottomTab">
        <Stack.Screen name="BottomTab" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: 'Product Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
