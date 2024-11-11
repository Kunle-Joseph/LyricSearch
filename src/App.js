import "./App.css";
import Axios from "axios";
import { useState } from "react";

function App() {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [lyrics, setLyrics] = useState("");
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
      })
      .catch(() => {
        setError(true);
      });
  }

  return (
    <div className="App">
      <h1>Lyrics Finder ???? </h1>
      <p>(Artsit name and song title have to be clsoe to precise)</p>

      <input
        className="inp"
        type="text"
        placeholder="Artist name"
        onChange={(e) => {
          setArtist(e.target.value);
        }}
      />
      <input
        className="inp"
        type="text"
        placeholder="Song name"
        onChange={(e) => {
          setSong(e.target.value);
        }}
      />
      <button className="btn" onClick={() => searchLyrics()}>
        ???? Search
      </button>
      <hr />
      <pre>{error ? "input valid song and artist" : lyrics}</pre>
      <footer><p>Made by <a href="">Olakunle Joseph</a></p></footer>
    </div>
  );
}

export default App;
