export interface HotTake {
    id?: string; // Firestore document ID
    text: string; // The content of the hot take
    authorId: string; // Firebase user ID
    authorName: string; // Display name (optional for anon)
    timestamp: number; // Unix timestamp
}