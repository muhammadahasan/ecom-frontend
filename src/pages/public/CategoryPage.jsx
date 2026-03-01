import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [slug]);

  const fetchCategoryAndProducts = async () => {
    setLoading(true);
    try {
      // First, get all categories to find the one matching slug
      const catRes = await axios.get('http://localhost:5000/api/categories/tree');
      const allCats = catRes.data.data || [];
      
      // Find category by slug (simple search)
      let foundCat = null;
      const searchCategory = (cats) => {
        for (let cat of cats) {
          if (cat.slug === slug) {
            foundCat = cat;
            return true;
          }
          if (cat.children?.length) {
            if (searchCategory(cat.children)) return true;
          }
        }
        return false;
      };
      searchCategory(allCats);
      
      setCategory(foundCat);

      // Then fetch products for this category
      if (foundCat) {
        const token = localStorage.getItem('token');
        const prodRes = await axios.get(
          `http://localhost:5000/api/products/category/${foundCat._id}?limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(prodRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setProducts([]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Category not found</h2>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '2rem', color: '#666' }}>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span>{category.name}</span>
      </div>

      {/* Category Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{category.name}</h1>
        <p style={{ color: '#666' }}>{products.length} products found</p>
      </div>

      {/* Subcategories (if any) */}
      {category.children?.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Subcategories</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {category.children.map(sub => (
              <Link
                key={sub._id}
                to={`/category/${sub.slug}`}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f0f0f0',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  color: '#333'
                }}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#f9f9f9', borderRadius: '8px' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>No products found in this category.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {products.map(product => (
            <div key={product._id} style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}>
              <div style={{
                background: '#f5f5f5',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={product.images?.[0] || 'https://via.placeholder.com/200'} 
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{product.name}</h3>
                <p style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#007bff',
                  margin: '0 0 1rem 0'
                }}>
                  ${product.price}
                </p>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;