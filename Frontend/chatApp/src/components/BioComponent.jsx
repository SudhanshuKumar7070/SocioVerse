import React from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { CalendarIcon } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import Input from "./Input.jsx";
import { useState, useEffect } from "react";
import ModifiedContainer from "./ModifiedComponents/ModifiedContainer/ModifiedContainer.jsx";
// import ModifiedButton from './ModifiedComponents/ModifiedButtons/ModifiedButton.jsx'
import InputModified from "./ModifiedComponents/InputModified/InputModified";
import ModifiedButton from "./ModifiedComponents/ModifiedButtons/ModifiedButton.jsx";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice.js";
// import { WithContext as ReactTags } from 'react-tag-input';

function BioComponent() {
  const Url = import.meta.env.VITE_API_URL;
  const [bioText, setBioText] = useState("");
  const [selectedDate, setSelectdDate] = useState(null);
  const [socialLinks, setSocialLinks] = useState([
  ]);
  const [newPlaform, setNewPlatform] = useState("");
  const [platformUrl, setPlatformUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [counrty, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();
  const userID = useSelector((state) => state.auth?.userData?._id);
  console.log("usre id kmwlr>",userID)
const  dispatch = useDispatch();
  // const [links, setLinks] =useState([{platform:"",url:""}])
  // const AddNewLink=(element)=>{
  //   setLinks((prev)=> [...prev,{platform:element.platform,url:element.url}])
  // }
  // const DeleteThatTag=(tags)=>{
  //     links.filter((el)=>el !== tags)
  const handleGender = (e) => {
      setGender(e.target.value)
       
  };
  const handleCity = (e) => {
    setCity(e.target.value);
  };
  const handleCountry = (e) => {
    setCountry(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Access the selected file
    console.log("Selected file:", e.target.files[0]);
  };

  const DeleteParticularLink = (link) => {
    if (socialLinks.length > 0) {
      setSocialLinks(socialLinks.filter((el) => el !== link));
    }
  };

  const handleAddLinkButton = () => {
    if (newPlaform && platformUrl) {
      setSocialLinks((prev) => [
        ...prev,
        { platform: newPlaform, url: platformUrl },
      ]);
      setNewPlatform("");
      setPlatformUrl("");
    } else {
      alert("Both platform and URL are required.");
    }
  };
  const handlePlatFormUrl = (e) => {
    setPlatformUrl(e.target.value);
  };

  const handlePlatFormInput = (e) => {
    setNewPlatform(e.target.value);
  };

  const handleBioText = (e) => {
    setBioText(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSelectdDate(null);
    try {
      const formData = new FormData();
      formData.append("bioText", bioText);
      formData.append("dateOfBirth", selectedDate);
       formData.append("gender",gender);
    //   formData.append("socialLinks", socialLinks);  arrays require special treatment for subnission
      formData.append("bannerImage", selectedFile);
      formData.append("country", counrty);
      formData.append("city", city);
      console.log("gender",gender);
      console.log("form data structure ::>", formData);
       socialLinks.forEach((link,index)=>{
        formData.append(`socialLinks[${index}][platform]`, link.platform);
        formData.append(`socialLinks[${index}][url]`, link.url);
       })
      const response = await axios.post(
        `${Url}/auth/moreInfo_bio/${userID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    
      if (response) {
        console.log("bioResponse:", response.data.response);
           dispatch(login({userData:response.data.response}))
        navigate("/add_register_contacts");
      }
    } catch (err) {
      console.log("error ig getting post request", err);
    }

    console.log("Form submitted");
  };

  console.log(selectedDate);

  return (
    <ModifiedContainer>
      <h1 className="heading">Tell us about yourself</h1>
      <form onSubmit={handleSubmit}>
        <InputModified
          type={"textArea"}
          value={bioText}
          onChange={handleBioText}
          label={"Bio"}
        />
        <div className="border border-gray-400 rounded-md p-3 flex items-center gap-2 my-4 shadow-md ">
          <label htmlFor="datePicker">
            <CalendarIcon className="text-gray-500" />
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectdDate(date)}
            placeholderText="Select a date"
            id="datePicker"
            className="w-full h-full outline-none border-none active:outline-none active:border-none active:shadow-none  "
          />
        </div>
        <div className=" flex w-full justify-between items-center ">
          <div className="male flex justify-center items-center p-2  gap-2">
            <label htmlFor="male">Male</label>
            <InputModified
              type="radio"
              value="Male"
              id="male"
              name="gender"
              checked ={ gender === "Male"}
              onChange={handleGender}
              
            />
          </div>
          <div className="female flex justify-center items-center p-2 gap-2">
            <label htmlFor="female">Female</label>
            <InputModified
              type="radio"
              value={"Female"}
              id="female"
              name="gender"
              checked ={gender === "Female"}
              onChange={handleGender}
              
            />
          </div>
        </div>
        {/* <ReactTags
        editable
        handleAddition={AddNewLink}
        handleDelete={DeleteThatTag} // React tags cant be used here , descent learning but cant be used here
        /> */}
        <InputModified
          type="text"
          label={"Add Platform"}
          value={newPlaform}
          onChange={handlePlatFormInput}
        />
        <InputModified
          type="url"
          label={"Url"}
          value={platformUrl}
          onChange={handlePlatFormUrl}
        />
        <ModifiedButton type="button" onClick={handleAddLinkButton}>
          Add Link
        </ModifiedButton>

        {socialLinks && (
          <ul>
            {socialLinks.map((element) => (
              <li key={element.platform}>
                <p>platForm:{element.platform}</p>
                <p>
                  {" "}
                  link<a href={element.url}>{element.url}</a>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    DeleteParticularLink(element);
                  }}
                >
                  Delete Link
                </button>
              </li>
            ))}
          </ul>
        )}

        <Input
          name="profilePicture"
          type="file"
          label="Banner Image"
          placeholder="Upload Banner Image"
          onChange={handleFileChange}
          // value={selectedFile}
        />
        {selectedFile && <p>File Name: {selectedFile.name}</p>}

        <InputModified
          type="text"
          label={"Country"}
          value={counrty}
          onChange={handleCountry}
        />
        <InputModified
          type="text"
          label={"City"}
          value={city}
          onChange={handleCity}
        />
      </form>

      <ModifiedButton onClick={handleSubmit}>Submit</ModifiedButton>
    </ModifiedContainer>
  );
}

export default BioComponent;
