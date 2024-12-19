import React, { useState } from 'react';
import { generateAuditReport } from '../../services/api';
import { useAuth } from '../auth/AuthContext';
import AuditReport from './AuditReport';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  ArrowLeft,
} from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';

const EnergyAudit = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [buildingType, setBuildingType] = useState('');
  const [floors, setFloors] = useState('');
  const [compartments, setCompartments] = useState([
    { name: 'Bedroom', appliances: [] },
  ]);
  const [newCompartment, setNewCompartment] = useState('');
  const [activeCompartment, setActiveCompartment] = useState(null);
  const [newAppliance, setNewAppliance] = useState({
    name: '',
    power_rating: '',
    usage_time: '',
  });
  const [editingAppliance, setEditingAppliance] = useState(null);
  const [showAuditReport, setShowAuditReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auditReportData, setAuditReportData] = useState(null);
  const { user } = useAuth();

  const handleAddCompartment = () => {
    if (newCompartment) {
      setCompartments([
        ...compartments,
        { name: newCompartment, appliances: [] },
      ]);
      setNewCompartment('');
    }
  };

  const handleRemoveCompartment = (index) => {
    const updatedCompartments = compartments.filter((_, i) => i !== index);
    setCompartments(updatedCompartments);
    if (activeCompartment === index) {
      setActiveCompartment(null);
    } else if (activeCompartment > index) {
      setActiveCompartment(activeCompartment - 1);
    }
  };

  const toggleCompartment = (index) => {
    setActiveCompartment(activeCompartment === index ? null : index);
  };

  const handleAddAppliance = (compartmentIndex) => {
    if (
      newAppliance.name &&
      newAppliance.power_rating &&
      newAppliance.usage_time
    ) {
      const updatedCompartments = [...compartments];
      updatedCompartments[compartmentIndex].appliances.push({
        name: newAppliance.name,
        power_rating: parseFloat(newAppliance.power_rating),
        usage_time: parseFloat(newAppliance.usage_time),
      });
      setCompartments(updatedCompartments);
      setNewAppliance({ name: '', power_rating: '', usage_time: '' });
    }
  };

  const handleRemoveAppliance = (compartmentIndex, applianceIndex) => {
    const updatedCompartments = [...compartments];
    updatedCompartments[compartmentIndex].appliances.splice(applianceIndex, 1);
    setCompartments(updatedCompartments);
  };

  const handleEditAppliance = (compartmentIndex, applianceIndex) => {
    setEditingAppliance({ compartmentIndex, applianceIndex });
    const appliance = compartments[compartmentIndex].appliances[applianceIndex];
    setNewAppliance({ ...appliance });
  };

  const handleUpdateAppliance = () => {
    if (editingAppliance) {
      const { compartmentIndex, applianceIndex } = editingAppliance;
      const updatedCompartments = [...compartments];
      updatedCompartments[compartmentIndex].appliances[applianceIndex] = {
        ...newAppliance,
        power_rating: parseFloat(newAppliance.power_rating),
        usage_time: parseFloat(newAppliance.usage_time),
      };
      setCompartments(updatedCompartments);
      setEditingAppliance(null);
      setNewAppliance({ name: '', power_rating: '', usage_time: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingAppliance(null);
    setNewAppliance({ name: '', power_rating: '', usage_time: '' });
  };

  const handleGenerateAuditReport = async () => {
    if (!isFormValid()) {
      setError(
        'Please fill in all required fields and add at least one compartment with an appliance.'
      );
      return;
    }

    const auditData = {
      user: user?.id ? user.id : user.user_id,
      building_type: buildingType,
      num_floors: parseInt(floors),
      compartments: compartments,
    };

    try {
      setIsLoading(true);
      const response = await generateAuditReport(auditData);

      setAuditReportData(response);
      setShowAuditReport(true);
    } catch (error) {
      console.error('Error generating audit report:', error);
      setError('Failed to generate audit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'buildingType') {
      setBuildingType(value);
    } else if (name === 'floors') {
      setFloors(value);
    } else if (name === 'newCompartment') {
      setNewCompartment(value);
    }
  };

  const handleApplianceInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppliance((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      buildingType &&
      floors &&
      compartments.length > 0 &&
      compartments.some((comp) => comp.appliances.length > 0)
    );
  };

  const handleNext = () => {
    if (buildingType && floors) {
      setCurrentPage(2);
    } else {
      setError('Please select a building type and number of floors.');
    }
  };

  const handleReturn = () => {
    setError(null);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-8 bg-[#e6f7e9] h-screen w-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={handleReturn}
          className="bg-[#002713] text-white px-4 py-2 rounded flex items-center"
        >
          <ArrowLeft className="mr-2" /> Return to Previous Page
        </button>
      </div>
    );
  }

  if (showAuditReport) {
    return (
      <AuditReport
        auditData={auditReportData}
        onBack={() => setShowAuditReport(false)}
      />
    );
  }

  return (
    <div className="pl-4 pt-8 md:p-8 bg-[#e6f7e9] min-h-screen">
      <h2 className="text-5xl mb-8 text-[#002713]">Start Audit</h2>

      {currentPage === 1 ? (
        <>
          {/* Building type selection */}
          <div className="mb-6 pt-8 pt-2 border-t-2 border-[#021405] w-full inline-block">
            <h3 className="text-xl mb-4">Select building type</h3>
            <div className="flex flex-col md:flex-row md:space-x-4">
              {['Residential', 'Commercial', 'Industrial'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="buildingType"
                    value={type}
                    checked={buildingType === type}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Number of floors */}
          <div className="mb-6">
            <h3 className="text-xl mb-4">Number of floors</h3>
            <div className="relative">
              <select
                name="floors"
                value={floors}
                onChange={handleInputChange}
                className="w-full p-2 border rounded appearance-none"
              >
                <option value="">Select number of floors</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <button
            onClick={handleNext}
            className="bg-[#002713] text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </>
      ) : (
        <>
          {/* Compartments */}
          <div className="mb-6 pt-8 pt-2 border-t-2 border-[#021405] w-full inline-block">
            <h3 className="text-xl mb-4">Compartments</h3>
            <div className="flex mb-4">
              <input
                type="text"
                name="newCompartment"
                value={newCompartment}
                onChange={handleInputChange}
                placeholder="e.g Bedroom, Office"
                className="flex-grow p-2 border rounded-l"
              />
              <button
                onClick={handleAddCompartment}
                className="bg-[#002713] text-white px-4 py-2 rounded-r"
              >
                <Plus />
              </button>
            </div>

            {compartments.map((compartment, index) => (
              <div className="flex">
                <div key={index} className="mb-4 w-full">
                  <div
                    className="bg-[#c1e6c8] p-4 rounded-lg cursor-pointer flex justify-between items-center w-full"
                    onClick={() => toggleCompartment(index)}
                  >
                    <span>{compartment.name}</span>
                    <div className="flex items-center">
                      {activeCompartment === index ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </div>
                  </div>

                  {activeCompartment === index && (
                    <div className="mt-4 p-4 bg-[#e6f7e9] rounded-lg">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <input
                          type="text"
                          name="name"
                          value={newAppliance.name}
                          onChange={handleApplianceInputChange}
                          placeholder="Appliance name"
                          className="p-2 border rounded"
                        />
                        <input
                          type="number"
                          name="power_rating"
                          value={newAppliance.power_rating}
                          onChange={handleApplianceInputChange}
                          placeholder="Power rating (KW)"
                          className="p-2 border rounded"
                        />
                        <input
                          type="number"
                          name="usage_time"
                          value={newAppliance.usage_time}
                          onChange={handleApplianceInputChange}
                          placeholder="Usage time (hrs/day)"
                          className="p-2 border rounded"
                        />
                      </div>
                      {editingAppliance ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdateAppliance}
                            className="bg-green-500 text-white px-4 py-2 rounded flex-1"
                          >
                            <Check className="inline mr-2" /> Update Appliance
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-red-500 text-white px-4 py-2 rounded flex-1"
                          >
                            <X className="inline mr-2" /> Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddAppliance(index)}
                          className="bg-[#002713] text-white px-4 py-2 rounded w-full"
                        >
                          + Add Appliance
                        </button>
                      )}
                      {compartment.appliances.map((appliance, appIndex) => (
                        <div
                          key={appIndex}
                          className="flex justify-between items-center mt-4 p-2 bg-white rounded"
                        >
                          <span>{appliance.name}</span>
                          <span>
                            {appliance.power_rating}KW, {appliance.usage_time}
                            hrs/day
                          </span>
                          <div>
                            <button
                              className="text-blue-500 mr-2"
                              onClick={() =>
                                handleEditAppliance(index, appIndex)
                              }
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="text-red-500"
                              onClick={() =>
                                handleRemoveAppliance(index, appIndex)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCompartment(index);
                  }}
                  className="text-red-500 flex mt-5 ml-2 md:ml-8"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerateAuditReport}
            className="bg-[#002713] text-white px-4 py-2 rounded"
          >
            Generate Audit
          </button>
        </>
      )}
    </div>
  );
};

export default EnergyAudit;
