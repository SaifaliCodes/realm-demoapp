import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Realm from 'realm';

const UserSchema = {
  name: 'User',
  properties: {
    name: 'string',
  },
};


const App = () => {
  const [name, setName] = useState<string>('');
  const [savedName, setSavedName] = useState<string>('');

  useEffect(() => {
    const realm = new Realm({ schema: [UserSchema] });

    const user = realm.objects('User')[0];
    console.log("user>>>", user);
    if (user && typeof user.name === 'string') {
      setSavedName(user.name);
    }

    return () => {
      // Close the Realm instance when the component is unmounted
      realm.close();
    };
  }, []);



  const handleSave = async () => {
    // setSavedName(name);
    // console.log("Saved name: ", savedName);
    // console.log("Name: ", name)

    const realm = new Realm({ schema: [UserSchema] });

    realm.write(() => {
      // Delete all existing User objects (optional, if you only want to save one user)
      realm.delete(realm.objects('User'));

      // Create a new User object and save it to the database
      realm.create('User', { name });
    });

    // Retrieve and display the saved name
    const user = realm.objects('User')[0];
    console.log("habdleSave --> user>>>", user);
    if (user && typeof user.name === 'string') {
      setSavedName(user.name);
    }

    realm.close();
  };

  return (
    <View style={styles.container}>
      {savedName ? <Text style={{ marginBottom: 5, paddingHorizontal: 10, }}>Saved Name: {savedName}</Text> : null}
      <TextInput
        style={styles.inputBox}
        placeholder="Enter your name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TouchableOpacity style={styles.submitBtnContainer} onPress={handleSave}>
        <Text style={styles.submitBtnText}>Submit</Text>
      </TouchableOpacity>

    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  inputBox: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  submitBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#000000",
    borderRadius: 10,
    paddingVertical: 12,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
  }
});

