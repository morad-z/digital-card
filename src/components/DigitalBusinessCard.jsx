import React, { useState } from 'react';
import profilePic from '../assets/profile.jpg';
import QR from '../assets/qr-code.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLinkedin } from 'react-icons/fa';
import ContactModal from './ContactModal';
import '../styles/DigitalBusinessCard.css';
import { API_URL, API_KEY } from '../constants';


export default function DigitalBusinessCard() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
          body: JSON.stringify(formData),
        });
      

      if (res.ok) {
        toast.success('Form submitted successfully!');
        setShowModal(false);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          message: '',
        });
      } else {
        toast.error('Failed to submit form!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error submitting form!');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="page">
        <div className="card">
          <img
            src={profilePic}
            alt="Profile"
            className="avatar"
          />
          <h2 className="name">Morad Zubidat</h2>
          <p className="subtitle">Software Engineer</p>

          <h3 className="section-title">Resume</h3>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
            download
          >
            Download CV
          </a>
          <br />
          <button
            className="button"
            onClick={() => setShowModal(true)}
          >
            Contact Me
          </button>

          <hr style={{ margin: '2rem 0', borderColor: '#eee' }} />

          <a
            href="https://www.linkedin.com/in/morad-zubedat/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',color:'#0077b5'}}>
              <FaLinkedin
                style={{
                  color: '#0077b5',
                  fontSize: '1.5rem',
                }}
              />
              LinkedIn
            </h3>
          </a>

          <img
            src={QR}
            alt="LinkedIn QR Code"
            className="qr"
          />
          <p className="qr-caption">SCAN ME 👆🏻</p>
        </div>
      </div>

      {showModal && (
        <ContactModal
          formData={formData}
          onChange={handleChange}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
