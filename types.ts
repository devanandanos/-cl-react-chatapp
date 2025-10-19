import { User as FirebaseUser } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

// FIX: Changed interface extension to a type alias to correctly resolve properties on the User type.
export type User = FirebaseUser;

export interface Room {
  id: string;
  name: string;
  createdAt: Timestamp;
}

export interface Message {
  id: string;
  text: string;
  createdAt: Timestamp;
  uid: string;
  displayName: string;
  photoURL: string | null;
}
