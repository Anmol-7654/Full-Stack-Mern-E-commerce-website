import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';
import seedProducts from '../data/seedProducts';
import { fetchJson } from '../api';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search')?.trim().toLowerCase() || '';

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

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;

        return products.filter((product) => {
            const name = String(product.name || '').toLowerCase();
            const category = String(product.category || '').toLowerCase();
            const description = String(product.description || '').toLowerCase();

            return name.includes(searchQuery) || category.includes(searchQuery) || description.includes(searchQuery);
        });
    }, [products, searchQuery]);

    return (
        <div className="shop-page">
            <section className="hero-banner">
                <h1>Shop the latest picks</h1>
                <p>Discover premium essentials, everyday favorites, and curated deals for every corner of your life.</p>
            </section>

            <div style={{ maxWidth: '1200px', margin: '20px auto', color: '#a1a1aa' }}>
                <strong>Products found:</strong> {filteredProducts.length}
                {searchQuery ? <span style={{ marginLeft: '12px' }}>for “{searchQuery}”</span> : null}
            </div>

            {loading ? (
                <p className="loading-state">Loading products...</p>
            ) : (
                <div className="shop-search-container">
                    {searchQuery ? (
                        <p style={{ color: '#a1a1aa', marginBottom: '16px' }}>
                            Showing results for “{searchQuery}”.
                        </p>
                    ) : null}
                    {filteredProducts.length > 0 ? (
                        <div className="product-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">No products match your search.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Shop;
