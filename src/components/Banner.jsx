function Banner({title,subtitle}) {
  return (
    <section className="banner" id="home">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <button className="banner-btn">Shop Now</button>
    </section>
  );
}

export default Banner;