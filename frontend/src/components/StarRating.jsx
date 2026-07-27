import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, count, size = 14 }) => (
  <div className="flex items-center gap-1">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(rating) ? 'fill-gold text-gold' : 'fill-transparent text-ink/20'}
        />
      ))}
    </div>
    {count !== undefined && <span className="text-xs text-ink-soft">({count})</span>}
  </div>
);

export default StarRating;
