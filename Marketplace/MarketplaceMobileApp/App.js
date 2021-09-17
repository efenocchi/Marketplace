import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { StyleSheet, Text, View,TouchableNativeFeedback} from 'react-native';


// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your App!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

const App = () => {
  const [rippleColor, setRippleColor] = useState(randomHexColor());
  const [rippleOverflow, setRippleOverflow] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableNativeFeedback
        onPress={() => {
          setRippleColor(randomHexColor());
          setRippleOverflow(!rippleOverflow);
          alert('Hai schiacciato il bottone');
        }}
        background={TouchableNativeFeedback.Ripple(rippleColor, rippleOverflow)}
      >
        <View style={styles.touchable}>
          <Text style={styles.text}>TouchableNativeFeedback</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const randomHexColor = () => {
  return "#000000".replace(/0/g, function() {
    return (~~(Math.random() * 16)).toString(16);
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#ecf0f1",
    padding: 8
  },
  touchable: { flex: 0.5, borderColor: "black", borderWidth: 1 },
  text: { alignSelf: "center" }
});

export default App;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
