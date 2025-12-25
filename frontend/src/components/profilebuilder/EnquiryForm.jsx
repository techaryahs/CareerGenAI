import { useState } from "react";

function EnquiryForm({ profileType }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log('Submitting enquiry:', { email, message, profileType });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");
  console.log('Submitting enquiry:', { email, message, profileType });
    try {
      const response = await fetch('http://localhost:5001/api/enquiry', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, profileType }),
      });

      if (response.ok) {
        setStatus("Thank you! Your request has been received.");
        setEmail("");
        setMessage("");
      } else {
        setStatus("Unable to send request. Please try again.");
      }
    } catch (error) {
      setStatus("Connection error. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSuccess = status.includes("Thank you");
  const isError = status && !isSuccess;

  return (
    <form onSubmit={handleSubmit} className="enquiry-form-modern">
      <div className="form-field">
        <label htmlFor="email" className="form-label-modern">
          Email Address <span className="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          className="form-input-modern"
          placeholder="your.email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="message" className="form-label-modern">
          Additional Details <span className="optional">(optional)</span>
        </label>
        <textarea
          id="message"
          className="form-textarea-modern"
          placeholder="Briefly describe your current profile status and goals..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className={`submit-btn ${isLoading ? "loading" : ""} ${isSuccess ? "success" : ""}`}
        disabled={isLoading || isSuccess}
      >
        {isSuccess ? (
          <>
            <span className="checkmark">✓</span>
            Sent Successfully
          </>
        ) : isLoading ? (
          <>
            <span className="spinner"></span>
            Sending...
          </>
        ) : (
          "Submit"
        )}
      </button>

      {status && (
        <div className={`status-message ${isSuccess ? "success" : "error"}`}>
          {status}
        </div>
      )}
    </form>
  );
}

export default EnquiryForm;
