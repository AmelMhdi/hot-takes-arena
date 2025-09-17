import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import type { UserDoc } from "@/types";

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<UserDoc[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"), orderBy("wins", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          displayName: data.displayName || "Anonymous",
          wins: typeof data.wins === "number" ? data.wins : 0,
          losses: typeof data.losses === "number" ? data.losses : 0,
        } as UserDoc;
      });
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
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className="hover:bg-cream-100 transition-colors">
                <td className="p-3 text-charcoal-700 border-b border-stone-200">{i + 1}</td>
                <td className="p-3 text-charcoal-800 font-medium border-b border-stone-200">{u.displayName || "Anonymous"}</td>
                <td className="p-3 text-sage-600 font-semibold border-b border-stone-200">{u.wins || 0}</td>
                <td className="p-3 text-stone-500 border-b border-stone-200">{u.losses || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;