import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, auth } from "../firebase";

interface UserDoc {
  id: string;
  displayName?: string;
  photoURL?: string;
  wins: number;
  losses: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(
        collection(db, "users"),
        orderBy("wins", "desc"),
        orderBy("losses", "asc")
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as UserDoc)
      );
      setUsers(list);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 font-bold text-charcoal-900">Leaderboard</h1>
      <div className="overflow-hidden rounded-lg border border-sage-200 bg-cream-50">
        <table className="w-full">
          <thead className="bg-sage-100">
            <tr>
              <th className="p-3 text-left font-semibold text-charcoal-800 border-b border-sage-200">Rank</th>
              <th className="p-3 text-left font-semibold text-charcoal-800 border-b border-sage-200">Player</th>
              <th className="p-3 text-left font-semibold text-charcoal-800 border-b border-sage-200">Wins</th>
              <th className="p-3 text-left font-semibold text-charcoal-800 border-b border-sage-200">Losses</th>
              <th className="p-3 text-left font-semibold text-charcoal-800 border-b border-sage-200">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const total = (u.wins || 0) + (u.losses || 0);
              const winRate = total > 0 ? Math.round((u.wins / total) * 100) : 0;

              return (
                <tr
                  key={u.id}
                  className={`hover:bg-cream-100 transition-colors ${
                    u.id === currentUid ? "bg-sage-50 font-bold" : ""
                  }`}
                >
                  <td className="p-3 text-charcoal-700 border-b border-stone-200">{i + 1}</td>
                  <td className="p-3 text-charcoal-800 flex items-center gap-2 border-b border-stone-200">
                    {u.photoURL && (
                      <img
                        src={u.photoURL}
                        alt={u.displayName || "Player"}
                        className="h-6 w-6 rounded-full"
                      />
                    )}
                    {u.displayName || "Anonymous"}
                  </td>
                  <td className="p-3 text-sage-600 font-semibold border-b border-stone-200">{u.wins || 0}</td>
                  <td className="p-3 text-stone-500 border-b border-stone-200">{u.losses || 0}</td>
                  <td className="p-3 text-charcoal-700 border-b border-stone-200">{winRate}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;