export interface HotTake {
    id?: string;
    text: string;
    author: string;
    timestamp: number;
}

export interface DebateMessage {
    uid: string;
    text: string;
    timestamp: number;
    turn: number;
    upvotes: string[]; // array of user IDs who upvoted this message
}

export interface DebateDoc {
    id: string; // Firestore document ID
    takeId: string;
    challengerId: string;
    opponentId: string | null; // null if no opponent yet
    messages: DebateMessage[];
    active: boolean;
    winnerId?: string | null; // user ID of the winner, null if tie
    createdAt: any; // Firestore timestamp
}

export interface UserStats {
    displayName: string;
    wins: number;
    losses: number;
}