import React, { useState } from 'react';

const Emergency = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: '',
    serviceType: 'ambulance',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    // Basic form validation
    if (!formData.name || !formData.contact || !formData.message) {
      setError('Please fill in all the required fields.');
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      setSuccessMessage('Emergency request submitted successfully.');
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Emergency Services</h1>
          <p className="text-lg text-gray-600 mt-2">Immediate assistance for your urgent needs</p>
        </header>

        {/* Emergency Contact Information Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-600">Emergency Contacts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-medium">Ambulance</h3>
              <p className="text-lg text-gray-700 mt-2">Call us in case of medical emergencies</p>
              <p className="text-2xl font-bold text-red-500">+91-123-456-789</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-medium">Fire Department</h3>
              <p className="text-lg text-gray-700 mt-2">For fire emergencies</p>
              <p className="text-2xl font-bold text-yellow-500">+91-987-654-321</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-medium">Police</h3>
              <p className="text-lg text-gray-700 mt-2">For law enforcement assistance</p>
              <p className="text-2xl font-bold text-blue-500">+91-555-123-456</p>
            </div>
          </div>
        </section>

        {/* Emergency Services Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-600">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-medium">Ambulance Service</h3>
              <p className="text-lg text-gray-700 mt-2">Available 24/7 for emergency medical transport</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-medium">Fire Response</h3>
              <p className="text-lg text-gray-700 mt-2">Professional fire response teams at your service</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-medium">Law Enforcement</h3>
              <p className="text-lg text-gray-700 mt-2">Emergency law enforcement assistance for security and safety</p>
            </div>
          </div>
        </section>

        

        {/* Contact Information Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-600">Contact Us</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg text-gray-700">For any queries or support, feel free to reach out to us.</p>
            <div className="mt-4">
              <p className="text-lg text-gray-700">
                <span>123 Emergency Lane, City, State, 12345</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Emergency;
