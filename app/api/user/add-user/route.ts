import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { DB } from "@/lib/firebase";
import { setCookie } from "cookies-next";
export async function POST(req: NextRequest) {
  try {
    const { uid, displayName, email, photoURL, token } = await req.json();

    const userRef = doc(DB, "users", uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Add new user
      await setDoc(userRef, {
        uid,
        displayName,
        email,
        photoURL,
        role: "user",
        createdAt: serverTimestamp(),
      });
      console.log("✅ User added to Firestore");
      setCookie("__session", token, { maxAge: 60 * 60 * 24 * 7 });
      return NextResponse.json({
        uid,
        displayName,
        email,
        photoURL,
        role: "user",
      });
    } else {
      // User already exists
      console.log("👤 User already exists");
      const existingUser = docSnap.data();
      setCookie("__session", token, { maxAge: 60 * 60 * 24 * 7 });
      return NextResponse.json({
        uid: existingUser.uid,
        displayName: existingUser.displayName,
        email: existingUser.email,
        photoURL: existingUser.photoURL,
        role: existingUser.role,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Error setting role:", err);
    return NextResponse.json(
      { error: "Server error", details: message },
      { status: 500 }
    );
  }
}
