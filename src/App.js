import React, { useState } from "react";
import Axios from "axios";
import "./App.css";

function App() {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [albumCover, setAlbumCover] = useState("");
  const [error, setError] = useState(false);

  function searchLyrics() {
    if (artist === "" || song === "") {
      setError(true);
      return;
    }

    Axios.get(`https://api.lyrics.ovh/v1/${artist}/${song}`)
      .then((res) => {
        if (!res.data.lyrics) {
          setError(true);
          return;
        }
        setError(false);
        setLyrics(res.data.lyrics);

        return Axios.get(
          `https://itunes.apple.com/search?term=${encodeURIComponent(
            artist
          )}+${encodeURIComponent(song)}&entity=song&limit=1`
        );
      })
      .then((itunesRes) => {
        if (itunesRes && itunesRes.data.results.length > 0) {
          const albumCoverUrl = itunesRes.data.results[0].artworkUrl100.replace(
            "100x100",
            "600x600"
          );
          setAlbumCover(albumCoverUrl);
        }
      })
      .catch(() => {
        setError(true);
      });
  }

  return (
    <div className="App">
      <h1>Lyrics Finder ????</h1>
      <p>(Artist name and song title should be precise)</p>

      {/* Input container to hold both inputs on the same line */}
      <div className="input-container">
        <input
          className="inp"
          type="text"
          placeholder="Artist name"
          onChange={(e) => setArtist(e.target.value)}
        />
        <input
          className="inp"
          type="text"
          placeholder="Song name"
          onChange={(e) => setSong(e.target.value)}
        />
      </div>

      <button className="btn" onClick={searchLyrics}>
        ???? Search
      </button>
      <hr />
      {albumCover && (
        <div className="album-cover">
          <img src={albumCover} alt={`${song} album cover`} />
        </div>
      )}

      {lyrics == "" ? (
        <></>
      ) : (
        <pre className="lyrics">
          {error ? "Input a valid song and artist" : lyrics}
        </pre>
      )}

      <footer>
        <p>
          Made by <a href="">Olakunle Joseph</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
