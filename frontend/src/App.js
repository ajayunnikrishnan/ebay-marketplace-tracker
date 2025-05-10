import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';

function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/watch')
      .then((r) => r.json())
      .then(setWatchlist)
      .catch(console.error);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `http://localhost:8080/api/products/search?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error(res.statusText);
      setResults(await res.json());
    } catch {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = async (productId) => {
    try {
      const res = await fetch('http://localhost:8080/api/watch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, query })
      });
      const newWatch = await res.json();
      setWatchlist((wl) => [...wl, newWatch]);
    } catch {
      alert('Could not add to watchlist');
    }
  };

  const handleRemove = async (watchId) => {
    await fetch(`http://localhost:8080/api/watch/${watchId}`, {
      method: 'DELETE'
    });
    setWatchlist((wl) => wl.filter((w) => w.watchId !== watchId));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">eBay Tracker</h1>

      <form onSubmit={handleSearch} className="flex mb-6 space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search eBay listings…"
          className="flex-grow border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <ul className="space-y-4 mb-8">
        {results.map((item) => (
          <li
            key={item.id}
            className="border rounded-lg p-4 flex space-x-4 items-center"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-grow">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {item.title}
              </a>
              <p className="mt-1 font-semibold">
                ${item.price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => handleWatch(item.id)}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Watch
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mb-4">Your Watchlist</h2>
      <ul className="space-y-4">
        {watchlist.map((w) => (
          <li
            key={w.watchId}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">Query: {w.query}</p>
              <p>
                ID: {w.productId} | Last Price:{' '}
                ${w.lastKnownPrice.toFixed(2)}
              </p>
            </div>
            <div className="flex space-x-2">  
              <Link
                to={`/watch/${w.watchId}`}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Details
              </Link>
              <button
                onClick={() => handleRemove(w.watchId)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
        {watchlist.length === 0 && (
          <p className="text-gray-600">No items watched yet.</p>
        )}
      </ul>
    </div>
  );
}

function Details() {
  const { watchId } = useParams();
  const [watch, setWatch] = useState(null);
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8080/api/watch/${watchId}`)
      .then((r) => r.json())
      .then(setWatch)
      .catch(() => setError('Failed to load watch'));
  }, [watchId]);

  useEffect(() => {
    if (!watch) return;
    // main product
    fetch(
      `http://localhost:8080/api/products/${watch.productId}`
    )
      .then((r) => r.json())
      .then(setProduct)
      .catch(() => setError('Failed to load product'));

    // similar by query
    fetch(
      `http://localhost:8080/api/products/search?query=${encodeURIComponent(
        watch.query
      )}`
    )
      .then((r) => r.json())
      .then(setSimilar)
      .catch(() => setError('Failed to load similar products'));
  }, [watch]);

  if (error) return <p className="text-red-600 p-8">{error}</p>;
  if (!watch || !product) return <p className="p-8">Loading...</p>;

  const prices = similar.map((i) => i.price);
  const cheapest = prices.length ? Math.min(...prices) : 0;
  const avg = prices.length
    ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
    : 0;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline">
        &larr; Back
      </Link>
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <div className="border rounded p-4 flex space-x-4 mb-6">
        <img
          src={product.img}
          alt={product.title}
          className="w-32 h-32 object-cover rounded"
        />
        <div>
          <p className="font-semibold text-xl">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
      <p className="mb-4">
        Cheapest: <span className="font-bold">${cheapest}</span>
      </p>
      <p className="mb-8">
        Average: <span className="font-bold">${avg}</span>
      </p>

      <h2 className="text-2xl font-semibold mb-4">
        Similar Listings
      </h2>
      <ul className="space-y-4">
        {similar
          .sort((a, b) => a.price - b.price)
          .map((item) => (
            <li
              key={item.id}
              className="border rounded p-4 flex space-x-4 items-center"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-grow">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {item.title}
                </a>
                <p className="mt-1 font-semibold">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:watchId" element={<Details />} />
      </Routes>
    </Router>
  );
}
