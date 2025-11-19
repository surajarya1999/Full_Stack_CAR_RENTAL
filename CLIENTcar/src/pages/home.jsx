import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import API from "../services/api";

const Home = () => {
  const [carData, setCarData] = useState([]);
  // console.log(carData)
  const fetchcars = async () => {
    try {
      const res = await API.get("/cardisplay");
      console.log(res);
      setCarData(res.data.data);
    } catch (error) {
      console.log("Error fetching car:", error);
    }
  };

  useEffect(() => {
    fetchcars();
  }, []);

  useEffect(() => {
    const myCarousel = document.querySelector("#heroCarousel");
    if (myCarousel) {
      new window.bootstrap.Carousel(myCarousel, {
        interval: 4000, // 4 sec
        ride: "carousel",
      });
    }
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {/* Slide 1 */}
          <div className="carousel-item active">
            <div
              className="text-white text-center d-flex align-items-center justify-content-center flex-column position-relative"
              style={{
                minHeight: "60vh",
                backgroundImage: "url(/image/a.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              ></div>

              {/* Content */}
              <div className="position-relative">
                <h1 className="display-4 fw-semibold">
                  Experience the Drive of Your Life
                </h1>
                <p className="lead mt-3">Luxury. Performance. Trust.</p>
                <a
                  href="#cars"
                  className="btn btn-warning btn-lg mt-4 px-4 rounded-pill"
                >
                  Book Your Car
                </a>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="carousel-item">
            <div
              className="text-white text-center d-flex align-items-center justify-content-center flex-column position-relative"
              style={{
                minHeight: "60vh",
                backgroundImage: "url(/image/b.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              ></div>

              <div className="position-relative">
                <h1 className="display-4 fw-semibold">
                  Luxury Cars, Affordable Prices
                </h1>
                <p className="lead mt-3">Drive with comfort & style.</p>
                <a
                  href="#cars"
                  className="btn btn-warning btn-lg mt-4 px-4 rounded-pill"
                >
                  Explore Cars
                </a>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="carousel-item">
            <div
              className="text-white text-center d-flex align-items-center justify-content-center flex-column position-relative"
              style={{
                minHeight: "60vh",
                backgroundImage: "url(/image/c.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              ></div>

              <div className="position-relative">
                <h1 className="display-4 fw-semibold">
                  Book Your Dream Ride Today
                </h1>
                <p className="lead mt-3">Fast, Reliable, and Secure Booking.</p>
                <a
                  href="#cars"
                  className="btn btn-warning btn-lg mt-4 px-4 rounded-pill"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Popular Cars */}
      <div className="container py-5" id="cars">
        <h2 className="text-center mb-4 fw-semibold text-danger">
          Our Top Picks
        </h2>
        <div className="row">
          {carData.map((car) => (
            <div className="col-md-4" key={car._id}>
              <div className="card shadow-lg border-0 rounded-4 mb-4">
                <img
                  src={car.image.url}
                  className="card-img-top rounded-top-4"
                  alt={car.name}
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{car.name}</h5>

                  {/* 👇 Description replaced with 3 details */}
                  <div className="d-flex justify-content-between  text mb-3">
                    <span>
                      <strong>Model:</strong> {car.model}
                    </span>
                    <span>
                      <strong>Color:</strong> {car.color}
                    </span>
                    <span>
                      <strong>Fuel:</strong> {car.fuelType}
                    </span>
                  </div>

                  <p className="fw-semibold text-success">₹{car.price}/day</p>
                  <Link
                    to={`/carlist/${car._id}`}
                    className="btn btn-outline-danger w-100 rounded-pill"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-5 bg-light" id="why">
        <div className="container text-center">
          <h2 className="mb-4 fw-bold">Why PrimeDrive?</h2>
          <div className="row">
            <div className="col-md-4">
              <h5 className="text-danger">24/7 Assistance</h5>
              <p>Always ready to support you on the road.</p>
            </div>
            <div className="col-md-4">
              <h5 className="text-danger">Best Value</h5>
              <p>Luxury experience at affordable prices.</p>
            </div>
            <div className="col-md-4">
              <h5 className="text-danger">Wide Selection</h5>
              <p>Choose from hatchbacks, sedans, SUVs and more.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
