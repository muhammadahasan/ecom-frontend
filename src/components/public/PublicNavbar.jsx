// src/components/public/PublicNavbar.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PublicNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredCat, setHoveredCat] = useState(null);

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
    <nav style={{ background: '#333', color: 'white', padding: '1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginRight: '2rem' }}>
          E-Shop
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          {categories.map(cat => (
            <div 
              key={cat._id}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredCat(cat._id)}
              onMouseLeave={() => setHoveredCat(null)}
            >
              <Link to={`/category/${cat.slug}`} style={{ color: 'white', textDecoration: 'none' }}>
                {cat.name}
              </Link>
              
              {/* Level 2 Dropdown */}
              {hoveredCat === cat._id && cat.children?.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: 'white',
                  color: 'black',
                  minWidth: '200px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  zIndex: 1000
                }}>
                  {cat.children.map(sub => (
                    <div key={sub._id} style={{ position: 'relative', padding: '0.5rem' }}>
                      <Link to={`/category/${sub.slug}`} style={{ color: 'black', textDecoration: 'none' }}>
                        {sub.name}
                      </Link>
                      
                      {/* Level 3 dropdown */}
                      {sub.children?.length > 0 && (
                        <div style={{
                          position: 'absolute',
                          left: '100%',
                          top: 0,
                          background: 'white',
                          minWidth: '200px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}>
                          {sub.children.map(productCat => (
                            <Link 
                              key={productCat._id}
                              to={`/category/${productCat.slug}`}
                              style={{ display: 'block', padding: '0.5rem', color: 'black', textDecoration: 'none' }}
                            >
                              {productCat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;