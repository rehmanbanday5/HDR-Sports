import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container-HDR py-32 text-center">
    <p className="font-mono text-willow-dark text-sm mb-3">404</p>
    <h1 className="font-display text-3xl font-bold mb-4">This page has been bowled out</h1>
    <p className="text-ink-soft mb-8">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary inline-flex">Back to Home</Link>
  </div>
);

export default NotFound;
