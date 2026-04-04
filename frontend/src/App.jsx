import { useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Landing  from "./pages/Landing";
import Login    from "./pages/Login";
import Register from "./pages/Register";
import Swipe    from "./pages/Swipe";
import Matches  from "./pages/Matches";
import Profile  from "./pages/Profile";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/swipe" replace /> : children;
}

// ── Tiny module-level starred store (no context / Redux needed) ──────────────
let starredStore = [];
const listeners  = new Set();

function useStarred() {
  const [state, setState] = useState(starredStore);

  useState(() => {
    listeners.add(setState);
    return () => listeners.delete(setState);
  });

  const add = useCallback((user) => {
    if (!starredStore.find((u) => u._id === user._id)) {
      starredStore = [...starredStore, user];
      listeners.forEach((fn) => fn(starredStore));
    }
  }, []);

  return [state, add];
}

function SwipeWrapper()   { const [, add] = useStarred(); return <Swipe   onStarred={add} />; }
function MatchesWrapper() { const [s]     = useStarred(); return <Matches starred={s}    />; }

// ── Routes ────────────────────────────────────────────────────────────────────
export const routes = [
  { path: "/",         element: <PublicRoute><Landing /></PublicRoute>  },
  { path: "/login",    element: <PublicRoute><Login /></PublicRoute>    },
  { path: "/register", element: <PublicRoute><Register /></PublicRoute> },
  { path: "/swipe",    element: <PrivateRoute><SwipeWrapper /></PrivateRoute>   },
  { path: "/matches",  element: <PrivateRoute><MatchesWrapper /></PrivateRoute> },
  { path: "/profile",  element: <PrivateRoute><Profile /></PrivateRoute>        },
  { path: "*",         element: <Navigate to="/" replace />             },
];
