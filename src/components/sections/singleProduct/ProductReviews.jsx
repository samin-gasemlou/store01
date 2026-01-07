import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const initialReviews = [
  {
    id: 1,
    name: "Alisa",
    avatar: "/user.jpg",
    rating: 4,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    likes: 0,
    dislikes: 0,
  },
  {
    id: 2,
    name: "Alisa",
    avatar: "/user.jpg",
    rating: 5,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    likes: 0,
    dislikes: 0,
  },
];

export default function ProductReviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!comment || !name) return;

    setReviews([
      ...reviews,
      {
        id: Date.now(),
        name,
        avatar: "/user.jpg",
        rating,
        text: comment,
        likes: 0,
        dislikes: 0,
      },
    ]);

    setComment("");
    setName("");
    setEmail("");
    setRating(0);
  };

  return (
    <section className="w-full mx-auto ">
      <div className="bg-white rounded-3xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl text-[#1C1E1F] font-semibold">Reviews</h3>
          <select className="border-[#1C1E1F] border text-[#1C1E1F] rounded-lg w-[81px] px-2 py-1 text-sm">
            <option>Sort by</option>
            <option>Newest</option>
            <option>Highest rating</option>
          </select>
        </div>

        {/* REVIEWS LIST */}
        <div className="space-y-6 mb-12">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white shadow-[0px_0px_31.2px_rgba(0,0,0,0.05)] rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <img
                    src={review.avatar}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{review.name}</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={i <= review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center md:flex-row flex-col md:p-0 px-2 gap-2 text-sm">
                  <button
                    onClick={() =>
                      setReviews(reviews.map(r =>
                        r.id === review.id ? { ...r, likes: r.likes + 1 } : r
                      ))
                    }
                    className="flex items-center gap-1 text-green-600"
                  >
                    <ThumbsUp size={16} /> {review.likes}
                  </button>

                  <button
                    onClick={() =>
                      setReviews(reviews.map(r =>
                        r.id === review.id ? { ...r, dislikes: r.dislikes + 1 } : r
                      ))
                    }
                    className="flex items-center gap-1 text-red-500"
                  >
                    <ThumbsDown size={16} /> {review.dislikes}
                  </button>
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {/* ADD REVIEW */}
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium">Rating:</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  className={i <= rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Your Comments:</p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full bg-gray-100 rounded-xl p-4 min-h-[120px] resize-none"
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="mb-2 text-sm text-left w-full font-medium">Name</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-gray-100 w-full rounded-xl p-3"
            />
            <p className="mb-2 text-sm text-left w-full font-medium">Email</p>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-gray-100 w-full rounded-xl p-3"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-[#2B4168] text-white md:w-[197px] w-full px-10 py-3 rounded-lg mt-4 hover:opacity-90"
          >
            Submit
          </button>
        </div>

      </div>
    </section>
  );
}
