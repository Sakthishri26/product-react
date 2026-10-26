import Header from "./components/Header";
import Banner from "./components/Banner";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";

const products = [
  { id: 1, name: "Laptop", category: "Electronics", price: 50000, qty: 5 },
  { id: 2, name: "Shirt", category: "Cloth", price: 499, qty: 15 },
  { id: 3, name: "Novel Book", category: "Books", price: 350, qty: 12 },
  { id: 4, name: "Lipstick", category: "Beauty", price: 250, qty: 5 }, 
  { id: 5, name: "Cricket bat", category: "Sports", price: 650, qty: 3},
];

function App() {
  return (
    <div className="app">
      <Header />
      <Banner
        title="Welcome to MyShop"
        subtitle="Find the best products at the best prices."
      />

      <section className="products" id="products">
        <h2>Products</h2>
        <div className="product-list">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;