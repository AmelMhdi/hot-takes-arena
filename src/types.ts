// Hot take
export interface HotTake {
  id: string;
  text: string;
  authorId: string; // Firebase UID 
  authorName: string; // display name or "Anonymous"
  timestamp: number;
  votes: number;
}

// Debate message inside a debate room
export interface DebateMessage {
  userId: string;
  text: string;
  timestamp: number;
  turn: number;
  upvotes: string[]; // array of userIds who upvoted
}

// Debate document in Firestore
export type DebateDoc = {
  id?: string;
  takeId: string;
  challengerId: string;
  opponentId: string | null;
  messages: DebateMessage[];
  active: boolean;
  createdAt?: any;
  winnerId?: string | null;
};

// Debate session
export interface Debate {
  id: string;
  topic: string;
  status: "waiting" | "active" | "finished";
  messages: DebateMessage[];
  votes: Record<string, number>; // key: userId, value: votes count
  createdAt: number;
  endsAt: number;
}

// User statistics
export interface UserStats {
  uid: string;
  username: string;
  wins: number;
  losses: number;
  upvotes: number;
}