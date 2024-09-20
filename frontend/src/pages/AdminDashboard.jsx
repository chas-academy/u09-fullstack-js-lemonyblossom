import { useEffect, useState } from 'react';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5001/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) {
            setUsers(data);
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
      } else {
        console.error('Error deleting user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
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

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => sortUsers('username')}>Username</th>
            <th onClick={() => sortUsers('email')}>Email</th>
            <th onClick={() => sortUsers('createdAt')}>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
