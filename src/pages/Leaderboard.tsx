import React, { useEffect, useState } from "react";
import { getTopUsers } from "../firebase";
import type { UserStats } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Leaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<UserStats[]>([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      const data = await getTopUsers();
      setLeaders(data);
    };
    fetchLeaders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaders.map((user, index) => (
              <div
                key={user.uid}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                {/* Rank + Avatar */}
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-gray-600">
                    #{index + 1}
                  </div>
                  <Avatar>
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.username}</span>
                </div>
                {/* Stats */}
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    {user.wins} Wins
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.upvotes} Upvotes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;