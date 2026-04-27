import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentsAPI, teachersAPI } from '../../services/api';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';
import { Users, Search, Eye, Loader2, User, GraduationCap, Mail, Phone } from 'lucide-react';

const AdvisoryStudents = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await teachersAPI.getByUserId(user.id);
      if (response.data && response.data.success) {
        setProfile(response.data.teacher);
        
        // Fetch students in advisory section
        if (response.data.teacher.section_advisory) {
          const studentsRes = await studentsAPI.getBySection(response.data.teacher.section_advisory);
          if (studentsRes.data && studentsRes.data.success) {
            setStudents(studentsRes.data.students);
          } else {
            // Set fallback students data
            const fallbackStudents = [
              {
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
                student_id: '2023-1001',
                email: 'john.doe@ccs.edu',
                year_level: '3rd Year',
                section: 'BSIT-3A',
                gpa: '3.75',
                status_record: 'Regular'
              },
              {
                id: 2,
                first_name: 'Jane',
                last_name: 'Smith',
                student_id: '2023-1002',
                email: 'jane.smith@ccs.edu',
                year_level: '3rd Year',
                section: 'BSIT-3A',
                gpa: '3.85',
                status_record: 'Regular'
              }
            ];
            setStudents(fallbackStudents);
            toast.info('Using sample data. Students service unavailable.');
          }
        }
      } else {
        // Set fallback teacher profile
        const fallbackProfile = {
          id: 1,
          first_name: 'Teacher',
          last_name: 'User',
          email: 'teacher@ccs.edu',
          section_advisory: 'BSIT-3A',
          department: 'Computer Science'
        };
        setProfile(fallbackProfile);
        // Set fallback students
        const fallbackStudents = [
          {
            id: 1,
            first_name: 'Sample',
            last_name: 'Student',
            student_id: '2023-1001',
            email: 'student@ccs.edu',
            year_level: '3rd Year',
            section: 'BSIT-3A',
            gpa: '3.5',
            status_record: 'Regular'
          }
        ];
        setStudents(fallbackStudents);
        toast.info('Using sample data. Teacher service unavailable.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load advisory data');
      // Set fallback data to prevent crashes
      const fallbackProfile = {
        id: 1,
        first_name: 'Teacher',
        last_name: 'User',
        email: 'teacher@ccs.edu',
        section_advisory: 'BSIT-3A',
        department: 'Computer Science'
      };
      setProfile(fallbackProfile);
      const fallbackStudents = [
        {
          id: 1,
          first_name: 'Sample',
          last_name: 'Student',
          student_id: '2023-1001',
          email: 'student@ccs.edu',
          year_level: '3rd Year',
          section: 'BSIT-3A',
          gpa: '3.5',
          status_record: 'Regular'
        }
      ];
      setStudents(fallbackStudents);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    `${s.first_name} ${s.last_name} ${s.student_id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile?.section_advisory) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-200 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Section Advisory</span>
            </div>
            <h1 className="text-2xl font-bold">Advisory Students</h1>
          </div>
        </div>
        <Card>
          <div className="empty-state py-16">
            <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-700 mb-2">No Advisory Section Assigned</h3>
            <p className="text-secondary-500">You are not currently assigned as an adviser to any section.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-blue-100 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">Section Advisory</span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight mb-1">Advisory Students</h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Manage and monitor students in your advisory section: <span className="font-semibold">{profile?.section_advisory || 'N/A'}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Users className="w-5 h-5" />
              <span className="font-bold text-lg">{filteredStudents.length}</span>
              <span className="text-sm">Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass-panel rounded-xl p-6 mb-6">
        <div className="relative max-w-md">
          <label className="label">Search Students</label>
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or student ID..."
              className="input-search"
            />
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((student) => (
          <div key={student.id} className="card-hover">
            <Card>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  {student.profile_picture ? (
                    <img
                      src={student.profile_picture}
                      alt={student.first_name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {student.first_name[0]}{student.last_name[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-secondary-800 truncate">
                    {student.first_name} {student.last_name}
                  </h3>
                  <p className="text-sm text-secondary-500">{student.student_id}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`badge ${
                      student.status_record === 'Regular' ? 'badge-success' : 
                      student.status_record === 'Irregular' ? 'badge-warning' : 'badge-error'
                    }`}>
                      {student.status_record}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-secondary-100 flex items-center gap-4 text-sm text-secondary-500">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>{student.year_level}</span>
                </div>
                {student.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{student.email}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <div className="empty-state py-16">
            <Users className="w-12 h-12" />
            <p className="text-base font-medium">No students found</p>
            <p className="text-sm">Try adjusting your search</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdvisoryStudents;
