import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFavorites } from "../../storage/favorites";
import { fetchRates } from "../../services/exchangeService";

export default function Favorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        try {
          setLoading(true);

          const favs = await getFavorites();
          if (isActive) setFavorites(favs);

          if (favs.length > 0) {
            const r = await fetchRates("USD");
            if (isActive) setRates(r.conversion_rates);
          } else {
            if (isActive) setRates({});
          }
        } catch (e) {
          console.error(e);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      load();

      return () => {
        isActive = false;
      };
    }, [])
  );

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
          const rate = rates[item];
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  code: { fontSize: 16, fontWeight: "600" },
  value: { fontSize: 16 },
  sep: { height: 1, backgroundColor: "#eee" },
});
