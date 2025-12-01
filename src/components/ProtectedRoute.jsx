import React from "react";
import {
  SignedIn,
  SignedOut,
  SignIn,
  useUser,
  useClerk,
} from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";

const ALLOWED_EMAILS = [
  "kymrhys@gmail.com",
  "daiso202sm@daiso.com.ph",
  "eiframcadnis@gmail.com",
];

export default function ProtectedRoute() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <SignIn />
        </div>
      </SignedOut>
      <SignedIn>
        {user?.primaryEmailAddress?.emailAddress &&
        ALLOWED_EMAILS.includes(user.primaryEmailAddress.emailAddress) ? (
          <Outlet />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Access Denied
              </h1>
              <p className="text-gray-700 mb-6">
                Your email address (
                <span className="font-semibold">
                  {user?.primaryEmailAddress?.emailAddress}
                </span>
                ) is not authorized to access this application.
              </p>
              <button
                onClick={() => signOut()}
                className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        )}
      </SignedIn>
    </>
  );
}
