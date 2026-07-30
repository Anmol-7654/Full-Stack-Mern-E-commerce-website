import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import seedProducts from '../data/seedProducts';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error('Failed to load products');
                }
                const data = await response.json();
                const products = Array.isArray(data) && data.length ? data : seedProducts;
                setFeaturedProducts(products.slice(0, 6));
            } catch (error) {
                console.error(error);
                setFeaturedProducts(seedProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="home-page">
            <section className="home-hero">
                <div className="hero-content">
                    <p className="hero-badge">New Season • Fresh Picks</p>
                    <h1>Shop smart, style boldly.</h1>
                    <p className="hero-text">
                        Discover premium essentials, everyday favorites, and trending deals in one beautiful store.
                    </p>
                    <div className="hero-actions">
                        <Link to="/shop" className="btn">Start Shopping</Link>
                        <Link to="/about" className="btn btn-secondary">Explore More</Link>
                    </div>
                </div>
            </section>

            <section className="featured-section">
                <div className="section-heading">
                    <h2>Featured products</h2>
                    <Link to="/shop" className="text-link">View all</Link>
                </div>
                {loading ? (
                    <p className="loading-state">Loading products...</p>
                ) : featuredProducts.length > 0 ? (
                    <div className="product-grid">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">No products available right now.</p>
                )}
            </section>
        </div>
    );
};

export default Home;
