import React from 'react';
import { Link } from 'react-router-dom';

const InfoPage = ({ title, description, ctaText, ctaLink }) => {
    return (
        <div className="info-card">
            <h2>{title}</h2>
            <p>{description}</p>
            {ctaText && ctaLink && (
                <Link to={ctaLink} className="btn">
                    {ctaText}
                </Link>
            )}
        </div>
    );
};

export default InfoPage;
