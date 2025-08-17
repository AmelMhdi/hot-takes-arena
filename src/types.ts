export interface HotTake {
    id?: string; // Firestore document ID
    text: string;
    authorId: string;
    authorName: string;
    timestamp: number;
}