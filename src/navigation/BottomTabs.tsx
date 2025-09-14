import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "react-native-vector-icons/Feather";
import ProductList from "../screens/ProductList";
import Products from "../screens/Products";
import App from "../screens/ProductCard";

export type RootTabParamList = {
    Home: undefined;
    Profile: undefined;
    Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#2563eb", // Blue
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    backgroundColor: "white",
                    borderTopWidth: 0.5,
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName: string = "ProductGrid";

                    if (route.name == "ProductGrid") {
                        iconName = "grid";
                    } else if (route.name == "ProductList") {
                        iconName = "list";
                    }

                    return <Feather name={iconName} size={size} color={color} />
                },
            })}
        >
            {/* <Tab.Screen name="ProductGrid" options={{ title: "Grid View" }} component={ProductList} /> */}
            <Tab.Screen name="ProductGrid" options={{ title: "Grid View" }} component={App} />
            <Tab.Screen name="ProductList" options={{ title: "Product List" }} component={Products} />
        </Tab.Navigator>
    );
}
