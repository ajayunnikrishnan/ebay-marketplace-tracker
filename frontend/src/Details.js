import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Details() {
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
    fetch(`http://localhost:8080/api/products/${watch.productId}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(() => setError('Failed to load product'));

    fetch(
      `http://localhost:8080/api/products/search?query=${encodeURIComponent(watch.query)}`
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
      <Link to="/" className="text-blue-600 hover:underline">&larr; Back</Link>
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <div className="border rounded p-4 flex space-x-4 mb-6">
        <img
          src={product.img}
          alt={product.title}
          className="w-32 h-32 object-cover rounded"
        />
        <div>
          <p className="font-semibold text-xl">${product.price.toFixed(2)}</p>
        </div>
      </div>
      <p className="mb-4">Cheapest: <span className="font-bold">${cheapest}</span></p>
      <p className="mb-8">Average: <span className="font-bold">${avg}</span></p>
      <h2 className="text-2xl font-semibold mb-4">Similar Listings</h2>
      <ul className="space-y-4">
        {similar.sort((a, b) => a.price - b.price).map((item) => (
          <li key={item.id} className="border rounded p-4 flex space-x-4 items-center">
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
              <p className="mt-1 font-semibold">${item.price.toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
