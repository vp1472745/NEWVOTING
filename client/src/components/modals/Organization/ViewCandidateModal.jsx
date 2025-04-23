import React from "react";
import {
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
} from "react-icons/fi";
import { MdPayment } from "react-icons/md";
import { GiPublicSpeaker } from "react-icons/gi";
import { TbUsersGroup } from "react-icons/tb";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { IoMdMale, IoMdFemale, IoMdTransgender } from "react-icons/io";
import { RiVerifiedBadgeFill, RiCloseCircleFill } from "react-icons/ri";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const ViewCandidateModal = ({ isOpen, onClose, candidate }) => {
  const handleImageError = (e, imageType, imageUrl) => {
    console.error(`Failed to load ${imageType} image:`, imageUrl);
    e.target.style.display = "none";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-800">
            <RiVerifiedBadgeFill className="mr-1.5 text-emerald-600" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-50 text-rose-800">
            <RiCloseCircleFill className="mr-1.5 text-rose-600" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-50 text-yellow-800">
            <HiOutlineStatusOnline className="mr-1.5 text-yellow-600" /> Pending
          </span>
        );
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return <IoMdMale className="text-blue-600" />;
      case "female":
        return <IoMdFemale className="text-pink-600" />;
      default:
        return <IoMdTransgender className="text-purple-600" />;
    }
  };

  if (!isOpen || !candidate) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FiUser className="mr-2 text-white" /> Candidate Profile
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column - Images */}
              <div className="flex flex-col items-center space-y-6 w-full md:w-1/3">
                {/* Candidate Image */}
                <div className="relative my-10">
                  {candidate.candidateImage ? (
                    <img
                      src={
                        candidate.candidateImage.includes("http")
                          ? candidate.candidateImage
                          : `http://localhost:4500/${candidate.candidateImage}`
                      }
                      alt="Candidate"
                      className="w-40 h-40 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                      onError={(e) =>
                        handleImageError(e, "candidate", candidate.candidateImage)
                      }
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiUser className="text-gray-400 text-5xl" />
                    </div>
                  )}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    {getStatusBadge(candidate.candidateStatus)}
                  </div>
                </div>

                {/* Payment Proof Image */}
                {candidate.candidatePayImage && (
                  <div className="mt-20 text-center w-full">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center justify-center">
                      <MdPayment className="mr-1.5 text-gray-600" /> Payment Proof
                    </h3>
                    <img
                      src={
                        candidate.candidatePayImage.includes("http")
                          ? candidate.candidatePayImage
                          : `http://localhost:4500/${candidate.candidatePayImage}`
                      }
                      alt="Payment Proof"
                      className="w-full max-w-xs rounded-lg object-cover border border-gray-200 shadow-xs"
                      onError={(e) =>
                        handleImageError(e, "payment", candidate.candidatePayImage)
                      }
                    />
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="w-full md:w-2/3 space-y-6">
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <FiUser className="mr-2 text-gray-600" />
                    Personal Information
                  </h3>
                  <div className="grid gap-4 my-5">
                    <DetailItem
                      icon={<FiUser className="text-gray-600" />}
                      label="Full Name"
                      value={candidate.candidateName}
                    />
                    <DetailItem
                      icon={<FiMail className="text-gray-600" />}
                      label="Email"
                      value={candidate.candidateEmail}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <DetailItem
                      icon={<FiPhone className="text-gray-600" />}
                      label="Phone"
                      value={candidate.candidatePhone}
                    />
                    <DetailItem
                      icon={<FiMapPin className="text-gray-600" />}
                      label="Address"
                      value={candidate.candidateAddress}
                    />
                    <DetailItem
                      icon={getGenderIcon(candidate.candidateGender)}
                      label="Gender"
                      value={candidate.candidateGender}
                    />
                    <DetailItem
                      icon={<FiCalendar className="text-gray-600" />}
                      label="Age"
                      value={candidate.candidateAge}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <GiPublicSpeaker className="mr-2 text-gray-600" />
                    Application Details
                  </h3>
                  <div className="grid grid-cols-1 gap-5">
                    <DetailItem
                      icon={<TbUsersGroup className="text-gray-600" />}
                      label="Election Name"
                      value={candidate.election?.electionName || "Not provided"}
                    />
                    <div className="flex flex-col md:flex-row gap-8">
                      <DetailItem
                        icon={<FiBriefcase className="text-gray-600" />}
                        label="Applied Position"
                        value={candidate.appliedPost || "Not provided"}
                      />
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <HiOutlineStatusOnline className="mr-2 text-gray-600" />
                          <span className="font-medium">Application Status</span>
                        </div>
                        <div className="ml-7">
                          {getStatusBadge(candidate.candidateStatus)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white px-6 py-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
            >
              <FiX className="mr-2" /> Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Reusable detail item component
const DetailItem = ({ icon, label, value }) => (
  <div>
    <div className="flex items-center text-sm text-gray-500 mb-1.5">
      {icon}
      <span className="ml-2.5 font-medium">{label}</span>
    </div>
    <div className="ml-7 text-gray-800 font-normal">
      {value || <span className="text-gray-400 italic">Not provided</span>}
    </div>
  </div>
);

ViewCandidateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  candidate: PropTypes.object,
};

DetailItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default ViewCandidateModal;