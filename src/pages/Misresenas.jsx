import { useEffect, useState } from "react";

export default function MisResenas() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/reviews")
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Mis Reseñas</h1>

      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-white shadow rounded p-4 border">
            
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{r.user}</h3>
              <span className="text-yellow-400 text-xl">
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              </span>
            </div>

            <p className="text-gray-500 text-sm">
              {new Date(r.date).toLocaleDateString()}
            </p>

            <p className="text-gray-700 mt-2">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
