import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@favorites";

export async function getFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function setFavorites(list: string[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function addFavorite(code: string) {
  const list = await getFavorites();
  if (!list.includes(code)) {
    list.push(code);
    await setFavorites(list);
  }
}

export async function removeFavorite(code: string) {
  let list = await getFavorites();
  list = list.filter((c) => c !== code);
  await setFavorites(list);
}
