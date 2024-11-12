import "./App.css";
import Axios from "axios";
import { useState } from "react";

function App() {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [error, setError] = useState(false);
  const [albumCover, setAlbumCover] = useState();

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

        // Now, fetch the album cover from iTunes API
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
          ); // Higher resolution
          setAlbumCover(albumCoverUrl); // Assume you have an album cover state like `const [albumCover, setAlbumCover] = useState("");`
        }
      })
      .catch(() => {
        setError(true);
      });
  }

  return (
    <div className="App">
      <h1>Lyrics Finder ???? </h1>
      <p>(Artist name and song title have to be close to precise)</p>

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
      <button className="btn" onClick={searchLyrics}>
        ???? Search
      </button>
      <hr />

      {/* Display album cover if available */}
      {albumCover && (
        <div>
          <img
            src={albumCover}
            alt={`${song} album cover`}
            style={{ maxWidth: "300px", marginTop: "20px" }}
          />
        </div>
      )}

      {/* Display error message or lyrics */}
      <pre>{error ? "Input a valid song and artist" : lyrics}</pre>

      <footer>
        <p>
          Made by <a href="">Olakunle Joseph</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
