//https://api.spotify.com/v1/me/top/{type}
import { useEffect, useState } from "react";
import SpotifyWebAPI from 'spotify-web-api-js';

export default function getFavSongs(token: string) {
  const [songs, setSongs] = useState([] as any[]);

  const fetchFavSongs = async () => {
    const spotifyApi = new SpotifyWebAPI();
    spotifyApi.setAccessToken(token);
    const topTracks = await spotifyApi.getMyTopTracks({ limit: 10 });
    const names = topTracks.items.map(t => t.name);
    //console.log("topTracks---------:", topTracks);
    setSongs(topTracks.items);
  }

  useEffect(() => {
    fetchFavSongs();
  }, []);

  return songs;
};
