// src/components/UsersTable.tsx

import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '@/api/api';  // ✅ correct import
import { User } from '@/types/User';

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      console.log("Fetched Users:", data);  // 👀 see what comes
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id); // ✅ use exported function
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Account Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
  {users.map((user) => (
    <tr key={user.id} className="border-t">
      <td className="p-2">{user.id}</td>
      <td className="p-2">{user.username}</td>
      <td className="p-2">{user.email}</td>
      <td className="p-2">{user.role}</td>
      <td className="p-2">{user.enabled ? 'Active' : 'Inactive'}</td>
      <td className="p-2">
        <button
          onClick={() => handleDeleteUser(user.id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default UsersTable;
