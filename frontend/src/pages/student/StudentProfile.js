import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentsAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { User, Camera, Save, Loader2, Edit3, X, GraduationCap, Users, Briefcase, MapPin, Phone, Mail, Award } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [skillType, setSkillType] = useState('');
  const [editingSkillId, setEditingSkillId] = useState(null);

  // Predefined skills data
  const skillsData = {
    technical: [
      'Programming',
      'Networking', 
      'Database',
      'UI/UX',
      'Cybersecurity'
    ],
    sports: [
      'Basketball',
      'Volleyball',
      'Esports', 
      'Chess'
    ]
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Get student profile by user_id (from JWT token)
      const response = await studentsAPI.getByUserId(user.id);
      if (response.data && response.data.success) {
        const studentData = response.data.student;
        setProfile(studentData);
        setFormData(studentData);
        
        // Set skills from backend response if available
        if (studentData.skills && Array.isArray(studentData.skills)) {
          setSkills(studentData.skills.map(skill => ({
            id: Date.now() + Math.random(), // Generate unique ID
            name: skill.name,
            type: skill.type || 'technical'
          })));
        } else {
          loadSkillsFromStorage(); // Fallback to localStorage
        }
      } else {
        // Set fallback data to prevent crashes
        const fallbackData = {
          first_name: 'John',
          last_name: 'Doe',
          middle_name: 'Michael',
          email: 'john.doe@ccs.edu',
          contact_number: '+1234567890',
          address: '123 Main St, City, Country',
          year_level: '3rd Year',
          section: 'BSIT-3A',
          gpa: '3.75',
          status_record: 'Regular',
          organization_role: 'Student Council Member',
          guardian_name: 'Jane Doe',
          guardian_contact: '+0987654321',
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
        first_name: 'Student',
        last_name: 'User',
        middle_name: '',
        email: 'student@ccs.edu',
        contact_number: '+1234567890',
        address: '123 Main St, City, Country',
        year_level: 'N/A',
        section: 'N/A',
        gpa: 'N/A',
        status_record: 'N/A',
        organization_role: 'N/A',
        guardian_name: 'N/A',
        guardian_contact: 'N/A',
        profile_picture: null
      };
      setProfile(fallbackData);
      setFormData(fallbackData);
    } finally {
      setLoading(false);
      loadSkillsFromStorage(); // Load saved skills
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      
      await studentsAPI.updateProfilePicture(profile.id, formData);
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

  // Skills & Sports Management Functions
  const addSkill = () => {
    if (newSkill.trim() && skillType) {
      const skill = {
        id: Date.now(), // Temporary ID for new skills
        name: newSkill.trim(),
        type: skillType
      };
      setSkills([...skills, skill]);
      setNewSkill('');
      setSkillType(''); // Reset skill type after adding
      toast.success(`${skillType === 'technical' ? 'Skill' : 'Sport'} added successfully`);
    }
  };

  const handleSkillTypeChange = (e) => {
    const selectedType = e.target.value;
    setSkillType(selectedType);
    setNewSkill(''); // Reset skill name when type changes
  };

  const deleteSkill = (skillId) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
    toast.success('Deleted successfully');
  };

  const editSkill = (skillId) => {
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
      setNewSkill(skill.name);
      setSkillType(skill.type);
      setEditingSkillId(skillId);
    }
  };

  const updateSkill = () => {
    if (newSkill.trim() && editingSkillId) {
      setSkills(skills.map(skill => 
        skill.id === editingSkillId 
          ? { ...skill, name: newSkill.trim(), type: skillType }
          : skill
      ));
      setNewSkill('');
      setEditingSkillId(null);
      toast.success('Updated successfully');
    }
  };

  const cancelEdit = () => {
    setNewSkill('');
    setEditingSkillId(null);
    setSkillType('technical');
  };

  const saveSkillsToProfile = async () => {
    try {
      // Save skills to backend via profile update
      const skillsData = skills.map(skill => skill.name); // Send only skill names as expected by backend
      await studentsAPI.update(profile.id, { skills: skillsData });
      
      // Also keep localStorage as backup
      localStorage.setItem(`student_skills_${user.id}`, JSON.stringify(skills));
      toast.success('Skills & Sports saved successfully');
    } catch (error) {
      console.error('Error saving skills:', error);
      // Fallback to localStorage if backend fails
      localStorage.setItem(`student_skills_${user.id}`, JSON.stringify(skills));
      toast.error('Failed to save skills to server, saved locally');
    }
  };

  const loadSkillsFromStorage = () => {
    try {
      const storedSkills = localStorage.getItem(`student_skills_${user.id}`);
      if (storedSkills) {
        setSkills(JSON.parse(storedSkills));
      }
    } catch (error) {
      console.error('Error loading skills:', error);
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
        contactNumber: formData.contact_number,
        yearLevel: formData.year_level,
        statusRecord: formData.status_record,
        lastSchoolAttended: formData.last_school_attended,
        guardianName: formData.guardian_name,
        guardianContact: formData.guardian_contact,
        medicalRecords: formData.medical_records,
        workingStudent: formData.working_student,
        workType: formData.work_type,
        organizationRole: formData.organization_role,
        classRepresentative: formData.class_representative,
        skills: skills.map(skill => skill.name) // Include skills in main submission
      };
      
      await studentsAPI.update(profile.id, submissionData);
      
      // Also keep localStorage as backup for skills
      localStorage.setItem(`student_skills_${user.id}`, JSON.stringify(skills));
      
      toast.success('Profile updated successfully');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden shadow-xl ring-4 ring-white/10">
                {formData.profile_picture_preview || profile?.profile_picture ? (
                  <img
                    src={formData.profile_picture_preview || profile?.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
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
                  className="absolute -bottom-2 -right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors shadow-lg"
                >
                  {uploadingPicture ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </button>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-orange-100 mb-2">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium tracking-wide">Student Profile</span>
              </div>
              <h1 className="text-3xl font-bold text-white leading-tight mb-1">
                {profile?.first_name} {profile?.middle_name} {profile?.last_name}
              </h1>
              <p className="text-orange-100 text-sm leading-relaxed">
                <span className="font-medium">{profile?.student_id || 'N/A'}</span> • {profile?.year_level || 'N/A'} - {profile?.section || 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm shadow-lg hover:scale-105"
          >
            {editMode ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card title="Personal Information" icon={User} className="lg:col-span-2">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg bg-white text-gray-900 disabled:bg-orange-50 disabled:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Middle Name</label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg bg-white text-gray-900 disabled:bg-orange-50 disabled:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg bg-white text-gray-900 disabled:bg-orange-50 disabled:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg bg-white text-gray-900 disabled:bg-orange-50 disabled:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg bg-white text-gray-900 disabled:bg-orange-50 disabled:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Contact Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                    <input
                      type="tel"
                      name="contact_number"
                      value={formData.contact_number || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg bg-white text-gray-900 disabled:bg-orange-50 disabled:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-violet-400" />
                    <textarea
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg bg-white text-gray-900 disabled:bg-orange-50 disabled:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Skills & Sports */}
          <Card title="Skills & Sports" icon={Award}>
            <div className="space-y-6 p-2">
              {/* Add Skill Input */}
              {editMode && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-orange-700">Add New Skill</label>
                  <div className="space-y-3">
                    <select
                      value={skillType}
                      onChange={handleSkillTypeChange}
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      <option value="technical">Technical Skill</option>
                      <option value="sports">Sport</option>
                    </select>
                    
                    {skillType && (
                      <div className="flex gap-2">
                        <select
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="flex-1 px-4 py-2 border border-orange-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        >
                          {skillsData[skillType].map((skill, index) => (
                            <option key={index} value={skill}>
                              {skill}
                            </option>
                          ))}
                        </select>
                        {editingSkillId ? (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={updateSkill}
                              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={addSkill}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skills List */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-orange-700">Your Skills & Sports</label>
                <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transform transition-all duration-200 hover:scale-105 relative group ${
                          skill.type === 'technical'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border border-orange-300'
                            : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border border-orange-300'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {skill.type === 'technical' ? '💻' : '⚽'}
                          {skill.name}
                        </span>
                        {editMode && (
                          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => deleteSkill(skill.id)}
                              className="w-4 h-4 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                              <X className="w-2 h-2" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="w-full py-4 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500 text-sm">No skills added yet</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

                          </div>
          </Card>

          {/* Academic Information */}
          <Card title="Academic Information" icon={GraduationCap}>
            <div className="space-y-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-xs text-orange-600 uppercase tracking-wide">Year Level</p>
                <p className="font-medium text-orange-800">{profile?.year_level || 'N/A'}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-xs text-orange-600 uppercase tracking-wide">Section</p>
                <p className="font-medium text-orange-800">{profile?.section || 'N/A'}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-xs text-orange-600 uppercase tracking-wide">Status Record</p>
                <p className="font-medium">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    profile?.status_record === 'Regular' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {profile?.status_record || 'N/A'}
                  </span>
                </p>
              </div>
            </div>
          </Card>

          {/* Work Information */}
          <Card title="Work Information" icon={Briefcase}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">Working Student</label>
                <select
                  name="working_student"
                  value={formData.working_student || 'No'}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-orange-200 rounded-lg bg-white text-gray-900 disabled:bg-orange-50 disabled:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              {formData.working_student === 'Yes' && (
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Type of Work</label>
                  <input
                    type="text"
                    name="work_type"
                    value={formData.work_type || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg bg-white text-gray-900 disabled:bg-orange-50 disabled:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Guardian Information */}
          <Card title="Guardian Information" icon={Users}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">Guardian Name</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                  <input
                    type="text"
                    name="guardian_name"
                    value={formData.guardian_name || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg bg-white text-gray-900 disabled:bg-orange-50 disabled:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">Guardian Contact</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                  <input
                    type="tel"
                    name="guardian_contact"
                    value={formData.guardian_contact || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg bg-white text-gray-900 disabled:bg-orange-50 disabled:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
                          </div>
          </Card>
        </div>

        {editMode && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentProfile;
