// components/Footer.js
export default function Footer() {
  const startYear = 2025; // година на създаване
  const currentYear = new Date().getFullYear();
  const author = "Ангел Лазаров";

  const displayYear = startYear === currentYear ? `${currentYear}` : `${startYear}–${currentYear}`;

  return (
    <footer style={{
      position: 'sticky',
      bottom: 0,
      width: '100%',
      textAlign: 'center',
      padding: '15px 0',
      backgroundColor: '#f9f9f9',
      borderTop: '1px solid #ccc',
      fontSize: '0.9rem',
      color: '#555'
    }}>
      © {displayYear} {author}. Направено с много търпение и псувни!
    </footer>
  );
}
