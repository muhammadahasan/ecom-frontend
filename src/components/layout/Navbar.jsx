import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories/tree');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Main navbar row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <ShoppingBag size={28} color="#3b82f6" />
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>E-Shop</span>
          </a>

          {/* Desktop Categories */}
          <div style={{ display: 'none', gap: '24px', '@media (min-width: 768px)': { display: 'flex' } }}>
            {!loading && categories.map(cat => (
              <div
                key={cat._id}
                style={{ position: 'relative' }}
                onMouseEnter={() => setActiveDropdown(cat._id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: activeDropdown === cat._id ? '#3b82f6' : '#4b5563',
                  cursor: 'pointer',
                  padding: '8px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {cat.name}
                  {cat.children?.length > 0 && <ChevronDown size={16} />}
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === cat._id && cat.children?.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: 'white',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    padding: '16px',
                    minWidth: '600px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    zIndex: 100
                  }}>
                    {cat.children.map(sub => (
                      <div key={sub._id}>
                        <a
                          href={`/category/${sub._id}`}
                          style={{
                            fontWeight: '600',
                            color: '#1f2937',
                            textDecoration: 'none',
                            display: 'block',
                            marginBottom: '8px'
                          }}
                        >
                          {sub.name}
                        </a>
                        {sub.children?.map(level3 => (
                          <a
                            key={level3._id}
                            href={`/category/${level3._id}`}
                            style={{
                              display: 'block',
                              padding: '4px 0',
                              color: '#6b7280',
                              textDecoration: 'none',
                              fontSize: '14px'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
                            onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                          >
                            {level3.name}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/cart" style={{ color: '#4b5563', textDecoration: 'none' }}>Cart (0)</a>
            <a href="/auth" style={{
              background: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none'
            }}>
              Sign In
            </a>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'block',
                '@media (min-width: 768px)': { display: 'none' },
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            padding: '20px 0',
            borderTop: '1px solid #e5e7eb'
          }}>
            {!loading && categories.map(cat => (
              <div key={cat._id} style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>{cat.name}</div>
                {cat.children?.map(sub => (
                  <div key={sub._id} style={{ marginLeft: '12px', marginBottom: '8px' }}>
                    <a href={`/category/${sub._id}`} style={{ color: '#4b5563', textDecoration: 'none' }}>
                      {sub.name}
                    </a>
                    <div style={{ marginLeft: '12px', marginTop: '4px' }}>
                      {sub.children?.map(level3 => (
                        <a
                          key={level3._id}
                          href={`/category/${level3._id}`}
                          style={{ display: 'block', fontSize: '14px', color: '#6b7280', padding: '2px 0' }}
                        >
                          {level3.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;