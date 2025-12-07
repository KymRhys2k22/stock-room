/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { Grid, List } from "lucide-react";

import FAB from "./components/FAB";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";
import ImageGridView from "./components/ImageGridView";
import ProductModal from "./components/ProductModal";
import SkeletonLoader from "./components/SkeletonLoader";
import Footer from "./components/Footer";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [viewMode, setViewMode] = useState("grid");

  const API_URL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    setLoading(true);
    fetch(`https://opensheet.elk.sh/${API_URL}/Master`)
      .then((response) => response.json())
      .then((data) => {
        const mappedProducts = data
          .filter((item) => item.UPC && item.DESCRITION) // Filter out empty rows
          .map((item, index) => ({
            id: index,
            name: item.DESCRITION,
            sku: item.SKU,
            upc: item.UPC,
            price: parseFloat(item.PRICE),
            quantity: parseInt(item.QTY),
            department: item.DEPARTMENT,
            fixture: item.FIXTURE,
            box: item.BOX,
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
  }, [API_URL]);

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
      } else if (sortOrder === "quantity-asc") {
        return a.quantity - b.quantity;
      } else if (sortOrder === "quantity-desc") {
        return b.quantity - a.quantity;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 pb-24">
      <Header
        title="Daiso Japan Stock Room Management System"
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <div className="px-4 pt-4 md:px-10 lg:px-96 space-y-4">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search..."
            />
          </div>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
            title={
              viewMode === "grid"
                ? "Switch to List View"
                : "Switch to Grid View"
            }>
            {viewMode === "grid" ? (
              <List className="w-5 h-5 text-slate-900 dark:text-gray-100" />
            ) : (
              <Grid className="w-5 h-5 text-slate-900 dark:text-gray-100" />
            )}
          </button>
        </div>

        {/* Product List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 gap-3 lg:grid-cols-3 "
              : "space-y-3"
          }>
          {loading ? (
            <>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </>
          ) : viewMode === "grid" ? (
            filteredProducts.map((product) => (
              <ImageGridView
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))
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
      <Footer />
    </div>
  );
}
