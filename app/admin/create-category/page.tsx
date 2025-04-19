'use client';

import { useAdminCheck } from "@/hook/useAdminCheck";


export default function SomeAdminPage() {
  const isAdmin = useAdminCheck();

  if (isAdmin === null) {
    return <div className='mt-20'>Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mt-20">
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <h1>Admin Page</h1>
      {/* Admin-specific content */}
    </div>
  );
}
