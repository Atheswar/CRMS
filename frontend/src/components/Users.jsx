import { useState, useEffect } from 'react'
import { getUsersAPI, createUserAPI, deleteUserAPI } from '../api/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({ name: '', email: '', role: 'STAFF' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await getUsersAPI()
      setUsers(response.data)
    } catch (error) {
      setMessage('❌ Error fetching users')
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      setMessage('⚠️ Please fill all fields')
      return
    }
    try {
      await createUserAPI(formData)
      setMessage('✅ User added successfully!')
      setFormData({ name: '', email: '', role: 'STAFF' })
      fetchUsers()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('❌ Error adding user')
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserAPI(id)
        setMessage('✅ User deleted successfully!')
        fetchUsers()
        setTimeout(() => setMessage(''), 3000)
      } catch (error) {
        setMessage('❌ Error deleting user')
        console.error('Error:', error)
      }
    }
  }

  return (
    <div>
      <h2>👥 User Management</h2>
      
      {message && <div className={message.includes('❌') ? 'error' : 'success'}>{message}</div>}
      
      <div className="card">
        <h3>➕ Add New User</h3>
        <form onSubmit={handleAddUser}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter full name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter email address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Staff</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>
          <button type="submit">➕ Add User</button>
        </form>
      </div>

      <div className="card">
        <h3>📋 All Users</h3>
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>No users found. Add one to get started!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleDelete(user.id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}