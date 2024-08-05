import React, { useEffect, useRef, useState } from "react";
import { Navbar, Nav, Container, Dropdown, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../Assets/CSS/navbar.css";
import { FaShoppingCart } from "react-icons/fa";
import userApis from "../Apis/userApis";

const CustomNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [cartItems, setCartItems] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      setIsLoggedIn(true);
      fetchCartItems();

      setInterval(() => {
        fetchCartItems();
      }, 3000);
    }
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await userApis.getProfile();
        setUserImage(
          `${process.env.REACT_APP_baseUrl}${response.data.user.image}`
        );
      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  const fetchCartItems = async () => {
    try {
      const response = await userApis.getCart();
      const cartData = response.data;
      const uniqueProductsCount = cartData.products.length;
      setCartItems(uniqueProductsCount);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        sticky="top"
        className="custom-navbar"
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            Cafe Mania
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Nav.Link as={Link} to="/" title="Home">
                Home
              </Nav.Link>
              {isLoggedIn && (
                <Nav.Link as={Link} to="/menu" title="Menu">
                  Menu
                </Nav.Link>
              )}
              <NavDropdown title="Pages" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to={"/events"}>
                  Events
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={"/gallery"}>
                  Gallery
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/about" title="About">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" title="Contact">
                Contact
              </Nav.Link>
              {isLoggedIn ? (
                <>
                  <Nav.Link as={Link} to="/cart" className="position-relative">
                    <FaShoppingCart className="fs-3" title="Cart" />
                    {cartItems > 0 && (
                      <span className="cart-badge">{cartItems}</span>
                    )}
                  </Nav.Link>
                  <Dropdown align="end" show={showDropdown} ref={dropdownRef}>
                    <Dropdown.Toggle
                      as={Nav.Link}
                      variant="link"
                      id="dropdown-user"
                      onClick={handleDropdownToggle}
                    >
                      <img
                        src={userImage}
                        alt="..."
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50px",
                          aspectRatio: "1/1",
                          objectFit: "cover",
                        }}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/profile">
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/orders">
                        Orders
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout}>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default CustomNavbar;
