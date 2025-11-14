import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { getFavorites } from "../../storage/favorites";
import { fetchRates } from "../../services/exchangeService";

export default function Favorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const favs = await getFavorites();
      setFavorites(favs);

      if (favs.length > 0) {
        const r = await fetchRates("USD");
        setRates(r.conversion_rates);
      } else {
        setRates({});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = loadData();
    const interval = setInterval(loadData, 1000); // atualiza automaticamente ao favoritar

    return () => clearInterval(interval);
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nenhuma moeda favoritada ainda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const rate = rates ? rates[item] : undefined;
          return (
            <View style={styles.row}>
              <Text style={styles.code}>{item}</Text>
              <Text style={styles.value}>
                {rate !== undefined ? rate.toString() : "—"}
              </Text>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  emptyText: { fontSize: 16, color: "#666" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12 },
  code: { fontSize: 16, fontWeight: "600" },
  value: { fontSize: 16 },
  sep: { height: 1, backgroundColor: "#eee" },
});
