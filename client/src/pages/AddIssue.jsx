import { PhotoIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner'; 
import { statesInNigeria } from '../constants/data';
import Modal from 'react-modal'; 
import { useNavigate } from 'react-router-dom'

// Modal styles
const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90%',
    width: '400px',
    padding: '20px',
    borderRadius: '8px',
  },
};

export default function AddIssue() {
  const [issuesDetails, setIssuesDetails] = useState({
    category: "",
    description: "",
    state: "",
    street_address: ""
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInitialModal, setShowInitialModal] = useState(true); 
  const [showPermissionModal, setShowPermissionModal] = useState(false); 

  const requestLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
          toast.success("Location access granted!");
        },
        (error) => {
          console.error("Error fetching location:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setShowPermissionModal(true); // Show modal if permission is denied
              toast.error("Location access denied. Please enable it to submit an issue.");
              break;
            case error.POSITION_UNAVAILABLE:
              toast.error("Location information is unavailable. Check your connection.");
              break;
            case error.TIMEOUT:
              toast.error("The request to get user location timed out.");
              break;
            default:
              toast.error("An unknown error occurred while fetching the location.");
          }
        }
      );
    }
  };

  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [uploadedImages]);

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    setIssuesDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxFilesAllowed = 2;
    
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (uploadedImages.length + validFiles.length > maxFilesAllowed) {
      toast.error('You can only upload a maximum of 2 images.');
      return;
    }

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => {
      const updatedImages = [...prev];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!issuesDetails.category || !issuesDetails.description || !issuesDetails.state || !issuesDetails.street_address) {
      toast.error("All fields are required!");
      return;
    }
    
    if (issuesDetails.description.length < 20 || issuesDetails.description.length > 500) {
      toast.error("Description must be between 20 and 500 characters.");
      return;
    }
    
    if (uploadedImages.length < 1) {
      toast.error("An image upload is needed for the issue!");
      return;
    }

    setIsLoading(true); // Show loader during submission

    // Prepare FormData
    const formData = new FormData();
    formData.append("category", issuesDetails.category);
    formData.append("description", issuesDetails.description);
    formData.append("state", issuesDetails.state);
    formData.append("street_address", issuesDetails.street_address);
    formData.append("latitude", lat);
    formData.append("longitude", long);

    
    uploadedImages.forEach((image, index) => {
      formData.append("photo_upload", image.file);
    });

    try {
      const response = await axios.post("/api/v1/issues", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(response);
      toast.success("Issue submitted successfully!");
      setIssuesDetails({ category: "", description: "", state: "", street_address: "" });
      setUploadedImages([]);
      navigate("/")
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response);
    
        if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
          error.response.data.errors.forEach((err) => {
            toast.error(err.msg);
          });
        } else {
          const errorMessage = error.response.data?.message || "An error occurred on the server.";
          toast.error(`Server Error: ${errorMessage}`);
        }
      } else if (error.request) {
        console.error("No response from server:", error.request);
        toast.error("No response from server. Please check your network.");
      } else {
        console.error("Error setting up request:", error.message);
        toast.error(`Request error: ${error.message}`);
      }
    } finally {
      setIsLoading(false); // Hide loader after submission
    }
  };

  return (
    <div className='w-full sm:px-10 md:w-1/2 mx-auto my-10'>
      <form method='post' encType='multipart/form-data' onSubmit={handleFormSubmit}>
        {/* Initial Modal to Inform Users Before Requesting Location */}
        <Modal isOpen={showInitialModal} style={modalStyles} ariaHideApp={false}>
          <h2 className="text-lg font-semibold text-gray-900">Location Access Needed</h2>
          <p className="mt-2 text-sm text-gray-600">
          To accurately display your reported issue on the map, we require access to your location. Your data will be used solely for this purpose.
          </p>
          <button
            onClick={() => {
              setShowInitialModal(false);
              requestLocationAccess();
            }}
            className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Allow Location Access
          </button>
        </Modal>

        {/* Modal if Location Access is Denied */}
        <Modal isOpen={showPermissionModal} style={modalStyles} ariaHideApp={false}>
          <h2 className="text-lg font-semibold text-gray-900">Enable Location Access</h2>
          <p className="mt-2 text-sm text-gray-600">
            This app requires location access to pinpoint the issue’s exact location. Please enable location access in your browser settings.
          </p>
          <button
            onClick={() => setShowPermissionModal(false)}
            className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            OK
          </button>
        </Modal>

        {/* Rest of your form fields and elements */}

        <div className="space-y-12">
          
          {/* Form Fields */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900">Report an Issue in Your Community</h2>
            <p className="mt-1 text-sm text-gray-600">
              Please provide detailed information to help us address the issue efficiently.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          
              {/* Category */}
              <div className="col-span-full">
                <label htmlFor="category" className="block text-sm font-medium text-gray-900">
                  Issue Category
                </label>
                <div className="mt-2">
                  <select
                    id="category"
                    name="category"
                    value={issuesDetails.category}
                    onChange={handleFormInput}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  >
                    <option value="" disabled>Select a category</option>
                    <option>Pothole</option>
                    <option>Power Outage</option>
                    <option>Waste Management</option>
                    <option>Broken Streetlight</option>
                    <option>Road Damage</option>
                    <option>Flooding</option>
                    <option>Traffic Signal Malfunction</option>
                    <option>Water Supply</option>
                    <option>Noise Complaint</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="col-span-full">
                <div className="label-wrapper flex justify-between content-center">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                    Issue Description
                  </label>
                  <span className={issuesDetails.description.length >= 200 ? "text-red-500 text-sm" : "text-sm text-gray-600"} >{issuesDetails.description.length} / <span className='text-red-500'>250</span>  </span>
                </div>

                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    value={issuesDetails.description}
                    onChange={handleFormInput}
                    rows={3}
                    placeholder="Describe the issue in detail. Include any relevant information such as when it started or any previous attempts to address it."
                    minLength={20}
                    maxLength={500}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />

                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Provide as much detail as possible to help us understand and prioritize this issue.
                </p>
              </div>

              {/* State */}
              <div className="col-span-full">
                <label htmlFor="state" className="block text-sm font-medium text-gray-900">
                  State
                </label>
                <div className="mt-2">
                  <select
                    id="state"
                    name="state"
                    value={issuesDetails.state}
                    onChange={handleFormInput}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  >
                    <option value="" disabled>Select your state</option>
                    { statesInNigeria.map((states, index) => {
                      return (
                        <option key={index}>{states} </option>
                      )
                    }) }
                  </select>
                </div>
              </div>

              {/* Street Address */}
              <div className="col-span-full">
                <label htmlFor="street_address" className="block text-sm font-medium text-gray-900">
                  Detailed Location (Street Address)
                </label>
                <div className="mt-2">
                  <input
                    id="street_address"
                    name="street_address"
                    value={issuesDetails.street_address}
                    onChange={handleFormInput}
                    type="text"
                    placeholder="Enter the street address or landmark closest to the issue"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="col-span-full">
                <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-900">
                  Upload Photos (Maximum 2)
                </label>
                <div className="mt-2">
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.preview}
                            alt={`Uploaded preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-6 w-6 hover:bg-red-500"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {uploadedImages.length < 3 && (
                    <label
                      htmlFor="photo-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <div className='flex'>
                      <PhotoIcon aria-hidden="true" className="h-12 w-12 text-gray-300" />
                      <span className='mt-3 ml-2'>Upload up to {2 - uploadedImages.length} more {2 - uploadedImages.length === 1 ? 'image' : 'images'}</span>
                      
                      <input
                        id="photo-upload"
                        name="photo_upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileUpload}
                        multiple
                      />
                      </div>
                      
                    </label>
                  )}
                  <p className="text-xs text-gray-600">Supported file types: PNG, JPG, up to 5MB per file</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center my-4">
            <ThreeDots color="#4f46e5" height={80} width={80} />
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isLoading ? 'Submitting...' : 'Submit Issue'}
          </button>
        </div>
        
        {/* Toast Notification Container */}
        <ToastContainer position="top-center" autoClose={5000} />
      </form>
    </div>
  );
}
