import React from "react";
import { useSelector } from "react-redux";
import { Mail, MapPin, Calendar, Link, Edit, Instagram, Twitter, Linkedin, Users } from 'lucide-react';

function CurrentUserProfile() {
  const currentUserData = useSelector((state) => state.auth.userData);
  
  return (
    <div className=" mx-auto  rounded-lg shadow-lg bg-blue-300 overflow-hidden bg-opacity-15">
      {/* Banner Image */}
      <div className="relative h-32 bg-gray-200 overflow-hidden">
        {currentUserData.bio?.bannerImage ? (
          <img
            src={currentUserData?.bio?.bannerImage || ""}
            className="w-full h-full object-cover"
            alt="Profile banner"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700" />
        )}
        <button className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full border border-gray-300 shadow-sm hover:bg-gray-50">
          <Edit size={14} className="text-violet-300" />
        </button>
      </div>
      
      {/* Profile Header */}
      <div className="border-b border-gray-200 pb-4">
        {/* Profile Picture */}
        <div className="flex justify-center -mt-16 mb-2">
          <div className="relative">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden shadow-md">
              <img
                src={currentUserData.profilePicture}
                className="h-full w-full object-cover"
                alt={`${currentUserData.fullName}'s profile`}
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-gray-300 shadow-sm hover:bg-gray-50">
              <Edit size={14} className="text-blue-300" />
            </button>
          </div>
        </div>
        
        {/* User Identity */}
        <div className="text-center px-4">
          <h1 className="text-xl font-bold text-blue-500">{currentUserData.fullName}</h1>
          <p className="text-blue-300">@{currentUserData.userName}</p>
        </div>
      </div>
      
      {/* User Details */}
      <div className="p-4">
        {/* Bio */}
        {currentUserData?.bio?.text && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-gray-700 text-sm">{currentUserData.bio.text}</p>
          </div>
        )}
        
        {/* Stats */}
        <div className="flex mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center text-sm text-blue-300 mr-4">
            <Users size={16} className="mr-1" />
            <span className="font-semibold text-gray-900">{currentUserData?.stats?.followers || 0}</span>
            <span className="ml-1">followers</span>
          </div>
          <div className="flex items-center text-sm text-blue-300">
            <span className="font-semibold text-gray-900">{currentUserData?.stats?.following || 0}</span>
            <span className="ml-1">following</span>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          {currentUserData.email && (
            <div className="flex items-center text-sm text-blue-300 mb-2">
              <Mail size={16} className="mr-2 text-blue-500" />
              <a href={`mailto:${currentUserData.email}`} className="hover:text-blue-600 hover:underline">
                {currentUserData.email}
              </a>
            </div>
          )}
          
          {currentUserData?.bio?.text && (
            <div className="flex items-center text-sm text-blue-300 mb-2">
              <MapPin size={16} className="mr-2 text-gray-500" />
              <span>{currentUserData.bio.text}</span>
            </div>
          )}
          
          {currentUserData?.joinDate && (
            <div className="flex items-center text-sm text-blue-300 mb-2">
              <Calendar size={16} className="mr-2 text-gray-500" />
              <span>Joined {currentUserData.joinDate}</span>
            </div>
          )}
          
          {currentUserData?.bio?.website && (
            <div className="flex items-center text-sm text-blue-300 mb-2">
              <Link size={16} className="mr-2 text-gray-500" />
              <a href={currentUserData.bio.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">
                {currentUserData.bio.website.replace(/(^\w+:|^)\/\//, '')}
              </a>
            </div>
          )}
        </div>
        
        {/* Social Media Links */}
        {(currentUserData?.bio?.socialLinks?.instagram || 
          currentUserData?.bio?.socialLinks?.twitter || 
          currentUserData?.bio?.socialLinks?.linkedin) && (
          <div className="flex gap-3 mb-4 pb-4 border-b border-gray-100">
            {currentUserData?.bio?.socialLinks?.twitter && (
              <a href={currentUserData.bio.socialLinks.twitter} className="text-gray-500 hover:text-gray-800">
                <Twitter size={18} />
              </a>
            )}
            {currentUserData?.bio?.socialLinks?.instagram && (
              <a href={currentUserData.bio.socialLinks.instagram} className="text-gray-500 hover:text-gray-800">
                <Instagram size={18} />
              </a>
            )}
            {currentUserData?.bio?.socialLinks?.linkedin && (
              <a href={currentUserData.bio.socialLinks.linkedin} className="text-gray-500 hover:text-gray-800">
                <Linkedin size={18} />
              </a>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 py-2 bg-gray-900 text-white text-sm rounded-md font-medium hover:bg-gray-800 transition-colors">
            Friends
          </button>
          <button className="flex-1 py-2 border border-gray-300 text-blue-500 text-sm rounded-md font-medium hover:bg-gray-50 transition-colors shadow-lg ">
            Followers
          </button>
        </div>
      </div>
    </div>
  );
}

export default CurrentUserProfile;