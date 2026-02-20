import React, { useState, useEffect } from 'react';
import { resourceApi } from '../api/api';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'CLASSROOM',
    capacity: '',
    status: 'AVAILABLE',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await resourceApi.getAll();
      setResources(response.data);
    } catch (err) {
      setError('Failed to fetch resources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource({ ...newResource, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resourceData = {
        ...newResource,
        capacity: parseInt(newResource.capacity),
      };
      
      if (editingId) {
        await resourceApi.update(editingId, resourceData);
        setEditingId(null);
      } else {
        await resourceApi.create(resourceData);
      }
      
      setNewResource({
        name: '',
        type: 'CLASSROOM',
        capacity: '',
        status: 'AVAILABLE',
      });
      fetchResources();
      setError('');
    } catch (err) {
      setError('Failed to save resource');
      console.error(err);
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
    setNewResource({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity.toString(),
      status: resource.status,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourceApi.delete(id);
        fetchResources();
      } catch (err) {
        setError('Failed to delete resource');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewResource({
      name: '',
      type: 'CLASSROOM',
      capacity: '',
      status: 'AVAILABLE',
    });
  };

  return (
    <div className="section">
      <h2>Resources</h2>
      
      <form onSubmit={handleSubmit} className="form">
        <h3>{editingId ? 'Edit Resource' : 'Add New Resource'}</h3>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Resource Name"
            value={newResource.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <select name="type" value={newResource.type} onChange={handleInputChange}>
            <option value="CLASSROOM">Classroom</option>
            <option value="LAB">Lab</option>
            <option value="EVENT_HALL">Event Hall</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={newResource.capacity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <select name="status" value={newResource.status} onChange={handleInputChange}>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Resource' : 'Add Resource'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <div className="error">{error}</div>}
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td>{resource.id}</td>
                <td>{resource.name}</td>
                <td>{resource.type}</td>
                <td>{resource.capacity}</td>
                <td>{resource.status}</td>
                <td>
                  <button className="btn btn-small" onClick={() => handleEdit(resource)}>
                    Edit
                  </button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(resource.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Resources;
