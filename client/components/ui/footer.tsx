const Footer = () => {
  return (
    <footer className="w-full bg-[#FAF3F0] border-t border-[#E8DCD5] py-6 px-4 text-sm text-gray-600 mt-8">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p>&copy; {new Date().getFullYear()} TtokTtok. All rights reserved.</p>
        <div className="flex flex-wrap gap-4 text-[#A65A3A] font-medium">
          <a href="/about" className="hover:underline">
            About
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
