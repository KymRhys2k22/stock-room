import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Menu, Filter, Search, Plus, X } from "lucide-react";

export default function Fixture() {
  const { label } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("https://sheetdb.io/api/v1/5zln5s6q75lim")
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
          status:
            parseInt(item.QTY) > 10
              ? "green"
              : parseInt(item.QTY) > 0
              ? "yellow"
              : "red",
          image: `https://jpbulk.daisonet.com/cdn/shop/products/${item.SKU}_10_700x.jpg`,
        }));
        setProducts(mappedProducts);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "red":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-96">
      {/* Header */}
      <header className="flex lg:px-96 items-center justify-between px-4 py-4 bg-gray-50 sticky top-0 z-10">
        <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white">
          <div className="w-4 h-0.5 bg-white mb-1"></div>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Stock Room</h1>
        <Filter className="w-6 h-6 text-slate-900" />
      </header>

      <div className="px-4 pt-4 lg:px-96 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-white shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by name, SKU, or UPC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Product List */}
        <div className="space-y-3">
          {loading ? (
            // Skeleton Loading Item
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse"></div>
                </div>
                <div className="w-16 h-6 bg-gray-100 rounded animate-pulse"></div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                <div className="h-4 bg-gray-100 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex gap-4">
                  <div
                    className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => setSelectedProduct(product)}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/600x400?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-medium text-slate-900 truncate pr-2">
                        {product.name}
                      </h3>
                      <span className="text-lg font-bold text-slate-900">
                        ₱{product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-0.5 mt-0.5">
                      <p className="font-medium text-blue-600">
                        {product.department}
                      </p>
                      <p>SKU: {product.sku}</p>
                      <p>UPC: {product.upc}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">
                    Quantity:
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${getStatusColor(
                        product.status
                      )}`}></div>
                    <span className="text-sm font-bold text-slate-900">
                      {product.quantity} pcs
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}>
          <div
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white/50 rounded-full p-1 transition-colors z-10"
              onClick={() => setSelectedProduct(null)}>
              <X className="w-6 h-6" />
            </button>

            <div className="h-64 bg-gray-100 flex items-center justify-center relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-contain mix-blend-multiply p-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x400?text=No+Image";
                }}
              />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  {selectedProduct.name}
                </h2>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ₱{selectedProduct.price.toFixed(2)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    SKU
                  </p>
                  <p className="text-base font-medium text-slate-900">
                    {selectedProduct.sku}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    UPC
                  </p>
                  <p className="text-base font-medium text-slate-900">
                    {selectedProduct.upc}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Department
                  </p>
                  <p className="text-base font-medium text-blue-600">
                    {selectedProduct.department}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Stock Status
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(
                        selectedProduct.status
                      )}`}></div>
                    <span className="text-base font-medium text-slate-900 capitalize">
                      {selectedProduct.status === "green"
                        ? "In Stock"
                        : selectedProduct.status === "yellow"
                        ? "Low Stock"
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Quantity
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {selectedProduct.quantity} pcs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
