import React from "react";
import { View, Text } from "react-native";
export default function AboutScreen() {
  return (
    <View style={{padding:16}}>
      <Text style={{fontSize:18,fontWeight:"600"}}>Sobre</Text>
      <Text>App de conversão de moedas — desafio técnico.</Text>
    </View>
  );
}
