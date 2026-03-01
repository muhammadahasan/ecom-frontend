import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories/tree');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 2rem',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to E-Shop</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Your one-stop shop for everything</p>
      </div>

      {/* Categories Section */}
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Shop by Category</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {categories.map(cat => (
          <div key={cat._id} style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}>
            <div style={{
              background: '#f5f5f5',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '3rem' }}>🛍️</span>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{cat.name}</h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                {cat.children?.length || 0} subcategories
              </p>
              <Link 
                to={`/category/${cat.slug}`}
                style={{
                  background: '#007bff',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}
              >
                Shop Now →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;