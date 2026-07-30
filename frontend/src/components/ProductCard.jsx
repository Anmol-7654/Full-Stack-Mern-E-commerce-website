import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/product.css';

const ProductCard = ({ product }) => {
    const productId = product._id || product.id;
    const price = Number(product.price || 0).toFixed(2);
    const rating = Number(product.rating || 0).toFixed(1);
    const stock = Number(product.stock || 0);
    const imageSrc = product.imageUrl || 'https://via.placeholder.com/600x400?text=Product+Image';

    return (
        <div className="product-card">
            <div className="product-badge">{product.category || 'Featured'}</div>
            <img src={imageSrc} alt={product.name} className="product-image" />
            <div className="product-info">
                <div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">
                        {product.description || 'Freshly added product from the store collection.'}
                    </p>
                    <div className="product-meta">
                        <span className="product-rating">★ {rating}</span>
                        <span className="product-stock">{stock > 0 ? `${stock} in stock` : 'Out of stock'}</span>
                    </div>
                    <p className="product-price">${price}</p>
                </div>
                <Link to={`/product/${productId}`} className="view-details-button">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;