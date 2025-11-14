import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { fetchPair, fetchRates } from "../../services/exchangeService";

export default function Converter() {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("BRL");
  const [amount, setAmount] = useState("1");
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    // Buscar lista de códigos a partir de uma base
    fetchRates("USD").then(r => {
      setCurrencies(Object.keys(r.conversion_rates));
    }).catch(()=>Alert.alert("Erro ao carregar moedas"));
  }, []);

  async function handleConvert() {
    try {
      const pair = await fetchPair(from, to, Number(amount));
      setRate(pair.conversion_rate);
      setResult(pair.conversion_result ?? Number(amount) * pair.conversion_rate);
    } catch (e) {
      Alert.alert("Erro na conversão");
      console.error(e);
    }
  }

  return (
    <View style={{padding:16}}>
      <Text>Moeda origem</Text>
      <Picker selectedValue={from} onValueChange={(v) => setFrom(v)}>
        {currencies.map(c => <Picker.Item label={c} value={c} key={c} />)}
      </Picker>

      <Text>Moeda destino</Text>
      <Picker selectedValue={to} onValueChange={(v) => setTo(v)}>
        {currencies.map(c => <Picker.Item label={c} value={c} key={c} />)}
      </Picker>

      <Text>Valor</Text>
      <TextInput keyboardType="numeric" value={amount} onChangeText={setAmount} style={{borderWidth:1,padding:8,marginBottom:8}} />

      <Button title="Converter" onPress={handleConvert} />

      {rate !== null && (
        <View style={{marginTop:16}}>
          <Text>Taxa: {rate}</Text>
          <Text>Resultado: {result}</Text>
          <Text>Origem: {amount} {from}</Text>
          <Text>Destino: {result} {to}</Text>
        </View>
      )}
    </View>
  );
}
