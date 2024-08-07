import React from "react";
import '../HomeCss/Footer.css'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
function Footer(){
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <h3>About Us</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec justo rutrum, commodo ex nec, tempor magna.</p>
                            <div className="social-icons">
                                <a href="#"><FaFacebookF /></a>
                                <a href="#"><FaTwitter /></a>
                                <a href="#"><FaInstagram /></a>
                                <a href="#"><FaLinkedinIn /></a>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <h3>Quick Links</h3>
                            <ul className="list-unstyled">
                                <li><a href="#">Home</a></li>
                                <li><a href="#">About</a></li>
                                <li><a href="#">Services</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <h3>Contact Us</h3>
                            <p>123 Street, City, Country</p>
                            <p>Email: info@example.com</p>
                            <p>Phone: +123 456 7890</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <p>© 2024 Your Company. All Rights Reserved | Designed by Your Name</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer