import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import FAB from "./components/FAB";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import SkeletonLoader from "./components/SkeletonLoader";
import CloudinaryImageUploader from "./components/CloudinaryImageUploader";

import Filter from "./components/Filter";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://opensheet.elk.sh/1sZuuC4o44rh-yRYaeeRFRo4HeOhMj6x6y4ux96D5nok/Master"
    )
      .then((response) => response.json())
      .then((data) => {
        const mappedProducts = data.map((item, index) => ({
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
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.upc.toLowerCase().includes(query) ||
        (product.fixture && product.fixture.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      if (sortOrder === "price-asc") {
        return a.price - b.price;
      } else if (sortOrder === "price-desc") {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24">
      <Header title="Stock Room Management System" />

      <div className="px-4 pt-4 md:px-96 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search..."
            />
          </div>
          <Filter sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>

        {/* Product List */}
        <div className="space-y-3">
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
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <FAB />

      {/* Product Details Modal */}
      <ProductModal
        key={selectedProduct?.id}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
