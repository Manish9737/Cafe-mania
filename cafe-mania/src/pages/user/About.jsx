import React from "react";
import "../../Assets/CSS/About.css";

const About = () => {
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
      <div className="position-relative">
        <img
          src={require("../../images/cafe.jpg")}
          alt="about"
          className="img-fluid w-100 h-50"
          style={{
            minHeight: "60vh",
            aspectRatio: "16/3",
            objectFit: "cover",
            filter: "brightness(50%)",
          }}
        />
        <div className="position-absolute top-50 start-50 translate-middle text-center ">
          <h1
            className="text-white text-lg text-sm text-xs responsive-text animate__animated animate__fadeInDown"
            style={{ fontSize: "60px", fontFamily: "satisfya" }}
          >
            About Us
          </h1>
          <p className="text-white mt-4 animate__animated animate__fadeInDown">
            We are a team dedicated to providing the best services to our
            customers.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="row mb-3">
          <div className="col-md-12">
            <div className="row mt-5 mb-5 justify-content-center">
              <h1 className="text-center mt-1 mb-5 section-title">Meet Our Chefs</h1>
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
        </div>

        <div className="row justify-content-center">
          <div className="col-md-10">
            <h2 className="text-center mb-3 section-title">Our Story</h2>
            <p className="text-center section-text">
              Welcome to Cafe Mania, where passion meets flavor! Our story began with a simple idea - to create a space where people can come together to enjoy great food, good company, and a warm atmosphere.
            </p>
            <p className="text-center section-text">
              Our chefs, Vaidehi, Rakhis, and Ravi, are the heart and soul of our cafe. With years of experience and a passion for cooking, they create dishes that are not only delicious but also visually stunning.
            </p>
            <p className="text-center section-text">
              At Cafe Mania, we're committed to using only the freshest ingredients, sourced locally whenever possible, to create menus that are both innovative and traditional. From classic breakfast dishes to artisanal sandwiches and decadent desserts, there's something for everyone at our cafe.
            </p>
          </div>
        </div>

        <div className="row justify-content-center mb-5">
          <div className="col-md-10">
            <h2 className="text-center mb-3 section-title">Our Mission</h2>
            <p className="text-center section-text">
              Our mission is to provide a warm and welcoming space where our customers can relax, socialize, and enjoy great food and drinks. We strive to create a sense of community, where everyone feels at home.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;