import { useState, useEffect } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch current watchlist on mount
  useEffect(() => {
    fetch('http://localhost:8080/api/watch')
      .then(r => r.json())
      .then(setWatchlist)
      .catch(console.error);
  }, []);

  const handleSearch = async e => {
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
      setWatchlist(wl => [...wl, newWatch]);
    } catch {
      alert('Could not add to watchlist');
    }
  };

  const handleRemove = async (watchId) => {
    await fetch(`http://localhost:8080/api/watch/${watchId}`, { method: 'DELETE' });
    setWatchlist(wl => wl.filter(w => w.watchId !== watchId));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">eBay Tracker</h1>

      <form onSubmit={handleSearch} className="flex mb-6 space-x-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search eBay listings…"
          className="flex-grow border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <ul className="space-y-4 mb-8">
        {results.map(item => (
          <li key={item.id} className="border rounded-lg p-4 flex space-x-4 items-center">
            <img src={item.img} alt={item.title} className="w-24 h-24 object-cover rounded" />
            <div className="flex-grow">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {item.title}
              </a>
              <p className="mt-1 font-semibold">${item.price.toFixed(2)}</p>
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
        {watchlist.map(w => (
          <li key={w.watchId} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">Query: {w.query}</p>
              <p>ID: {w.productId} | Last Price: ${w.lastKnownPrice.toFixed(2)}</p>
            </div>
            <button
              onClick={() => handleRemove(w.watchId)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </li>
        ))}
        {watchlist.length === 0 && <p className="text-gray-600">No items watched yet.</p>}
      </ul>
    </div>
  );
}

export default App;
