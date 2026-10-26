function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="contact">
      <div className="contact">
        <p>Email: custom@smartmart.com</p>
        <p>Phone: +91 98756 42608</p>
        <p>Address: Madurai, Tamil Nadu</p>
      </div>
      <p className="copyright">© {year} Smartmart. All rights reserved.</p>
    </footer>
  );
}

export default Footer;