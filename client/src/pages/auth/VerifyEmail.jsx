// src/pages/auth/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token))
        .unwrap()
        .then((res) => {
          setSuccess(true);
          toast.success("✅ Email verified successfully!");
        })
        .catch((err) => {
          setSuccess(false);
          toast.error(err || "❌ Email verification failed!");
        });
    }
  }, [dispatch, token]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-6">Email Verification</h2>

        {loading && <p className="text-blue-500">🔄 Verifying...</p>}
        {error && <p className="text-red-500">❌ {error}</p>}
        {success && !loading && !error && (
          <p className="text-green-600">✅ Your email has been verified!</p>
        )}

        <Link to="/login" className="block mt-5 text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
