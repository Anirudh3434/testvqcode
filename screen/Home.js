import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import globalStyle from './themes/style';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';

const Home = () => {
  const [amount, setAmount] = useState('');
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [convertedValue, setConvertedValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const API_KEY = '22b06afccb53aab330cdf5293b1c8015';

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.exchangeratesapi.io/v1/latest', {
        params: {
          access_key: API_KEY,
        },
      });

      const rates = response.data.rates;
      const formattedData = Object.keys(rates).map((key) => ({
        label: key,
        value: rates[key],
      }));

      setData(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConvert = () => {
    if (!selectedItem || isNaN(amount)) return;
    const converted = parseFloat(amount) * selectedItem.value;
    setConvertedValue(converted.toFixed(2));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={globalStyle.container}>
        <Text style={globalStyle.headerTitle}>Currency Converter</Text>

        <View style={styles.inputRow}>
          <Text style={globalStyle.label}>EUR:</Text>
          <TextInput
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter Amount"
            style={[globalStyle.input, { flex: 1 }]}
          />
        </View>

        <Dropdown
          style={[globalStyle.dropdown, isFocus && { borderColor: '#007AFF', borderWidth: 1 }]}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select Currency' : '...'}
          searchPlaceholder="Search..."
          value={selectedItem?.value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setSelectedItem(item);
            setIsFocus(false);
          }}
        />

        <TouchableOpacity
          disabled={!selectedItem || isNaN(amount)}
          onPress={handleConvert}
          style={[globalStyle.button, (!selectedItem || isNaN(amount)) && { opacity: 0.6 }]}
        >
          <Text style={globalStyle.buttonText}>Convert</Text>
        </TouchableOpacity>

        {convertedValue && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              {amount} EUR = {convertedValue} {selectedItem?.label}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Home;

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginBottom: 20,
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e6f0ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});