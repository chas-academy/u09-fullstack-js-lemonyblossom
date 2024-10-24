import { useEffect, useState } from 'react';
import loaderIcon from '../../src/loading.png';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [loading, setLoading] = useState(false);

  const limit = 10; // Number of users per page

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`https://u09-fullstack-js-lemonyblossom.onrender.com/admin/users?page=${currentPage}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) {
            setUsers(data.users);
            setTotalUsers(data.totalUsers);
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
      setLoading(false);
    };
    fetchUsers();
  }, [currentPage]);

  const updateUserRole = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://u09-fullstack-js-lemonyblossom.onrender.com/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        alert('User role updated successfully');
        setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));  // Update UI
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const blockUser = async (userId, blockStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://u09-fullstack-js-lemonyblossom.onrender.com/admin/users/${userId}/block`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ blocked: blockStatus }),
      });

      if (response.ok) {
        alert(`User ${blockStatus ? 'blocked' : 'unblocked'} successfully`);
        setUsers(users.map(user => user._id === userId ? { ...user, blocked: blockStatus } : user));  // Update UI
      } else {
        alert('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    const originalUsers = [...users]; // Backup original users in case of error

    setUsers(users.filter(user => user._id !== userId));

    try {
      const response = await fetch(`https://u09-fullstack-js-lemonyblossom.onrender.com/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      setUsers(originalUsers);  // Revert to original users on error
      alert('Error deleting user. Please try again.');
    }
  };

  const sortUsers = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  };

  // Pagination handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="admin-dashboard flex flex-col justify-center w-screen max-w-[800px] py-7">
      <h2 className="text-xl font-bold mb-4 text-center">All Users</h2>
      {/* Sorting Dropdown for Mobile */}
      <div className="relative flex flex-row justify-end items-center md:hidden mb-2 rounded:md">
        <label htmlFor="sort" className="font-italic mr-2">Sort by:</label>
        <select
          id="sort"
          className="p-2 border rounded bg-white text-right" // Add text-right here to right-align
          onChange={(e) => sortUsers(e.target.value)}
        >
          <option value="username">Username</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
          <option value="createdAt">Created At</option>
          <option value="blocked">Status</option>
        </select>
      </div>

      {loading ? (
        <div className="LOADER flex items-center justify-center h-screen ">
          <div className="relative flex items-center justify-center w-36 h-36 rounded-full animate-spinSlow">
            <img src={loaderIcon} alt="Loading users..." className="absolute w-24 h-24" /> {/* Customize size */}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          <table className="max-w-screen border-collapse">
            <thead className="bg-white/60 hidden md:table-header-group">
              <tr className='max-w-screen'>
                <th onClick={() => sortUsers('username')} className="md:pl-5 p-2.5 text-left">Username</th>
                <th onClick={() => sortUsers('email')} className="p-2.5 text-left">Email</th>
                <th onClick={() => sortUsers('role')} className="p-2.5 text-left">Role</th>
                <th onClick={() => sortUsers('createdAt')} className="p-2.5 text-left">Created At</th>
                <th onClick={() => sortUsers('blocked')} className="p-2.5 text-left">Status</th>
                {/*                 <th className="p-2.5 text-left">Delete</th>
 */}              </tr>
            </thead>
            <tbody className='mt-5 text-left pl-6'>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="ROW border-b-2 border-white md:table-row flex flex-col md:flex-row bg-white/80 mb-1 p-3"
                >
                  {/* First row: Username, Email, and Role */}
                  <td className="userName md:pl-5 w-full md:w-auto flex justify-between md:justify-center md:table-cell font-semibold ">
                    {/*                     <span className="md:hidden font-semibold">Username: </span>
 */}                    {user.username}
                  </td>
                  <td className="email w-auto flex justify-between md:justify-center md:table-cell">
                    <span className="md:hidden font-md">Email: </span>
                    {user.email}
                  </td>


                  {/* Second row on mobile: Created At, Block, Delete */}
                  <td className="createdAt w-auto md:w-auto flex justify-between md:justify-center md:table-cell">
                    <span className="md:hidden font-md">Created: </span>
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="role w-full md:w-auto flex justify-between md:justify-center md:table-cell">
                    {/*                     <span className="md:hidden font-medium">Role: </span>
 */}                    <select
                      className="border-white border-2 p-1 rounded"
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      value={user.role}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="status  w-full md:w-auto flex flex-row justify-around md:table-cell mt-2">
                    <button
                      onClick={() => blockUser(user._id, !user.blocked)}
                      className="border rounded-lg text-sm"
                    >
                      {user.blocked ? 'Unblock' : 'Block'}
                    </button>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="border rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination my-2 flex justify-center">
            {[...Array(Math.ceil(totalUsers / limit)).keys()].map(page => (
              <button className="page-btn mx-2" key={page} onClick={() => handlePageChange(page + 1)} disabled={currentPage === page + 1}>
                {page + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
