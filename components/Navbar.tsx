"use client";

import { useState, useEffect } from "react";
import { Dancing_Script } from "next/font/google";
import { FaCircleUser } from "react-icons/fa6";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, DB, provider } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

type UserProfile = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: string;
};
const defaultUser: UserProfile = {
  uid: "",
  displayName: "",
  email: "",
  photoURL: "",
  role: "user",
};
export default function Navbar() {
  const { cart } = useCart();
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(cart.length);
  }, [cart]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>(defaultUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const fetchUserData = async () => {
        if (currentUser) {
          try {
            const userRef = doc(DB, "users", currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
              const userData = docSnap.data();
              setUser({
                uid: currentUser.uid,
                displayName: currentUser.displayName || "",
                email: currentUser.email || "",
                photoURL: currentUser.photoURL || "",
                role: userData.role || "user",
              });
            }
          } catch (error) {
            console.error("Error fetching user from Firestore:", error);
          }
        } else {
          setUser(defaultUser);
        }
      };

      fetchUserData();
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch("/api/user/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          token: user.getIdToken,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        setUser({
          uid: data.uid,
          displayName: data.displayName,
          email: data.email,
          photoURL: data.photoURL,
          role: data.role,
        });
        alert("Login successful");
      } else {
        const errorData = await res.json();
        console.error("❌ Backend error:", errorData);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(defaultUser);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    document.body.style.overflowY = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [menuOpen]);

  return (
    <div className="relative w-screen">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full h-[60px] flex justify-between items-center px-4 z-[50] bg-white">
        {/* Logo */}
        <div className={`${dancingScript.className} font-bold text-2xl`}>
          Try me
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-6">
          <li className="cursor-pointer hover:font-semibold">
            {" "}
            <Link href="/">Home</Link>
          </li>
          <li className="cursor-pointer hover:font-semibold">
            {" "}
            <Link href="/products">Products</Link>
          </li>
          <li className="cursor-pointer hover:font-semibold">Contact</li>
          <li className="cursor-pointer hover:font-semibold">About</li>
          {user.role === "admin" ? (
            <>
              <li className="cursor-pointer hover:font-semibold">
                {" "}
                <Link href="/admin/dashboard">Dashboard</Link>
              </li>
            </>
          ) : null}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4 pr-2">
          <span className="cursor-pointer hidden md:inline">
            <Link href="/cart">Cart ({total})</Link>
          </span>
          {user.email !== "" ? (
            <>
              <span
                className="cursor-pointer hidden md:inline"
                onClick={handleLogout}
              >
                Logout
              </span>
              <Link href="/profile">
                <FaCircleUser
                  size={25}
                  className="cursor-pointer hidden md:inline"
                />
              </Link>
            </>
          ) : (
            <span
              className="cursor-pointer hidden md:inline"
              onClick={handleGoogleSignIn}
            >
              Login
            </span>
          )}
          {/* Hamburger menu for mobile */}
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <RxCross1 size={24} /> : <RxHamburgerMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[60px] bg-white left-0 w-full h-screen z-[40] flex flex-col items-start pt-8 pl-8 space-y-6 text-sm border-t border-gray-400">
          {[
            ["Home", "/"],
            ["Contact", "/"],
            ["Profile", "/profile"],
          ].map(([label, path]) => (
            <span
              key={label} // Use the path as the unique key
              className="cursor-pointer hover:font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              <Link href={path}>{label}</Link>
            </span>
          ))}
          <span
            key="products"
            className="cursor-pointer hover:font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            <Link href="/products">Products</Link>
          </span>
          <span
            key="cart" // Use "cart" as the unique key
            className="cursor-pointer hover:font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            <Link href="/cart">Cart ({total})</Link>
          </span>
          {user.role === "admin" && (
            <>
              <span
                key="dashboard" // Use a unique key for the Dashboard link
                className="cursor-pointer hover:font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                <Link href="/admin/dashboard">Dashboard</Link>
              </span>
    
             
            </>
          )}
          {user.email !== "" ? (
            <span
              key="logout" // Use a unique key for Logout
              className="cursor-pointer"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </span>
          ) : (
            <span
              key="login" // Use a unique key for Login
              className="cursor-pointer"
              onClick={() => {
                handleGoogleSignIn();
                setMenuOpen(false);
              }}
            >
              Login
            </span>
          )}
        </div>
      )}
    </div>
  );
}
