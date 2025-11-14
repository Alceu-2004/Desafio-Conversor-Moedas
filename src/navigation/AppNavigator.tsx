import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import AboutScreen from "../screens/AboutScreen";
import CoinsList from "../screens/Coins/CoinsList";
import Favorites from "../screens/Coins/Favorites";
import Converter from "../screens/Coins/Converter";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function CoinsTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Moedas" component={CoinsList} />
      <Tab.Screen name="Favoritas" component={Favorites} />
      <Tab.Screen name="Converter" component={Converter} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Início">
        <Drawer.Screen name="Início" component={HomeScreen} />
        <Drawer.Screen name="Sobre" component={AboutScreen} />
        <Drawer.Screen name="Moedas" component={CoinsTabs} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}