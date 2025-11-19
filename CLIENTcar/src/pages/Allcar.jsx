import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import API from "../services/api";

// Sample car data - in real-world this would be fetched from backend

export default function Allcars() {
  const [cars, setAllcars] = useState([]);

  const fetchingCars = async () => {
    const res = await API.get("/cardisplay");
    setAllcars(res.data.data);
  };

  useEffect(() => {
    fetchingCars();
  }, []);
  return (
    <>
      {/* All Cars Grid */}
      <div className="container py-5">
        <h2 className="text-center fw-bold text-black mb-4">
          All Available Cars
        </h2>
        <div className="row">
          {cars.map((car) => (
            <div className="col-md-4 mb-4" key={car.id}>
              <div className="card h-100 shadow rounded-4">
                <img
                  src={car.image.url}
                  className="card-img-top rounded-top-4"
                  alt={car.name}
                  style={{ height: "230px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{car.name}</h5>
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
                  <p className="fw-semibold text-success">{car.price}/day</p>
                  <Link
                    to={`/carlist/${car._id}`}
                    className="btn btn-outline-danger rounded-pill mt-auto w-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
