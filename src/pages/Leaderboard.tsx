import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"), orderBy("wins", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🏆 Leaderboard</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Rank</th>
            <th className="p-2 border">Player</th>
            <th className="p-2 border">Wins</th>
            <th className="p-2 border">Losses</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} className="text-center">
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{u.displayName || "Anonymous"}</td>
              <td className="p-2 border">{u.wins || 0}</td>
              <td className="p-2 border">{u.losses || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;