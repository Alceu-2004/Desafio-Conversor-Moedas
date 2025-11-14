import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

interface Currency {
  code: string;
  name: string;
}

export default function CoinsList() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    async function loadCurrencies() {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();

        const list = Object.keys(data.rates).map((code) => ({
          code,
          name: code,
        }));

        setCurrencies(list);
      } catch (error) {
        console.log("Erro ao carregar moedas:", error);
      }
    }

    loadCurrencies();
    loadFavorites();
  }, []);

  async function loadFavorites() {
    const saved = await AsyncStorage.getItem("@favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }

  async function saveFavorites(list: string[]) {
    setFavorites(list);
    await AsyncStorage.setItem("@favorites", JSON.stringify(list));
  }

  function toggleFavorite(code: string) {
    if (favorites.includes(code)) {
      const newList = favorites.filter((item) => item !== code);
      saveFavorites(newList);
    } else {
      const newList = [...favorites, code];
      saveFavorites(newList);
    }
  }

  const renderItem = ({ item }: { item: Currency }) => {
    const isFavorite = favorites.includes(item.code);

    return (
      <View style={styles.row}>
        <Text style={styles.text}>{item.code}</Text>

        <TouchableOpacity onPress={() => toggleFavorite(item.code)}>
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={26}
            color={isFavorite ? "#f5c518" : "#777"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={currencies}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        showsVerticalScrollIndicator={true}  
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,           
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  text: {
    fontSize: 18,
  },
});
