import { Link } from 'react-router-dom';
import type { Stall } from '../api/types';

export function StallCard({ stall }: { stall: Stall }) {
  return (
    <Link to={`/stalls/${stall.id}`} className="card stall-card">
      <div className="stall-card-top">
        {stall.category && <span className="tag">{stall.category}</span>}
        {stall.isPopular && <span className="tag tag-accent">Populer</span>}
      </div>
      <h3>{stall.name}</h3>
      <p className="muted">{stall.location ?? 'Lokasi belum diisi'}</p>
      <div className="rating">
        <strong>★ {stall.avgRating.toFixed(1)}</strong>
        <span className="muted">({stall.reviewCount} ulasan)</span>
      </div>
    </Link>
  );
}
