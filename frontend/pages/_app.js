// frontend/pages/_app.js
import '../styles/styles.css'; // Увери се, че това е пътят към твоя CSS

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
