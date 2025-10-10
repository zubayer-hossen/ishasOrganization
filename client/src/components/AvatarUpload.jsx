// src/components/AvatarUpload.jsx
import { useState } from "react";

const AvatarUpload = ({ onUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {preview && (
        <img
          src={preview}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover"
        />
      )}
      <input type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
};

export default AvatarUpload;
