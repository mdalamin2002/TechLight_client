import React from 'react';
import TanStackTable from './components/TanStackTable';

const AllUsers = () => {
 
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <p className="text-sm text-gray-500">
          Manage users, roles, and permissions across your platform.
        </p>
      </div>

      <TanStackTable></TanStackTable>
    </div>
  );
};

export default AllUsers;