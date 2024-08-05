import React, { useState } from "react";
import "../../Assets/CSS/home.css";
import CustomCard from "../../components/Card";
import userApis from "../../Apis/userApis";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    const contactData = new FormData();
    contactData.append('name', name);
    contactData.append('email', email);
    contactData.append('message', message);

    try {
      setLoading(true);
      const response = await userApis.contact({name, email, message});
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Successful!",
          text: "Contact message sent successfully.",
          showConfirmButton: false,
          timer: 1500,
        })
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong !",
        showConfirmButton: false,
        timer: 1500,
      })
      console.log("Internal server error", error)
    } finally {
      setLoading(false);
    }
  }

  const handleCardClick = (foodTitle) => {
    navigate(`/menu/${foodTitle}`);
  };

  const foods = [
    {
      title: "Pizza",
      text: "Different Varieties of Pizzas",
      imageUrl:
        "https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg",
    },
    {
      title: "Coffee",
      text: "Different Varieties of Coffees",
      imageUrl:
        "https://insanelygoodrecipes.com/wp-content/uploads/2020/07/Cup-Of-Creamy-Coffee-500x375.png",
    },
    {
      title: "Sandwich",
      text: "Different Varieties of Sandwiches",
      imageUrl:
        "https://www.merisaheli.com/wp-content/uploads/2016/09/main-qimg-2d50153c79d8c5349a3d9dc632f6d6bb-c.jpg",
    },
    {
      title: "Mocktail",
      text: "Different Varieties of Mocktails",
      imageUrl:
        "https://rolandfoods.com/assets/blog/_blogDetail/Instagram-Feed-Post-Template-7.png",
    },
    {
      title: "Garlic Bread",
      text: "Different Varieties of Garlic Breads",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg0cnBSNu5n4tTwAUu-uhtmc8NFm-sQ9c4UA&s",
    },
    {
      title: "Burger",
      text: "Different Varieties of Burgers",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5cwRE4h3vfxnZPndGuyhmrWpgi_lk1w7KNg&s",
    },
    {
      title: "French Fries",
      text: "Different Varieties of French Fries",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-S6BmCEcWmhaWNy8QeBCTttMyOaRmzd6yjw&s",
    },
  ];

  const cooks = [
    {
      name: "Vaidehi Kaliya",
      position: "Master Chef",
      image: require("../../images/cook1.webp"),
    },
    {
      name: "Rakhis Savaliya",
      position: "Junior Chef",
      image: require("../../images/cook2.jpg"),
    },
    {
      name: "Ravi Jaiswal",
      position: "Master Chef",
      image: require("../../images/cook3.webp"),
    },
  ];

  return (
    <>
      <div className="hero-container">
        <img
          src={require("../../images/Cafe-mania.png")}
          alt="head-img"
          className="img-fluid hero-image"
          style={{
            aspectRatio: "16/9",
            objectFit: "cover"
          }}
        />
      </div>

      <div className="container mt-5 mb-5">
        <div className="row mt-3 mb-3 p-4 justify-content-center">
          <h1 className="text-center mt-1 mb-5 hrline title-gradient">Foods</h1>
          <div className="col-md-10 ">
            <div className="row row-cols-md-4 row-cols-1 justify-content-center">
              {foods.map((food, index) => (
                <div className="col mb-2 mt-2" key={index}>
                  <CustomCard
                    title={food.title}
                    text={food.text}
                    imageUrl={food.imageUrl}
                    buttonText="Order Now"
                    onClick={() => handleCardClick(food.title)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row mt-5 mb-3 p-4 justify-content-center">
          <div className="card bg-brown">
            <h1 className="card-title text-white text-center mt-3 mb-3">
              Cafe Ambience
            </h1>
            <div className="row">
              <div className="col-md-6 text-center mt-3 mb-5 justify-content-center d-flex">
                <img
                  src="https://luxebook.in/wp-content/uploads/2022/11/Cafe-Panama-Interior-tequila-lounge-image-min-1-1-scaled.jpg"
                  alt=""
                  width={"400px"}
                  className="img-fluid rounded-2 shadow"
                  style={{
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    border: "10px solid white",
                  }}
                />
              </div>
              <div className="col-md-6 mt-3 mb-5 text-center d-flex align-items-center">
                <blockquote className="blockquote">
                  <p
                    className="mb-4"
                    style={{
                      fontSize: "1.30rem",
                      color: "#fff",
                      letterSpacing: "0.2rem",
                      wordSpacing: "0.5rem",
                      width: "80%",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "#FFA726",
                      }}
                    >
                      &ldquo;{" "}
                    </span>
                    Step into our cozy haven and immerse yourself in the warm
                    and inviting atmosphere of Cafe Mania. From the rustic decor
                    to the soothing aroma of freshly brewed coffee, every detail
                    is designed to make you feel at home. Whether you're
                    catching up with friends or finding a quiet corner to work,
                    our cafe provides the perfect setting.
                    <span
                      style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "#FFA726",
                      }}
                    >
                      {" "}
                      &rdquo;
                    </span>
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5 mb-5 justify-content-center">
          <h1 className="text-center mt-1 mb-5 hrline title-gradient">Chefs</h1>
          <div className="col-md-10">
            <div className="row row-cols-md-3 row-cols-1 p-3">
              {cooks.map((cook, index) => (
                <div className="col" key={index}>
                  <div className="card border-0 shadow ">
                    <img
                      src={cook.image}
                      alt=""
                      className="card-img-top img-fluid rounded-3"
                      style={{
                        aspectRatio: "3/4",
                        objectFit: "cover",
                      }}
                    />
                    <div className="card-body text-center">
                      <h3 className="card-title">{cook.name}</h3>
                      <p className="card-text">{cook.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row mt-5 mb-5 justify-content-center bg-brown">
          <h1 className="text-center mt-5 mb-5 hrline text-white">Contact Us</h1>
          <div className="col-md-10">
            <div className="row">
              <div className="col-md-6  mb-4">
                <iframe
                  title="Cafe Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.017020769745!2d144.95592631571616!3d-37.81720997975137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df0f12f67%3A0x5045675218ce6e0!2sCafe!5e0!3m2!1sen!2sau!4v1634530989481!5m2!1sen!2sau"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
              <div className="col-md-6 mb-4">
                <p className="text-center mb-4 text-white">
                  Contact us using the form below or book a table at our cafe.
                </p>
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="input-container">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder=" "
                    />
                    <label className="form-label" htmlFor="name">
                      Name
                    </label>
                  </div>
                  <div className="input-container">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder=" "
                    />
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                  </div>
                  <div className="input-container">
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="3"
                      required
                      placeholder=" "
                    ></textarea>
                    <label className="form-label" htmlFor="message">
                      Message
                    </label>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-warning">
                      {loading ? (
                        <BeatLoader
                          color="#FFFFFF"
                          loading={loading}
                          size={8}
                        />
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="mt-3 p-5">
              <ul>
                <li className="text-start mb-4 text-light">
                  Welcome to Cafe Mania! We are thrilled to serve you with our
                  delicious food and beverages in a cozy atmosphere. Whether you're
                  looking for a quick bite or a place to relax and unwind, our cafe
                  is the perfect spot for you.
                </li>
                <li className="text-start mb-4 text-light">
                  Feel free to contact us using the form below for any inquiries,
                  feedback, or reservation requests. Our team will be happy to
                  assist you. You can also book a table at our cafe by filling out
                  the form or giving us a call.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
