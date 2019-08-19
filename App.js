//import liraries
console.disableYellowBox = true;
import React, { Component } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import App from './src'
// create a component
export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}


