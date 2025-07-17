import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Crée une commande dans Firestore
export async function createOrder({
  userId,
  items,
  total,
  firstName,
  address,
  phone,
}: {
  userId?: string | null;
  items: any[];
  total: number;
  firstName: string;
  address: string;
  phone: string;
}): Promise<string> {
  const order = {
    userId,
    items,
    total,
    firstName,
    address,
    phone,
    createdAt: Timestamp.now(),
    status: "En cours", // tu peux aussi faire évoluer le statut plus tard
  };

  const docRef = await addDoc(collection(db, "orders"), order);
  return docRef.id; // retourne l'ID de la commande créée
}
