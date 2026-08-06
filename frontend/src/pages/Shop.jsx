import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';
import seedProducts from '../data/seedProducts';
import { fetchJson } from '../api';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await fetchJson('/api/products');
                setProducts(Array.isArray(data) && data.length ? data : seedProducts);
            } catch (error) {
                console.error('Product API failed:', error);
                setProducts(seedProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="shop-page">
            <section className="hero-banner">
                <h1>Shop the latest picks</h1>
                <p>Discover premium essentials, everyday favorites, and curated deals for every corner of your life.</p>
            </section>

            <div style={{ maxWidth: '1200px', margin: '20px auto', color: '#a1a1aa' }}>
                <strong>Products found:</strong> {products.length}
            </div>

            {loading ? (
                <p className="loading-state">Loading products...</p>
            ) : (
                <div className="shop-search-container">
                    {products.length > 0 ? (
                        <div className="product-grid">
                            {products.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">No products available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Shop;
