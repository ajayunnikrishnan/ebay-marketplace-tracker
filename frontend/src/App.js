import { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `http://localhost:8080/api/products/search?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
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
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <ul className="space-y-4">
        {results.map((item) => (
          <li key={item.id} className="border rounded-lg p-4 flex space-x-4">
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
              <p className="mt-1 font-semibold">${item.price.toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
