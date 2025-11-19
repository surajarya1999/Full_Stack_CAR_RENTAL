import React from 'react';
import { Link } from 'react-router-dom';


function Footer() {
    return (
        <footer className="bg-black text-white pt-5 pb-4 mt-auto">
            <div className="container">
                <div className="row text-center text-md-start">
                    {/* Left - Logo and tagline */}
                    <div className="col-md-4 mb-4">
                        <Link className="navbar-brand fw-bold fs-3" to="/">🚗 PrimeDrive</Link>
                        
                        <p className="mt-3">
                            PrimeDrive - Learn | Practice | Grow
                        </p>
                    </div>

                    {/* Center - Navigation menu */}
                    <div className="col-md-4 mb-4">
                        <h5 className="fw-bold mb-3">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
                            <li><Link to="/cars" className="text-white text-decoration-none">Cars</Link></li>
                            <li><Link to="/login" className="text-white text-decoration-none">Login</Link></li>
                            {/* <li><Link to="/mybookings" className="text-white text-decoration-none">My Bookings</Link></li> */}
                        </ul>
                    </div>

                    {/* Right - Contact or Social */}
                    <div className="col-md-4 mb-4">
                        <h5 className="fw-bold mb-3">Contact Us</h5>
                        <p className="mb-1"><i className="bi bi-envelope-fill me-2"></i> info@PrimeDrive.com</p>
                        <p><i className="bi bi-telephone-fill me-2"></i> +91 8000080000</p>
                    </div>
                </div>

                <hr className="border-light" />
                <p className="text-center mb-0">&copy; 2025 PrimeDrive. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;