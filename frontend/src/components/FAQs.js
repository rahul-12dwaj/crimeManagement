import React, { useState } from 'react';

const FAQ = () => {
  const [faqs, setFaqs] = useState([
    {
      question: 'What is the purpose of this platform?',
      answer: 'This platform is designed to provide emergency services and support for individuals in need.',
    },
    {
      question: 'How can I request emergency help?',
      answer: 'You can request emergency help by filling out the emergency request form on our platform.',
    },
    {
      question: 'What services do you offer?',
      answer: 'We offer ambulance services, fire department assistance, and police support.',
    },
    {
      question: 'Is this service available 24/7?',
      answer: 'Yes, our emergency services are available 24/7.',
    },
  ]);

  const [userQuestion, setUserQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');

  const handleUserQuestionChange = (e) => {
    setUserQuestion(e.target.value);
  };

  const handleUserAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userQuestion || !userAnswer) {
      setError('Please fill in both question and answer.');
      return;
    }

    const newFAQ = {
      question: userQuestion,
      answer: userAnswer,
    };

    setFaqs([...faqs, newFAQ]);
    setUserQuestion('');
    setUserAnswer('');
    setError('');
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* FAQ Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 mt-2">Here are the most common questions and answers. Feel free to ask your own question!</p>
        </header>

        {/* FAQ List */}
        <section className="mb-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-blue-600">{faq.question}</h3>
                <p className="text-lg text-gray-700 mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* User Submitted Question Form */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-600">Ask Your Own Question</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-4">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="mb-4">
              <label className="block text-lg text-gray-700" htmlFor="userQuestion">Your Question</label>
              <input
                type="text"
                id="userQuestion"
                name="userQuestion"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your question"
                value={userQuestion}
                onChange={handleUserQuestionChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg text-gray-700" htmlFor="userAnswer">Your Answer</label>
              <textarea
                id="userAnswer"
                name="userAnswer"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide an answer to your question"
                value={userAnswer}
                onChange={handleUserAnswerChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Your Question
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default FAQ;
