import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import userApis from '../../Apis/userApis';
import { FaMinus, FaPlus } from 'react-icons/fa';

const Menu = () => {
  const { pName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [subcategories, setSubcategories] = useState([]);
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProductsAndCart = async () => {
      try {
        const [productsResponse, cartResponse] = await Promise.all([
          userApis.getProducts(),
          userApis.getCart()
        ]);

        const productsData = productsResponse.data.Products;
        const cartData = cartResponse.data;

        setProducts(productsData);
        setFilteredProducts(productsData);

        const uniqueSubcategories = Array.from(new Set(productsData.map(product => product.subcategory)));
        setSubcategories(['All', ...uniqueSubcategories]);

        const cartObj = cartData.products.reduce((acc, item) => {
          acc[item.product._id] = item.quantity;
          return acc;
        }, {});
        setCart(cartObj);

        if (pName) {
          const filteredByName = productsData.filter(product =>
            product.name.toLowerCase().includes(pName.toLowerCase())
          );
          setFilteredProducts(filteredByName);
          const matchingSubcategory = productsData.find(product => product.name.toLowerCase().includes(pName.toLowerCase()))?.subcategory;
          setSelectedCategory(matchingSubcategory || 'All');
        } else {
          if (productsData.length > 0) {
            setSelectedCategory('All');
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProductsAndCart();
  }, [pName]);

  const handleCategoryClick = (subcategory) => {
    setSelectedCategory(subcategory);
    if (subcategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.subcategory === subcategory));
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const updatedCart = { ...cart };
      if (updatedCart[productId]) {
        updatedCart[productId]++;
        await userApis.updateCart({ id: 'userCartId', productId, quantity: 1 });
      } else {
        updatedCart[productId] = 1;
        await userApis.addToCart({ productId, quantity: 1 });
      }
      setCart(updatedCart);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const updatedCart = { ...cart };
      if (updatedCart[productId] > 0) {
        updatedCart[productId]--;
        await userApis.updateCart({ id: 'userCartId', productId, quantity: -1 });
        if (updatedCart[productId] === 0) {
          delete updatedCart[productId];
        }
        setCart(updatedCart);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/menu/product/${productId}`);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(value) ||
        product.description.toLowerCase().includes(value)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row mb-5 g-3">
        <h1 className="text-center title-gradient mb-4">Menu</h1>
        <div className="col-md-3">
          <div className="card p-3 bg-brown">
            <input
              type="text"
              className="form-control mb-3 px-1 bg-light rounded-2"
              placeholder="Search items..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <hr style={{ color: "#ccc" }} />
            <ul className="list-group" id='custom'>
              {subcategories.map((subcategory, index) => (
                <li
                  key={index}
                  className={`list-group-item shadow-sm ${selectedCategory === subcategory ? 'active mt-1' : ''}`}
                  onClick={() => handleCategoryClick(subcategory)}
                >
                  {subcategory}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-9">
          <div className="row row-cols-md-4 row-cols-1 g-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div className="col" key={index}>
                  <div
                    className="card h-100 m-2 shadow"
                    onClick={() => handleCardClick(product._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={`${process.env.REACT_APP_baseUrl}${product.image}`}
                      alt={product.name}
                      className="card-img-top"
                      style={{
                        aspectRatio: '3/3',
                        objectFit: 'cover'
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.category}</p>
                      <StarRatings
                        rating={product.averageRating}
                        starRatedColor="#f39c12"
                        starEmptyColor="gray"
                        numberOfStars={5}
                        starDimension="20px"
                        starSpacing="2px"
                      />
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="card-text">
                            <b>{product.price} ₹</b>
                          </p>
                          {cart[product._id] ? (
                            <div className="d-flex align-items-center">
                              <button
                                className="btn btn-sm btn-brown"
                                onClick={(e) => { e.stopPropagation(); handleRemoveFromCart(product._id); }}
                              >
                                <FaMinus/>                              </button>
                              <span className="mx-2">{cart[product._id]}</span>
                              <button
                                className="btn btn-sm btn-brown"
                                onClick={(e) => { e.stopPropagation(); handleAddToCart(product._id); }}
                              >
                                <FaPlus/>
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-sm btn-brown"
                              onClick={(e) => { e.stopPropagation(); handleAddToCart(product._id); }}
                            >
                              Add +
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-md-12 justify-content-center">
                <div className="alert alert-warning text-center" role="alert">
                  No products available in this category.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
