import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';


interface Coin {
code: string;
name: string;
high: string;
low: string;
}


export default function CoinsList() {
const [coins, setCoins] = useState<Coin[]>([]);
const [favorites, setFavorites] = useState<string[]>([]);


useEffect(() => {
fetchCoins();
loadFavorites();
}, []);


async function fetchCoins() {
try {
const response = await fetch('https://economia.awesomeapi.com.br/json/all');
const data = await response.json();


const formatted = Object.keys(data).map((key) => ({
code: key,
name: data[key].name,
high: data[key].high,
low: data[key].low,
}));


setCoins(formatted);
} catch (error) {
console.error('Erro ao buscar moedas:', error);
}
}


async function loadFavorites() {
const saved = await AsyncStorage.getItem('@favorites_currencies');
if (saved) setFavorites(JSON.parse(saved));
}


async function saveFavorites(list: string[]) {
setFavorites(list);
await AsyncStorage.setItem('@favorites_currencies', JSON.stringify(list));
}


function toggleFavorite(code: string) {
let updatedFavorites = favorites.includes(code)
? favorites.filter((item) => item !== code)
: [...favorites, code];


saveFavorites(updatedFavorites);
}


function renderItem({ item }: { item: Coin }) {
const isFavorite = favorites.includes(item.code);


return (
<View style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 }}>
<View>
<Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.code}</Text>
<Text>{item.name}</Text>
</View>


<TouchableOpacity onPress={() => toggleFavorite(item.code)}>
<Ionicons
name={isFavorite ? 'star' : 'star-outline'}
size={28}
color={isFavorite ? 'gold' : 'gray'}
/>
</TouchableOpacity>
</View>
);
}


return (
    <FlatList
      data={coins}
      keyExtractor={(item) => item.code}
      renderItem={renderItem}
    />
  );
}