import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { CalendarIcon, Trash2 } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import Input from "./Input.jsx";
import InputModified from "./ModifiedComponents/InputModified/InputModified";
import ModifiedButton from "./ModifiedComponents/ModifiedButtons/ModifiedButton.jsx";
import ModifiedContainer from "./ModifiedComponents/ModifiedContainer/ModifiedContainer.jsx";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/authSlice.js";

function BioComponent() {
  const Url = import.meta.env.VITE_API_URL;
  const [bioText, setBioText] = useState("");
  const [selectedDate, setSelectdDate] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newPlaform, setNewPlatform] = useState("");
  const [platformUrl, setPlatformUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [counrty, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();
  const userID = useSelector((state) => state.auth?.userData?._id);
  const dispatch = useDispatch();

  const handleGender = (e) => setGender(e.target.value);
  const handleCity = (e) => setCity(e.target.value);
  const handleCountry = (e) => setCountry(e.target.value);
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const DeleteParticularLink = (link) => {
    setSocialLinks(socialLinks.filter((el) => el !== link));
  };

  const handleAddLinkButton = () => {
    if (newPlaform && platformUrl) {
      setSocialLinks((prev) => [...prev, { platform: newPlaform, url: platformUrl }]);
      setNewPlatform("");
      setPlatformUrl("");
    } else {
      alert("Both platform and URL are required.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("bioText", bioText);
      formData.append("dateOfBirth", selectedDate);
      formData.append("gender", gender);
      formData.append("bannerImage", selectedFile);
      formData.append("country", counrty);
      formData.append("city", city);

      socialLinks.forEach((link, index) => {
        formData.append(`socialLinks[${index}][platform]`, link.platform);
        formData.append(`socialLinks[${index}][url]`, link.url);
      });

      const response = await axios.post(`${Url}/auth/moreInfo_bio/${userID}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response) {
        dispatch(login({ userData: response.data.response }));
        navigate("/add_register_contacts");
      }
    } catch (err) {
      console.log("error in bio submission:", err);
    }
  };

  return (
    <ModifiedContainer>
      <div className="w-full md:w-[45vw] p-6 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 font-poppins text-center drop-shadow-sm">
          Tell us about yourself
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <InputModified
            type="textArea"
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            label="Bio"
          />

          {/* Date Picker */}
          <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <CalendarIcon className="text-gray-500" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectdDate(date)}
              placeholderText="Select your birth date"
              className="w-full outline-none"
            />
          </div>

          {/* Gender */}
          <div className="flex justify-around font-poppins gap-6">
            {["Male", "Female"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 text-gray-700 cursor-pointer"
              >
                <InputModified
                  type="radio"
                  value={option}
                  name="gender"
                  checked={gender === option}
                  onChange={handleGender}
                />
                <p className="font-poppins">{option} </p>
              </label>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            <InputModified
              type="text"
              label="Platform"
              value={newPlaform}
              onChange={(e) => setNewPlatform(e.target.value)}
            />
            <InputModified
              type="url"
              label="URL"
              value={platformUrl}
              onChange={(e) => setPlatformUrl(e.target.value)}
            />
          </div>
          <ModifiedButton type="button" onClick={handleAddLinkButton} className="p-2 text-white font-semibold  hover:transition-all duration-200 ease-linear hover:text-neutral-200 ">
            Add Link
          </ModifiedButton>

          {/* Display Social Links */}
          {socialLinks.length > 0 && (
            <ul className="flex flex-col gap-3">
              {socialLinks.map((element, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center p-3 border rounded-lg shadow-sm bg-gray-50 "
                >
                  <div>
                    <p className="font-semibold text-gray-800">{element.platform}</p>
                    <a
                      href={element.url}
                      className="text-blue-600 hover:underline text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {element.url}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => DeleteParticularLink(element)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Banner Image */}
          <Input
            name="profilePicture"
            type="file"
            label="Banner Image"
            placeholder="Upload Banner Image"
            onChange={handleFileChange}
          />
          {selectedFile && (
            <p className="text-sm text-gray-600">File: {selectedFile.name}</p>
          )}

          {/* Country / City */}
          <InputModified
            type="text"
            label="Country"
            value={counrty}
            onChange={(e) => setCountry(e.target.value)}
          />
          <InputModified
            type="text"
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <ModifiedButton type="submit" className="w-full  hover:bg-blue-700 text-white">
            Submit
          </ModifiedButton>
        </form>
      </div>
    </ModifiedContainer>
  );
}

export default BioComponent;
