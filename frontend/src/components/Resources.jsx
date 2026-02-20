import { useState, useEffect } from 'react'
import { getResourcesAPI, createResourceAPI, deleteResourceAPI } from '../api/api'

export default function Resources() {
  const [resources, setResources] = useState([])
  const [formData, setFormData] = useState({ name: '', type: 'CLASSROOM', capacity: 0 })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    setLoading(true)
    try {
      const response = await getResourcesAPI()
      setResources(response.data)
    } catch (error) {
      setMessage('❌ Error fetching resources')
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const handleAddResource = async (e) => {
    e.preventDefault()
    if (!formData.name || formData.capacity <= 0) {
      setMessage('⚠️ Please fill all fields correctly')
      return
    }
    try {
      await createResourceAPI(formData)
      setMessage('✅ Resource added successfully!')
      setFormData({ name: '', type: 'CLASSROOM', capacity: 0 })
      fetchResources()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('❌ Error adding resource')
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResourceAPI(id)
        setMessage('✅ Resource deleted successfully!')
        fetchResources()
        setTimeout(() => setMessage(''), 3000)
      } catch (error) {
        setMessage('❌ Error deleting resource')
        console.error('Error:', error)
      }
    }
  }

  return (
    <div>
      <h2>🏛️ Resource Management</h2>
      
      {message && <div className={message.includes('❌') ? 'error' : 'success'}>{message}</div>}
      
      <div className="card">
        <h3>➕ Add New Resource</h3>
        <form onSubmit={handleAddResource}>
          <div className="form-group">
            <label>Resource Name</label>
            <input 
              type="text" 
              placeholder="Enter resource name (e.g., Conference Room A)" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <label>Resource Type</label>
            <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
              <option value="CLASSROOM">Classroom</option>
              <option value="LAB">Lab</option>
              <option value="EVENT_HALL">Event Hall</option>
            </select>
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input 
              type="number" 
              placeholder="Enter capacity (e.g., 30)" 
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
              required 
            />
          </div>
          <button type="submit">➕ Add Resource</button>
        </form>
      </div>

      <div className="card">
        <h3>📋 All Resources</h3>
        {loading ? (
          <div className="loading">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="empty-state">
            <p>No resources found. Add one to get started!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(resource => (
                <tr key={resource.id}>
                  <td>{resource.id}</td>
                  <td>{resource.name}</td>
                  <td>{resource.type}</td>
                  <td>{resource.capacity}</td>
                  <td>{resource.status}</td>
                  <td>
                    <button onClick={() => handleDelete(resource.id)}>🗑️ Delete</button>
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