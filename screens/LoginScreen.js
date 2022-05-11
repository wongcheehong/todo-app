import React, {useState, useContext} from 'react';
import {View, Button, TextInput, StyleSheet} from 'react-native';
import {LoginContext} from '../context/LoginContext';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const LoginCtx = useContext(LoginContext);

  const handleSignIn = () => {
    if (username === 'admin' && password === 'admin') {
      LoginCtx.login();
    } else {
      console.log('Wrong username or password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View>
        <Button title="Sign in" onPress={handleSignIn} />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    marginHorizontal: 10,
  },
});
