import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../../Contexts/ShopContext';
import ProductCard from '../ProductCard/ProductCard';
import './SearchResults.css'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const { all_products } = useContext(ShopContext); // or whatever your product list is called
  const query = useQuery().get("query")?.toLowerCase() || '';

  console.log(all_products);
  

  const filteredProducts = all_products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query) ||
    product.description?.toLowerCase().includes(query)
  );

  return (
    <div className="search-results">
      <h2>Search Results for: "{query}"</h2>
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
