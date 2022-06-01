import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import ClickWheel from './components/ClickWheel';
import { useEffect, useState } from 'react';

import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri,ResponseType, useAuthRequest } from 'expo-auth-session';
import Player from './components/Player';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function App() {
  const [accessToken, setAccessToken] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: 'ac93e50d2b2b490191efb511d37159de',
      scopes: [
        'user-read-email',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-library-read',
        'user-library-modify',
        'user-top-read',
        'user-read-recently-played',
        'user-read-playback-state',
        'user-modify-playback-state',
      ],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: makeRedirectUri({ scheme: "retropod", path: "" }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      
      const { access_token } = response.params;
      console.log("yeah!");
      setLoggedIn(true);
      setAccessToken(access_token);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <LinearGradient colors={['#eee', '#aaa']} style={styles.background}>
        <Player token={accessToken}/>
        {loggedIn ? null : 
        <Button
          disabled={!request}
          title="Login"
          onPress={() => {
            promptAsync();
          }}
        />}
        
        
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
