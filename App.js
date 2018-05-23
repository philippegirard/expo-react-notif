import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Permissions, Notifications } from 'expo';
import { Button } from 'react-native';

const PUSH_ENDPOINT = 'http://192.168.0.108:3000/';

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  // POST the token to your backend server from where you can retrieve it to send push notifications.
  return fetch(PUSH_ENDPOINT + 'push/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token,
      name: 'my name is nice',
    }),
  });
}

async function pushNotif() {

  return fetch(PUSH_ENDPOINT + 'push/notif', {
    method: 'GET',
  })
}

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to PHIL working on your app!</Text>

        <Button
          onPress={registerForPushNotificationsAsync}
          title="Register"
          color="#841584"
          accessibilityLabel="Register for push notifications"
        />

        <Button
          onPress={pushNotif}
          title="Send Push"
          color="#5620E4"
          accessibilityLabel="Send a test push notification"
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

