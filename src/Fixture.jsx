import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import FAB from "./components/FAB";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import SkeletonLoader from "./components/SkeletonLoader";
import Footer from "./components/Footer";

export default function Fixture() {
  const { label } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const API_URL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    // ... (fetch logic remains same)
    setLoading(true);
    fetch(`https://opensheet.elk.sh/${API_URL}/Master`)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((item) => item.FIXTURE === label);
        const mappedProducts = filteredData.map((item, index) => ({
          id: index,
          name: item.DESCRITION,
          sku: item.SKU,
          upc: item.UPC,
          price: parseFloat(item.PRICE),
          quantity: parseInt(item.QTY),
          department: item.DEPARTMENT,
          fixture: item.FIXTURE,
          status:
            parseInt(item.QTY) > 10
              ? "green"
              : parseInt(item.QTY) > 0
              ? "yellow"
              : "red",
          image: `https://jpbulk.daisonet.com/cdn/shop/products/${item.UPC}_10_700x.jpg`,
        }));
        setProducts(mappedProducts.reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [label]);

  const filteredProducts = products
    .filter((product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.upc.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortOrder === "price-asc") {
        return a.price - b.price;
      } else if (sortOrder === "price-desc") {
        return b.price - a.price;
      } else if (sortOrder === "quantity-asc") {
        return a.quantity - b.quantity;
      } else if (sortOrder === "quantity-desc") {
        return b.quantity - a.quantity;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      <Header
        headerText="FIXTURE"
        title={label}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <div className="px-4 pt-4 md:px-10   lg:px-96 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Product List */}
        <main className="space-y-3">
          {loading ? (
            <>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={selectedProduct?.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))
          )}
        </main>
      </div>

      {/* Floating Action Button */}
      <FAB defaultFixture={label} />

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <Footer />
    </div>
  );
}
