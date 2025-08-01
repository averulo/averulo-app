import { StyleSheet, View } from 'react-native'
import { Button, Provider as PaperProvider, Text } from 'react-native-paper'

const WelcomeScreen = ({ navigation }) => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Averulo!</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('SignUp')}
          style={styles.button}
        >
          Sign Up
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        >
          Log In
        </Button>
      </View>
    </PaperProvider>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 10,
  },
})