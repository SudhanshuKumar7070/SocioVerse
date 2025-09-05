import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "./Button.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SpinnerWithText from "./LoadingSpinner.jsx";

function AppContact() {
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [sucessData, setSuccessData] = useState({});
  const [registeredUserId, setRegisteredUserId] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const registeredUser = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (registeredUser) {
      setRegisteredUserId(registeredUser._id);
    }
  }, [registeredUser]);

  const Url = import.meta.env.VITE_API_URL;

  const fetchAllContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Url}/user/appContacts`);
      setLoading(false);
      setData(response.data.response);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching contacts:", error);
    }
  };

  const handleSelect = (el) => {
    setSelectedId((prevSelected) =>
      prevSelected.includes(el)
        ? prevSelected.filter((id) => id !== el)
        : [...prevSelected, el]
    );
  };

  const handleAddToContact = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${Url}/auth/add_register_Contact/${registeredUserId}`,
        { contactIds: selectedId }
      );
      const data = response.data;
      setLoading(false);
      setSuccessData(data);
      if (data) {
        console.log("Contact saved successfully:", data);
        navigate("/dashboard");
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, []);

  if (loading) {
    return <SpinnerWithText />;
  }

  return (
    <>
      <ul className="bg-slate-900/30 text-slate-200 rounded-xl w-[70%] px-4 py-6  inline-block h-[70vh] overflow-y-scroll my-4 scrollbar-custom shadow-lg relative">
           <h1 className="text-2xl tracking-tight leading-tight font-semibold font-montserrat  my-4  text-white  py-4 px-2  w-full sticky top-0 left-0 right-0 text-center shadow-md bg-white/10 backdrop-blur-sm rounded-md">Select Friends to Get Started</h1>
       
        {data.length > 0 ? (
          data.map((el) => (
            <li
              key={el._id}
              onClick={() => handleSelect(el._id)}
              className={`  p-3 rounded-md gap-2 my-2 cursor-pointer transition-all duration-150 ${
                selectedId.includes(el._id)
                  ? "bg-sky-900 shadow-lg"
                  : "bg-slate-800 shadow-md hover:bg-slate-700 hover:shadow-lg "
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={el.profilePicture}
                  alt="img"
                  className="h-8 w-8 rounded-full border border-slate-400"
                />
                <p className="text-sky-300 font-medium text-xl font-poppins">{el.fullName}</p>
              </div>
              <p className="text-slate-400 font-montserrat pl-11">{el.userName}</p>
            </li>
          ))
        ) : (
          <p className="border-2 border-slate-600 bg-slate-700 text-slate-300 p-3 rounded-xl my-2">
            No contacts available
          </p>
        )}
      </ul>

      {data.length > 0 && (
        <Button className="mt-4" onClick={handleAddToContact}>
          Add to Contact
        </Button>
      )}
    </>
  );
}

export default AppContact;
