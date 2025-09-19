// frontend/pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome to Recipes App</h1>
      <p>
        <Link href="/upload">Go to Upload Page</Link>
      </p>
    </div>
  );
}
