import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin only once
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('__session')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - no token' }, { status: 401 });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();

    if (userData?.role === 'admin') {
      return NextResponse.json({ message: 'Admin access granted' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Forbidden - not an admin' }, { status: 403 });
    }
  } catch (error) {
    console.error('Error checking admin role:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
