"use client";

import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirebaseWebApp } from "@/contexts/shared/firebase/web-app";

let storage: FirebaseStorage | undefined;

/** Firebase Storage for the browser (singleton). */
export function getFirebaseWebStorage(): FirebaseStorage {
  if (typeof window === "undefined") {
    throw new Error("Firebase Storage is browser-only.");
  }
  if (!storage) {
    storage = getStorage(getFirebaseWebApp());
  }
  return storage;
}
