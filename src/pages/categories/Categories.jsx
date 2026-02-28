import { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Three separate forms
  const [mainForm, setMainForm] = useState({ name: '' });
  const [subForm, setSubForm] = useState({ name: '', parent: '' });
  const [productCatForm, setProductCatForm] = useState({ name: '', parent: '' });

  // Fetch categories tree
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/categories/tree', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setCategories([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create MAIN category (Level 1)
  const handleCreateMain = async (e) => {
    e.preventDefault();
    if (!mainForm.name.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/categories/createCategory', 
        { name: mainForm.name, parent: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMainForm({ name: '' });
      fetchCategories();
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  // Create SUB category (Level 2)
  const handleCreateSub = async (e) => {
    e.preventDefault();
    if (!subForm.name.trim() || !subForm.parent) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/categories/createCategory', 
        { name: subForm.name, parent: subForm.parent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubForm({ name: '', parent: '' });
      fetchCategories();
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  // Create PRODUCT category (Level 3)
  const handleCreateProductCat = async (e) => {
    e.preventDefault();
    if (!productCatForm.name.trim() || !productCatForm.parent) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/categories/createCategory', 
        { name: productCatForm.name, parent: productCatForm.parent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProductCatForm({ name: '', parent: '' });
      fetchCategories();
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  // Update category
  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/categories/categories/${id}`, 
        { name: editingId.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? This will also delete all sub-categories!')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/categories/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Get all Level 1 categories (for sub category dropdown)
  const levelOneCategories = categories.map(cat => ({
    _id: cat._id,
    name: cat.name
  }));

  // Get all Level 2 categories (for product category dropdown)
  const levelTwoCategories = categories.flatMap(cat => 
    (cat.children || []).map(sub => ({
      _id: sub._id,
      name: `${cat.name} → ${sub.name}`
    }))
  );

  const renderCategoryRow = (cat, level = 0) => (
    <div key={cat._id}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        padding: '8px', 
        borderBottom: '1px solid #eee',
        marginLeft: level * 20,
        backgroundColor: level === 2 ? '#f9f9f9' : 'transparent'
      }}>
        <span style={{ minWidth: '250px' }}>
          {'—'.repeat(level)} {cat.name} 
          <span style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginLeft: '8px',
            backgroundColor: level === 0 ? '#e3f2fd' : level === 1 ? '#fff3e0' : '#e8f5e8',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {level === 0 ? 'Main' : level === 1 ? 'Sub' : 'Product Category'}
          </span>
        </span>
        
        {editingId?._id === cat._id ? (
          <>
            <input
              type="text"
              value={editingId.name}
              onChange={(e) => setEditingId({ ...editingId, name: e.target.value })}
              style={{ padding: '4px' }}
            />
            <button onClick={() => handleUpdate(cat._id)}>Save</button>
            <button onClick={() => setEditingId(null)}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditingId({ _id: cat._id, name: cat.name })}>
              Edit
            </button>
            <button onClick={() => handleDelete(cat._id)}>Delete</button>
            
            {/* View Products Button - Only for Level 3 categories */}
            {level === 2 && (
              <button
                onClick={() => {
                  window.location.href = `/products?categoryId=${cat._id}&categoryName=${encodeURIComponent(cat.name)}`;
                }}
                style={{
                  padding: '4px 8px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginLeft: '5px'
                }}
              >
                View Products
              </button>
            )}
          </>
        )}
      </div>
      
      {cat.children?.map(child => renderCategoryRow(child, level + 1))}
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Category Management</h2>
      
      {/* Three Forms Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        {/* Form 1: Main Category */}
        <div style={{ border: '1px solid #ddd', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <h3 style={{ marginTop: 0, color: '#1976d2' }}>Step 1: Main Category</h3>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
            Top level (Men, Women, Kids)
          </p>
          <form onSubmit={handleCreateMain} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="e.g., Men"
              value={mainForm.name}
              onChange={(e) => setMainForm({ name: e.target.value })}
              required
              style={{ padding: '8px' }}
            />
            <button type="submit" style={{ 
              padding: '10px', 
              background: '#1976d2', 
              color: 'white', 
              border: 'none',
              cursor: 'pointer'
            }}>
              Create Main Category
            </button>
          </form>
        </div>

        {/* Form 2: Sub Category */}
        <div style={{ border: '1px solid #ddd', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <h3 style={{ marginTop: 0, color: '#ed6c02' }}>Step 2: Sub Category</h3>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
            Under Main (Clothing, Shoes)
          </p>
          <form onSubmit={handleCreateSub} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <select
              value={subForm.parent}
              onChange={(e) => setSubForm({ ...subForm, parent: e.target.value })}
              required
              style={{ padding: '8px' }}
            >
              <option value="">Select Main Category</option>
              {levelOneCategories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="e.g., Shirts"
              value={subForm.name}
              onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
              required
              style={{ padding: '8px' }}
            />
            
            <button type="submit" style={{ 
              padding: '10px', 
              background: '#ed6c02', 
              color: 'white', 
              border: 'none',
              cursor: 'pointer'
            }}>
              Create Sub Category
            </button>
          </form>
        </div>

        {/* Form 3: Product Category */}
        <div style={{ border: '1px solid #ddd', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <h3 style={{ marginTop: 0, color: '#2e7d32' }}>Step 3: Product Category</h3>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
            Where products live (Casual Shirts, Formal Shirts)
          </p>
          <form onSubmit={handleCreateProductCat} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <select
              value={productCatForm.parent}
              onChange={(e) => setProductCatForm({ ...productCatForm, parent: e.target.value })}
              required
              style={{ padding: '8px' }}
            >
              <option value="">Select Sub Category</option>
              {levelTwoCategories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="e.g., Casual Shirts"
              value={productCatForm.name}
              onChange={(e) => setProductCatForm({ ...productCatForm, name: e.target.value })}
              required
              style={{ padding: '8px' }}
            />
            
            <button type="submit" style={{ 
              padding: '10px', 
              background: '#2e7d32', 
              color: 'white', 
              border: 'none',
              cursor: 'pointer'
            }}>
              Create Product Category
            </button>
          </form>
        </div>
      </div>

      {/* Categories List */}
      <div style={{ border: '1px solid #ddd', padding: '15px' }}>
        <h3>Categories Tree</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {categories.length === 0 ? (
              <p>No categories yet. Start with Step 1 above.</p>
            ) : (
              categories.map(cat => renderCategoryRow(cat))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;