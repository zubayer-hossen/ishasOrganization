// src/components/common/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-12 text-center">
      <p>&copy; {new Date().getFullYear()} ISHAS. All rights reserved.</p>
      <p>Contact: info@ishas.org | Phone: +880123456789</p>
    </footer>
  );
}
