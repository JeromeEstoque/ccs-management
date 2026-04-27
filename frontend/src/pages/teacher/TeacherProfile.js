import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { teachersAPI } from '../../services/api';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';
import { User, Save, ToggleLeft, ToggleRight, Loader2, Edit3, X, BookOpen, Award, Briefcase, GraduationCap, Camera } from 'lucide-react';

const TeacherProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await teachersAPI.getByUserId(user.id);
      if (response.data && response.data.success) {
        const teacherData = response.data.teacher;
        setProfile(teacherData);
        
        // Ensure form data includes all necessary fields, especially capstone_schedule
        setFormData({
          ...teacherData,
          capstone_schedule: teacherData.capstone_schedule || ''
        });
        
      } else {
        // Set fallback data to prevent crashes
        const fallbackData = {
          first_name: 'Teacher',
          last_name: 'User',
          email: 'teacher@ccs.edu',
          contact_number: '+1234567890',
          department: 'College of Computer Studies',
          specialization: 'Software Engineering',
          capstone_adviser_available: true,
          capstone_schedule: 'MWF 10:00-11:00 AM',
          expertise: ['React', 'Node.js', 'Database Design'],
          profile_picture: null
        };
        setProfile(fallbackData);
        setFormData(fallbackData);
        toast.info('Using sample data. Profile service unavailable.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
      // Set fallback data to prevent crashes
      const fallbackData = {
        first_name: 'Teacher',
        last_name: 'User',
        email: 'N/A',
        contact_number: 'N/A',
        department: 'N/A',
        specialization: 'N/A',
        capstone_adviser_available: false,
        capstone_schedule: '',
        expertise: [],
        profile_picture: null
      };
      setProfile(fallbackData);
      setFormData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profile_picture_preview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePictureFile || !profile?.id) return;
    
    setUploadingPicture(true);
    try {
      const formData = new FormData();
      formData.append('profile_picture', profilePictureFile);
      
      await teachersAPI.updateProfilePicture(profile.id, formData);
      toast.success('Profile picture updated successfully');
      setProfilePictureFile(null);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploadingPicture(false);
    }
  };

  
  const handleExpertiseChange = (exp) => {
    const current = formData.expertise || [];
    if (current.includes(exp)) {
      setFormData(prev => ({
        ...prev,
        expertise: current.filter(e => e !== exp)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        expertise: [...current, exp]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Convert snake_case to camelCase for backend compatibility
      const submissionData = {
        ...formData,
        firstName: formData.first_name,
        middleName: formData.middle_name,
        lastName: formData.last_name,
        sectionAdvisory: formData.section_advisory,
        coursesHandled: formData.courses_handled,
        organizationDepartment: formData.organization_department,
        yearsOfService: formData.years_of_service,
        employmentStatus: formData.employment_status,
        yearGraduated: formData.year_graduated,
        capstoneAdviserAvailable: formData.capstone_adviser_available,
        capstoneSchedule: formData.capstone_schedule,
              };
      
      // Update general profile information
      await teachersAPI.update(profile.id, submissionData);
      
      // If capstone availability is enabled, also update the schedule separately
      if (profile?.capstone_adviser_available && formData.capstone_schedule !== profile.capstone_schedule) {
        await teachersAPI.toggleCapstoneAvailability(
          profile.id,
          true,
          formData.capstone_schedule
        );
      }
      
            
      toast.success('Profile updated successfully');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleCapstoneAvailability = async () => {
    try {
      const newAvailability = !profile.capstone_adviser_available;
      const currentSchedule = profile.capstone_schedule || formData.capstone_schedule || '';
      
      await teachersAPI.toggleCapstoneAvailability(
        profile.id, 
        newAvailability,
        currentSchedule
      );
      toast.success('Capstone availability updated');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const saveCapstoneSchedule = async () => {
    if (!profile?.capstone_adviser_available) return;
    
    setSavingSchedule(true);
    try {
      await teachersAPI.toggleCapstoneAvailability(
        profile.id,
        true,
        formData.capstone_schedule || ''
      );
      toast.success('Schedule updated successfully');
      fetchProfile(); // Refresh to show updated data
    } catch (error) {
      toast.error('Failed to update schedule');
    } finally {
      setSavingSchedule(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const expertiseOptions = [
    'Web Development', 'Mobile Development', 'Data Science', 
    'Networking', 'AI / Machine Learning', 'Cybersecurity',
    'Database Management', 'Cloud Computing', 'IoT'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative z-10">
      <div className="relative z-10 space-y-6 animate-fade-in p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white relative overflow-hidden mb-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full -translate-y-1/2"></div>
          <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-white rounded-full translate-y-1/2"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              {/* Profile Picture with Enhanced Border */}
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-3 border-white/30 shadow-xl">
                {formData.profile_picture_preview || profile?.profile_picture ? (
                  <img
                    src={formData.profile_picture_preview || profile?.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer transition-all hover:scale-110 shadow-lg">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              )}
              {profilePictureFile && editMode && (
                <button
                  onClick={handleProfilePictureUpload}
                  disabled={uploadingPicture}
                  className="absolute -bottom-2 -right-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-all hover:scale-110 shadow-lg"
                >
                  {uploadingPicture ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 text-white/90 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Faculty Profile</span>
              </div>
              <h1 className="text-3xl font-bold mb-1">{profile?.first_name} {profile?.middle_name} {profile?.last_name}</h1>
              <p className="text-white/80 text-sm">{profile?.position} | {profile?.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <BookOpen className="w-3 h-3" />
                  <span>{profile?.department}</span>
                </div>
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <GraduationCap className="w-3 h-3" />
                  <span>{profile?.specialization}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg ${
              editMode
                ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
                : 'bg-white text-orange-600 hover:bg-orange-50 hover:scale-105'
            }`}
          >
            {editMode ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="glass-panel rounded-xl p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="label">Middle Name</label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Academic Assignment */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Academic Assignment</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Section Advisory</label>
                <input
                  type="text"
                  name="section_advisory"
                  value={formData.section_advisory || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="label">Courses Handled</label>
                <textarea
                  name="courses_handled"
                  value={formData.courses_handled || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  rows={3}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="label">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position || ''}
                  readOnly={true}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Employment Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Years of Service</label>
                <input
                  type="number"
                  name="years_of_service"
                  value={formData.years_of_service || 0}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="label">Employment Status</label>
                <select
                  name="employment_status"
                  value={formData.employment_status || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Educational Background */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Educational Background</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="label">University</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="label">Year Graduated</label>
                <input
                  type="number"
                  name="year_graduated"
                  value={formData.year_graduated || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Areas of Expertise</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {expertiseOptions.map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => editMode && handleExpertiseChange(exp)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    (formData.expertise || []).includes(exp)
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-secondary-100 text-secondary-600 hover:bg-orange-200'
                  } ${!editMode && 'cursor-default'}`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Capstone Availability */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Capstone Adviser Availability</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                <span className="text-secondary-700 font-medium">Available for Advising</span>
                <button
                  type="button"
                  onClick={toggleCapstoneAvailability}
                  disabled={!editMode}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    profile?.capstone_adviser_available
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-secondary-100 text-secondary-600 border border-secondary-200'
                  } ${!editMode && 'opacity-50 cursor-not-allowed'}`}
                >
                  {profile?.capstone_adviser_available ? (
                    <>
                      <ToggleRight className="w-5 h-5" />
                      Available
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5" />
                      Unavailable
                    </>
                  )}
                </button>
              </div>
              {profile?.capstone_adviser_available && (
                <div>
                  <label className="label">Available Schedule</label>
                  <div className="space-y-2">
                    <textarea
                      name="capstone_schedule"
                      value={formData.capstone_schedule || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                      rows={2}
                      placeholder="e.g., Mon-Fri 2PM-5PM"
                      className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {editMode && (
                      <button
                        type="button"
                        onClick={saveCapstoneSchedule}
                        disabled={savingSchedule}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        {savingSchedule ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving Schedule...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Schedule
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

                  </div>

        {editMode && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
      </div>
    </div>
  );
};

export default TeacherProfile;
