import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { fetchRates } from "../../services/exchangeService";

export default function CoinsList() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRates("USD")
      .then((r) => setRates(r.conversion_rates))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{flex:1}} />;

  const data = rates ? Object.entries(rates) : [];

  return (
    <View style={{flex:1}}>
      <FlatList
        data={data}
        keyExtractor={([code]) => code}
        renderItem={({ item }) => {
          const [code, value] = item;
          return (
            <View style={{padding:12, borderBottomWidth:1, borderColor:"#eee"}}>
              <Text style={{fontSize:16}}>{code} — {value}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
