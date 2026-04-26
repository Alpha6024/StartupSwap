import { useState, useEffect } from "react";
import axios from "axios";
import SwipeCard from "./SwipeCard";
import MatchModal from "./MatchModal";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SwipeStack({ roleFilter = "", onStarred, endpoint = "feed" }) {
  const [cards, setCards]             = useState([]);
  const [allCards, setAllCards]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => { fetchFeed(); }, [endpoint]);

  useEffect(() => {
    if (!roleFilter) setCards(allCards);
    else setCards(allCards.filter((c) => c.role === roleFilter));
  }, [roleFilter, allCards]);

  const fetchFeed = async (reset = false) => {
    setLoading(true);
    try {
      // On refresh, always use /all so previously passed users reappear
      const url = reset ? `${API}/swipe/all` : `${API}/swipe/${endpoint}`;
      const { data } = await axios.get(url);
      setAllCards(data);
      setCards(data);
    } catch (err) {
      console.error("Feed error:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeRight = async (userId) => {
    setCards((prev) => prev.filter((c) => c._id !== userId));
    setAllCards((prev) => prev.filter((c) => c._id !== userId));
    try {
      const { data } = await axios.post(`${API}/swipe/right/${userId}`);
      if (data.match) setMatchedUser(data.matchedUser);
    } catch (err) {
      console.error("Swipe right error:", err?.response?.data || err.message);
    }
  };

  const handleSwipeLeft = async (userId) => {
    setCards((prev) => prev.filter((c) => c._id !== userId));
    setAllCards((prev) => prev.filter((c) => c._id !== userId));
    try {
      await axios.post(`${API}/swipe/left/${userId}`);
    } catch (err) {
      console.error("Swipe left error:", err?.response?.data || err.message);
    }
  };

  const handleSuperLike = (user) => {
    setCards((prev) => prev.filter((c) => c._id !== user._id));
    setAllCards((prev) => prev.filter((c) => c._id !== user._id));
    onStarred?.(user);
    // Also record as a right swipe on the backend
    axios.post(`${API}/swipe/right/${user._id}`).then(({ data }) => {
      if (data.match) setMatchedUser(data.matchedUser);
    }).catch(console.error);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3" style={{ height: 520 }}>
        <div className="w-14 h-14 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Finding your matches...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 text-center" style={{ height: 520 }}>
        <span className="text-7xl">🎉</span>
        <div>
          <h3 className="text-xl font-black text-slate-700">You've seen everyone!</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
            Check back later as more startup people join the platform.
          </p>
        </div>
        <button
          onClick={() => fetchFeed(true)}
          className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition shadow-md"
        >
          Refresh Feed 🔄
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="relative mx-auto animate-cardEntrance" style={{ height: 520, maxWidth: 380 }}>
        {cards.slice(0, 3).map((card, idx) => {
          const scale      = 1 - idx * 0.03;
          const translateY = idx * 10;
          const isTop      = idx === 0;
          return (
            <div
              key={card._id}
              className="absolute inset-0"
              style={{
                transform:       `scale(${scale}) translateY(${translateY}px)`,
                transformOrigin: "bottom center",
                zIndex:          cards.length - idx,
                transition:      "transform 0.3s ease",
                pointerEvents:   isTop ? "auto" : "none",
              }}
            >
              <SwipeCard
                user={card}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
                onSuperLike={handleSuperLike}
              />
            </div>
          );
        })}
      </div>

      {matchedUser && (
        <MatchModal matchedUser={matchedUser} onClose={() => setMatchedUser(null)} />
      )}
    </>
  );
}
