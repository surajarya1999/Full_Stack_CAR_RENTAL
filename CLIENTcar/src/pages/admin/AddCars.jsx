import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../services/api";

function AddCars() {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    color: "",
    fuelType: "",
    price: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [editCarId, setEditCarId] = useState(null); // ✅ for update

  // Fetch Cars
  const fetchCars = async () => {
    try {
      const res = await API.get("/cardisplay");
      setCars(res.data.data);
    } catch (err) {
      console.log("Error fetching car:", err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Form Change Handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add Car
  const handleAddCar = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      await API.post("/carinsert", data);
      toast.success("Car added successfully!");
      document.getElementById("closeModalBtn").click();
      setFormData({ name: "", model: "", color: "", fuelType: "", price: "", image: "" });
      fetchCars();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add car!");
    } finally {
      setLoading(false);
    }
  };

  // Delete Car
  const handleDltCar = async (id) => {
    try {
      await API.delete(`/cardelete/${id}`);
      toast.success("Car Deleted Successfully");
      fetchCars();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete Car");
    }
  };

  // Open Edit Modal
  const handleEditCar = (car) => {
    setEditCarId(car._id);
    setFormData({
      name: car.name,
      model: car.model,
      color: car.color,
      fuelType: car.fuelType,
      price: car.price,
      image: "",
    });
    document.getElementById("openEditModalBtn").click();
  };

  // Update Car
  const handleUpdateCar = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("model", formData.model);
      data.append("color", formData.color);
      data.append("fuelType", formData.fuelType);
      data.append("price", formData.price);
      if (formData.image) {
        data.append("image", formData.image);
      }

      await API.put(`/carupdate/${editCarId}`, data);
      toast.success("Car updated successfully!");
      document.getElementById("closeEditModalBtn").click();
      setFormData({
        name: "",
        model: "",
        color: "",
        fuelType: "",
        price: "",
        image: "",
      });
      setEditCarId(null);
      fetchCars();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update car!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer position="top-center" />
      <h2 className="mb-4">Manage Cars</h2>

      {/* Add New Car Button */}
      <button
        className="btn btn-success mb-3"
        data-bs-toggle="modal"
        data-bs-target="#addCarModal"
      >
        + Add New Car
      </button>

      {/* Hidden button to trigger Edit Modal */}
      <button
        id="openEditModalBtn"
        data-bs-toggle="modal"
        data-bs-target="#editCarModal"
        style={{ display: "none" }}
      ></button>

      {/* Car Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Car Name</th>
            <th>Model</th>
            <th>Color</th>
            <th>FuelType</th>
            <th>Price</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(cars) &&
            cars.map((car, index) => (
              <tr key={car._id}>
                <td>{index + 1}</td>
                <td>{car.name}</td>
                <td>{car.model}</td>
                <td>{car.color}</td>
                <td>{car.fuelType}</td>
                <td>₹{car.price}/Day</td>
                <td>
                  {car.image && <img src={car.image.url} alt="" width="80" />}
                </td>
                <td>
                  <button
                    onClick={() => handleEditCar(car)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDltCar(car._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Add Car Modal */}
      <div
        className="modal fade"
        id="addCarModal"
        tabIndex="-1"
        aria-labelledby="addCarModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Car</h5>
              <button
                type="button"
                className="btn-close"
                id="closeModalBtn"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label>Car Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label>Model</label>
                <input
                  className="form-control"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="mb-2">
                <label>Color</label>
                <input
                  className="form-control"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="mb-2">
                <label>FuelType</label>
                <input
                  className="form-control"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="mb-2">
                <label>Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label>Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handleAddCar}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Car"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Car Modal */}
      <div
        className="modal fade"
        id="editCarModal"
        tabIndex="-1"
        aria-labelledby="editCarModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Car</h5>
              <button
                type="button"
                className="btn-close"
                id="closeEditModalBtn"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label>Car Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label>Model</label>
                <input
                  className="form-control"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="mb-2">
                <label>Color</label>
                <input
                  className="form-control"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="mb-2">
                <label>FuelType</label>
                <input
                  className="form-control"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="mb-2">
                <label>Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label>Image (upload new to replace)</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-success"
                onClick={handleUpdateCar}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Car"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCars;
