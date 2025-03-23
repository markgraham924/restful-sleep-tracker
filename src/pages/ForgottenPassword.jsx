import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import '../styles/forgottenpasswordpage.css';

const ForgottenPassword = ({ closeModal }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    // firebase api
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);
        
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setMessage("Password reset email sent! Please check your inbox.");
                setLoading(false);
                // Clear the form
                setEmail('');
            })
            .catch((error) => {
                setIsError(true);
                setLoading(false);
                switch(error.code) {
                    case 'auth/user-not-found':
                        setMessage('No user found with that email address.');
                        break;
                    case 'auth/invalid-email':
                        setMessage('Please enter a valid email address.');
                        break;
                    default:
                        setMessage('An error occurred. Please try again later.');
                }
            });
    }

    return (
        <div className="modal">
            <div className="modal-content themed-card forgotten-password">
                <h2 className="themed-heading">Forgotten Your Password?</h2>
                <p>Enter your email address below, and we'll send you a link to reset your password.</p>
                <div className='form-group'>
                    <form onSubmit={handleSubmit}>
                        <input
                            className='form-input themed-input'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email address"
                            required
                        />
                        <div className="button-group">
                            <button 
                                className="button button-blue" 
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Reset Password'}
                            </button>
                            <button 
                                className="button button-red" 
                                type="button" 
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                {message && <p className={`message ${isError ? 'error themed-error' : 'success themed-success'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default ForgottenPassword;
