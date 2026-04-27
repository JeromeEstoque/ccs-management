import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { teachersAPI } from '../../services/api';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';
import { BookOpen, Users, CheckCircle, XCircle, Clock, Loader2, ToggleLeft, ToggleRight, Calendar, User } from 'lucide-react';

const CapstoneManagement = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await teachersAPI.getByUserId(user.id);
      if (response.data.success) {
        setProfile(response.data.teacher);
        setRequests(response.data.teacher.capstoneGroups || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (groupId, status) => {
    try {
      await teachersAPI.updateCapstoneRequest(groupId, status);
      toast.success(`Request ${status.toLowerCase()}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update request');
    }
  };

  const toggleAvailability = async () => {
    try {
      await teachersAPI.toggleCapstoneAvailability(
        profile.id, 
        !profile.capstone_adviser_available
      );
      toast.success('Availability updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const approvedGroups = requests.filter(r => r.status === 'Approved');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-200 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Capstone Advising</span>
            </div>
            <h1 className="text-2xl font-bold">Capstone Management</h1>
            <p className="text-orange-100 text-sm mt-1">Manage capstone group requests and advising</p>
          </div>
          <button
            onClick={toggleAvailability}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              profile?.capstone_adviser_available
                ? 'bg-green-400 text-green-900 hover:bg-green-300'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card-hover">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-secondary-500">Pending Requests</p>
                <p className="text-2xl font-bold text-secondary-800">{pendingRequests.length}</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="card-hover">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-secondary-500">Approved Groups</p>
                <p className="text-2xl font-bold text-secondary-800">{approvedGroups.length}</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="card-hover">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-secondary-500">Total Groups</p>
                <p className="text-2xl font-bold text-secondary-800">{requests.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Pending Requests */}
      <Card title="Pending Requests" icon={Clock}>
        {pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-800">{request.group_name}</h4>
                    <p className="text-sm text-secondary-500">Members: {request.members || 'N/A'}</p>
                    <div className="flex items-center gap-1.5 text-xs text-secondary-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      Requested: {new Date(request.request_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateRequest(request.id, 'Approved')}
                    className="p-2.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    title="Approve"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleUpdateRequest(request.id, 'Rejected')}
                    className="p-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    title="Reject"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-700 mb-2">All Caught Up!</h3>
            <p className="text-secondary-500">No pending capstone requests</p>
          </div>
        )}
      </Card>

      {/* Approved Groups */}
      <Card title="Approved Groups" icon={CheckCircle}>
        {approvedGroups.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Members</th>
                  <th>Approved Date</th>
                </tr>
              </thead>
              <tbody>
                {approvedGroups.map((group) => (
                  <tr key={group.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-secondary-800">{group.group_name}</span>
                      </div>
                    </td>
                    <td className="text-secondary-600">{group.members || 'N/A'}</td>
                    <td>
                      <div className="flex items-center gap-2 text-secondary-600">
                        <Calendar className="w-4 h-4 text-secondary-400" />
                        {group.approval_date ? new Date(group.approval_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state py-16">
            <BookOpen className="w-12 h-12" />
            <p className="text-base font-medium">No approved groups yet</p>
            <p className="text-sm">Approved capstone groups will appear here</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CapstoneManagement;
