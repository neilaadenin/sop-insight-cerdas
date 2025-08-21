'use client'

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, Shield, User, Crown } from 'lucide-react';
import AppLayout from '@/components/AppLayout';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  status: 'active' | 'inactive';
  sopCount: number;
  lastActive: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for users
  const users: UserData[] = [
    {
      id: 1,
      name: 'Budi Santoso',
      email: 'budi@company.com',
      role: 'admin',
      status: 'active',
      sopCount: 15,
      lastActive: '2024-01-20'
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      email: 'siti@company.com',
      role: 'admin',
      status: 'active',
      sopCount: 12,
      lastActive: '2024-01-19'
    },
    {
      id: 3,
      name: 'Ahmad Rahman',
      email: 'ahmad@company.com',
      role: 'employee',
      status: 'active',
      sopCount: 8,
      lastActive: '2024-01-18'
    },
    {
      id: 4,
      name: 'Dewi Sartika',
      email: 'dewi@company.com',
      role: 'employee',
      status: 'active',
      sopCount: 10,
      lastActive: '2024-01-17'
    },
    {
      id: 5,
      name: 'Rudi Hartono',
      email: 'rudi@company.com',
      role: 'employee',
      status: 'active',
      sopCount: 6,
      lastActive: '2024-01-16'
    }
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
          <Crown className="w-3 h-3 mr-1" />
          admin
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
          <User className="w-3 h-3 mr-1" />
          employee
        </Badge>
      );
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge className="bg-green-50 text-green-700 border-green-200">
        {status}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">User Management</h1>
              <p className="text-base text-gray-600">Manage user accounts and permissions</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Users Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Users</h2>
              
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
                />
              </div>
            </div>

            {/* User List */}
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Left Side - Avatar and User Info */}
                      <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-gray-700">
                            {getInitials(user.name)}
                          </span>
                        </div>

                        {/* User Information */}
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{user.sopCount} SOPs assigned</span>
                            <span>•</span>
                            <span>Last active: {user.lastActive}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Role, Status, and Actions */}
                      <div className="flex items-center space-x-4">
                        {/* Role Badge */}
                        {getRoleBadge(user.role)}

                        {/* Status Badge */}
                        {getStatusBadge(user.status)}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-10 h-10 p-0 border-gray-300 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-10 h-10 p-0 border-gray-300 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first user'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
