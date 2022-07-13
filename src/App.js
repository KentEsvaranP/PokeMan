import React, { useState, useEffect } from "react";
import ImageSource from "./imageSource";
import "./styles.css";

const restApi = async (url) => {
  return await fetch(url).then((res) => res.json());
};

export default function App() {
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [paginate, setpaginate] = useState(8);

  useEffect(() => {
    // restApi("https://pokeapi.co/api/v2/ability/?limit=10&offset=0")
    restApi("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0").then(
      async (result) => {
        setLoaded(true);
        await setItems(result.results);
        //console.log("result::", result.results);
      },
      (error) => {
        setLoaded(true);
        setError(error);
      }
    );
  }, []);

  const data = Object.values(items);

  const search_parameters = Object.keys(Object.assign({}, ...data));
  // const filter_items = [...new Set(data.map((item) => item.region))];
  // const search_parameters = [];
  const filter_items = [];
  function search(items) {
    return items.filter(
      (item) =>
        item.name.includes(filter) &&
        search_parameters.some((parameter) =>
          item[parameter].toString().toLowerCase().includes(query)
        )
    );
  }

  const load_more = (event) => {
    setpaginate((prevValue) => prevValue + 8);
  };

  if (error) {
    return <>{error.message}</>;
  } else if (!loaded) {
    return <>loading...</>;
  } else {
    return (
      <div className="wrapper">
        <div className="search-wrapper">
          <label htmlFor="search-form">
            <input
              type="search"
              name="search-form"
              id="search-form"
              className="search-input"
              placeholder="Search for..."
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="sr-only">Search countries here</span>
          </label>

          <div className="select">
            <select
              onChange={(e) => setFilter(e.target.value)}
              className="custom-select"
              aria-label="Filter Countries By Region"
            >
              <option value="">Filter By Region</option>
              {filter_items.map((item) => (
                <option value={item}>Filter By {item}</option>
              ))}
            </select>
            <span className="focus"></span>
          </div>
        </div>

        <ul className="card-grid">
          {search(data)
            .slice(0, paginate)
            .map((item) => (
              <li key={item.name}>
                <article className="card">
                  <div className="card-image">
                    <ImageSource imgApi={item.url} imageName={item.name} />
                  </div>
                  <div className="card-content">
                    <h2 className="card-name">{item.name}</h2>
                  </div>
                </article>
              </li>
            ))}
        </ul>
        <button onClick={load_more}>Load More</button>
      </div>
    );
  }
}
