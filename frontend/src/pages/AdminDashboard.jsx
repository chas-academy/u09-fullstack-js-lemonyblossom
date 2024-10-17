import { useEffect, useState } from 'react';
import '../styles/form.css';
import '../styles/adminDashboard.css';




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
          const response = await fetch(`http://localhost:5001/admin/users?page=${currentPage}&limit=${limit}`, {
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

  const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    const originalUsers = [...users]; // Backup original users in case of error

    // Optimistic UI update
    setUsers(users.filter(user => user._id !== userId));

    try {
      const response = await fetch(`http://localhost:5001/admin/users/${userId}`, {
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
    <div className="admin-dashboard">
      <h2>Users</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th onClick={() => sortUsers('username')}>Username</th>
                <th onClick={() => sortUsers('email')}>Email</th>
                <th onClick={() => sortUsers('role')}>Role</th>
                <th onClick={() => sortUsers('createdAt')}>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  {/* First row: Username, Email, and Role */}
                  <td className="username" data-label="Username">{user.username}</td>

                  <td className="email" data-label="Email">{user.email}</td>
                  <td className="role" data-label="Role">{user.role}</td>

                  {/* Second row: Created At and Actions */}
                  <td className="createdAt" data-label="Created At">{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="actions" data-label="">
                    <button onClick={() => deleteUser(user._id)} className='delete-user-btn'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            {[...Array(Math.ceil(totalUsers / limit)).keys()].map(page => (
              <button className='page-btn'
                key={page}
                onClick={() => handlePageChange(page + 1)}
                disabled={currentPage === page + 1}
              >
                {page + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
