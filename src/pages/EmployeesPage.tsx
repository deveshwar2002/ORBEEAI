import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Task {
  id: string;
  assignedTo: string;
  title: string;
  status: string;
  date: string;
}

interface EmployeeStats {
  total: number;
  inProgress: number;
  completed: number;
  tasks: Task[];
}

const INITIAL_EMPLOYEES = [
  'Parth', 'Nakshatra', 'Prem', 'Keshav', 'Pranshu', 'Rishi', 'Mohit','Harshit','Shubham'
].map(name => ({
  name,
  email: `${name.toLowerCase()}@company.com`,
  role: 'Developer'
}));

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', role: '' });
  const [employeeStats, setEmployeeStats] = useState<Record<string, EmployeeStats>>({});
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    employees.forEach(employee => {
      fetchEmployeeStats(employee.name);
    });
  }, [employees]);

  const fetchEmployees = async () => {
    try {
      const employeesRef = collection(db, 'employees');
      const querySnapshot = await getDocs(employeesRef);
      
      if (querySnapshot.empty) {
        // If no employees exist, add initial employees
        const newEmployees = await Promise.all(
          INITIAL_EMPLOYEES.map(emp => addDoc(employeesRef, emp))
        );
        setEmployees(newEmployees.map((doc, index) => ({
          id: doc.id,
          ...INITIAL_EMPLOYEES[index]
        })));
      } else {
        setEmployees(querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Employee[]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchEmployeeStats = async (employeeName: string) => {
    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, where('assignedTo', '==', employeeName));
      const querySnapshot = await getDocs(q);
      
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];

      const stats: EmployeeStats = {
        total: tasks.length,
        inProgress: tasks.filter(task => task.status === 'In Progress').length,
        completed: tasks.filter(task => task.status === 'Done').length,
        tasks
      };

      setEmployeeStats(prev => ({
        ...prev,
        [employeeName]: stats
      }));
    } catch (error) {
      console.error('Error fetching employee stats:', error);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding employee:', newEmployee); // Log the new employee data
    try {
      const docRef = await addDoc(collection(db, 'employees'), newEmployee);
      console.log('Employee added with ID:', docRef.id); // Log the document ID
      setEmployees([...employees, { id: docRef.id, ...newEmployee }]);
      setNewEmployee({ name: '', email: '', role: '' });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const toggleExpand = (employeeName: string) => {
    setExpandedEmployee(expandedEmployee === employeeName ? null : employeeName);
  };

  return (
    <div className="space-y-8">
      {/* Add Employee Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Employee</h2>
        <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={newEmployee.name}
              onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={newEmployee.email}
              onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              value={newEmployee.role}
              onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Employee
            </button>
          </div>
        </form>
      </div>

      {/* Employee List */}
      <div className="space-y-4">
        {employees.map(employee => {
          const stats = employeeStats[employee.name] || {
            total: 0,
            inProgress: 0,
            completed: 0,
            tasks: []
          };

          return (
            <div key={employee.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </div>
                  <button
                    onClick={() => toggleExpand(employee.name)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    {expandedEmployee === employee.name ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Total Tasks</p>
                    <p className="mt-2 text-3xl font-semibold text-blue-900">{stats.total}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">In Progress</p>
                    <p className="mt-2 text-3xl font-semibold text-yellow-900">{stats.inProgress}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Completed</p>
                    <p className="mt-2 text-3xl font-semibold text-green-900">{stats.completed}</p>
                  </div>
                </div>

                {expandedEmployee === employee.name && stats.tasks.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Tasks</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {stats.tasks.map(task => (
                            <tr key={task.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.date}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{task.title}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                  ${task.status === 'Done' ? 'bg-green-100 text-green-800' :
                                    task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'}`}>
                                  {task.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}