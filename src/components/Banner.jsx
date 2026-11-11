function Banner({ title, subtitle }) {
  return (
    <section
      id="home"
      className="flex flex-col items-center gap-4 bg-sky-100 px-5 py-20 text-center"
    >
      <h1 className="text-3xl font-bold md:text-5xl">{title}</h1>
      <p className="text-base text-gray-700 md:text-xl">{subtitle}</p>
      <button className="rounded-md bg-blue-600 px-7 py-3 text-lg text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
        Shop Now
      </button>
    </section>
  );
}

export default Banner;