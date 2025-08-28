import React from 'react';
import { FaStar } from 'react-icons/fa';

interface TestimonialCardProps {
  name: string;
  review: string;
  rating: number;
  avatar?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, review, rating, avatar }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="card-luxe p-4 h-100" style={{ minHeight: '250px' }}>
      <div className="d-flex align-items-center mb-3">
        {avatar ? (
          <img 
            src={avatar} 
            alt={name} 
            className="rounded-circle me-3" 
            width="50" 
            height="50" 
          />
        ) : (
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center me-3" 
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: 'var(--accent)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            {initials}
          </div>
        )}
        <div>
          <h6 className="mb-0 fw-bold">{name}</h6>
          <div className="d-flex mt-1">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={i < rating ? 'text-warning' : 'text-secondary'} 
                style={{ fontSize: '0.9rem' }}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-secondary mb-0">"{review}"</p>
    </div>
  );
};

export default TestimonialCard;
