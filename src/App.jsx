import './App.css'
import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_DOG_API_KEY

function App() {

  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [banList, setBanList] = useState([]);

  const fetchDog = async () => {
    setLoading(true);
    setDog(null);

    try {
      const res = await fetch(
        "https://api.thedogapi.com/v1/images/search?has_breeds=true",
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );

      const data = await res.json();
      const dogData = data[0];
      const breed = dogData.breeds[0]

      const isBanned = 
      !breed.breed_group ||
      !breed.temperament ||
      !breed.life_span ||
      banList.includes(breed.breed_group) || 
      banList.includes(breed.temperament) || 
      banList.includes(breed.life_span);

      if (isBanned) {
        fetchDog();
        return;
      }

      setDog(dogData);
    }
    catch (error) {
      console.error("error fetching dog:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleBan = (value) => {
    if (value && !banList.includes(value)) {
      setBanList([...banList, value]);
    }
  };

  const removeBan = (value) => {
    setBanList(banList.filter(item => item !== value));
  };

  return (
    <div className="App">
      <h1>🐶 StumblePup</h1>
      <button onClick={fetchDog}>Discover a Dog 🐾</button>
      {loading && <p>Loading ...</p>}
      <br/>
      {dog && dog.breeds && (
        <div>
          <img src={dog.url} alt="A dog" style={{ width: '300px' }} />
          <h2>{dog.breeds[0].name}</h2>
          <div className="attribute-button">
            <button onClick={() => handleBan(dog.breeds[0].breed_group)}>
              {dog.breeds[0].breed_group || "unknown"}
            </button>
            <button onClick={() => handleBan(dog.breeds[0].temperament)}>
              {dog.breeds[0].temperament || "Unknown"}
            </button>
            <button onClick={() => handleBan(dog.breeds[0].life_span)}>
              {dog.breeds[0].life_span || "Unknown"}
            </button>
          </div>
        </div>
      )}
      <div>
        <h2>🚫 Ban List</h2>
        {banList.length === 0 ? (
          <p>No bans yet. Click a trait to ban it!</p>
        ):(
          <ul>
            {banList.map((item, index) => (
              <li key = {index}>
                <button onClick = {() => removeBan(item)}>{item}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App
