function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div className="space-y-1">
          <p>Email: custom@smartmart.com</p>
          <p>Phone: +91 98756 42608</p>
          <p>Address: Madurai, Tamil Nadu</p>
        </div>
        <p>© {year} Smartmart. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;