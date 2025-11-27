import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import FAB from "./components/FAB";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import SkeletonLoader from "./components/SkeletonLoader";

export default function Fixture() {
  const { label } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://opensheet.elk.sh/1sZuuC4o44rh-yRYaeeRFRo4HeOhMj6x6y4ux96D5nok/Master"
    )
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

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.upc.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-96">
      <Header headerText="FIXTURE" title={label} />

      <div className="px-4 pt-4 lg:px-96 space-y-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by name, SKU, or UPC..."
        />

        {/* Product List */}
        <main className="space-y-3">
          {loading ? (
            <SkeletonLoader />
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))
          )}
        </main>
      </div>

      {/* Floating Action Button */}
      <FAB />

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
