import { useState, useEffect } from 'react';
import axios from 'axios';

// Move ProductModal OUTSIDE the main component
const ProductModal = ({ show, onClose, onSubmit, editingProduct, formData, setFormData }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '500px',
        maxWidth: '90%'
      }}>
        <h3>{editingProduct ? 'Edit Product' : 'Create New Product'}</h3>
        
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{ width: '100%', padding: '8px' }}
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Images (comma separated)</label>
            <input
              type="text"
              value={formData.images}
              onChange={(e) => setFormData({...formData, images: e.target.value})}
              placeholder="image1.jpg, image2.jpg"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              {editingProduct ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Products Component
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  
  // Get categoryId from URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('categoryId');
  const categoryName = urlParams.get('categoryName');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    images: ''
  });

  // Fetch products
  const fetchProducts = async (page = 1) => {
    if (!categoryId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Using the correct port 5000
      const res = await axios.get(
        `http://localhost:5000/api/products/category/${categoryId}?page=${page}&limit=${pagination.limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setProducts(res.data.data || []);
        setPagination(res.data.pagination || {
          page: 1,
          limit: 10,
          total: res.data.data?.length || 0,
          pages: 1
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  // Create/Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: categoryId,
        images: formData.images ? formData.images.split(',').map(i => i.trim()) : []
      };

      if (editingProduct) {
        // Update
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create
        await axios.post(
          'http://localhost:5000/api/products',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', stock: '', description: '', images: '' });
      fetchProducts(pagination.page);
    } catch (err) {
      console.error('Submit error:', err);
      alert('Error saving product');
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts(pagination.page);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting product');
    }
  };

  // Open edit modal
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      stock: product.stock || '',
      description: product.description || '',
      images: product.images ? product.images.join(', ') : ''
    });
    setShowModal(true);
  };

  if (!categoryId) {
    return <div style={{ padding: '20px' }}>No category selected</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Products in {categoryName || 'Category'}</h2>
          <p style={{ color: '#666' }}>Total: {pagination.total} products</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', price: '', stock: '', description: '', images: '' });
            setShowModal(true);
          }}
          style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          + Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div style={{ border: '1px solid #ddd', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Price</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Stock</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No products found</td></tr>
            ) : (
              products.map(product => (
                <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{product.name}</td>
                  <td style={{ padding: '12px' }}>${product.price}</td>
                  <td style={{ padding: '12px' }}>{product.stock}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      background: product.isActive ? '#d4edda' : '#f8d7da',
                      color: product.isActive ? '#155724' : '#721c24',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{ padding: '4px 8px', background: '#ffc107', border: 'none', marginRight: '5px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      style={{ padding: '4px 8px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={() => fetchProducts(pagination.page - 1)}
            disabled={pagination.page === 1}
            style={{ padding: '8px 12px', background: '#f8f9fa', border: '1px solid #ddd', cursor: 'pointer' }}
          >
            Previous
          </button>
          <span style={{ padding: '8px 12px' }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => fetchProducts(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            style={{ padding: '8px 12px', background: '#f8f9fa', border: '1px solid #ddd', cursor: 'pointer' }}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      <ProductModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default Products;