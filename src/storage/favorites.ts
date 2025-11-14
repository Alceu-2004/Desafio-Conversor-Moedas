import AsyncStorage from '@react-native-async-storage/async-storage';


const KEY = '@favorites_currencies';


export async function getFavorites(): Promise<string[]> {
const data = await AsyncStorage.getItem(KEY);
return data ? JSON.parse(data) : [];
}


export async function addFavorite(code: string): Promise<void> {
const list = await getFavorites();
if (!list.includes(code)) {
list.push(code);
await AsyncStorage.setItem(KEY, JSON.stringify(list));
}
}


export async function removeFavorite(code: string): Promise<void> {
const list = await getFavorites();
const filtered = list.filter((item) => item !== code);
await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
}


export async function isFavorite(code: string): Promise<boolean> {
const list = await getFavorites();
return list.includes(code);
}