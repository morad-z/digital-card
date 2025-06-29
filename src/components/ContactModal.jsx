import React, { useState } from 'react';
import '../styles/DigitalBusinessCard.css';

export default function ContactModal({
  formData,
  onChange,
  onClose,
  onSubmit,
}) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};

    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    // Phone validation (allow empty, or only digits)
    if (formData.phone) {
      if (!/^\d+$/.test(formData.phone)) {
        tempErrors.phone = 'Phone number must contain only digits.';
      }
    }

    setErrors(tempErrors);

    // Return true if no errors
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(e);
    } else {
      console.log('Validation errors:', errors);
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <h2 style={{ marginBottom: '1.5rem' }}>Contact Me</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={onChange}
            required
          />

          <input
            className="input"
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={onChange}
          />
          {errors.phone && (
            <p style={{ color: 'red', marginTop: '-0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {errors.phone}
            </p>
          )}

          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={onChange}
            required
          />
          {errors.email && (
            <p style={{ color: 'red', marginTop: '-0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {errors.email}
            </p>
          )}

          <textarea
            className="input"
            style={{ height: '100px', resize: 'vertical' }}
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={onChange}
            required
          />

          <div className="modal-buttons">
            <button
              type="button"
              className="button cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button"
              style={{ marginLeft: '10px' }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
