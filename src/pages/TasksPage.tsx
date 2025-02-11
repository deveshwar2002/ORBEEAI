import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PlusCircle, FileDown, Trash2, Edit2, X, Save } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuthStore } from '../store/authStore';

interface Feature {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface Task {
  id: string;
  date: string;
  assignedTo: string;
  previous: string;
  features: Feature[];
  status: 'To Do' | 'In Progress' | 'Done';
  remarks: string;
  supportTicket: string;
}

const INITIAL_FEATURE = {
  name: '',
  description: '',
  startTime: '',
  endTime: ''
};

const INITIAL_TASK = {
  date: new Date().toISOString().split('T')[0],
  assignedTo: '',
  previous: '',
  features: [{ ...INITIAL_FEATURE }],
  status: 'To Do' as const,
  remarks: '',
  supportTicket: ''
};

const EMPLOYEES = [
  'Parth', 'Nakshatra', 'Prem', 'Keshav', 'Pranshu', 'Rishi', 'Mohit','Harshit','Shubham','Nikita Singh'
];

export function TasksPage() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState(INITIAL_TASK);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState({ employee: '', date: '' });

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const tasksRef = collection(db, 'tasks');
      const querySnapshot = await getDocs(tasksRef);
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];

      const sortedTasks = tasksData.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taskData = {
        ...newTask,
        createdBy: user?.email,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'tasks'), taskData);
      setNewTask(INITIAL_TASK);
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEdit = async (task: Task) => {
    if (!editingTask) return;
    
    try {
      const taskRef = doc(db, 'tasks', task.id);
      const updatedTask = {
        ...editingTask,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email
      };
      await updateDoc(taskRef, updatedTask);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteDoc(doc(db, 'tasks', taskId));
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const addFeature = () => {
    setNewTask({
      ...newTask,
      features: [...newTask.features, { ...INITIAL_FEATURE }]
    });
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const updatedFeatures = [...newTask.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    setNewTask({
      ...newTask,
      features: updatedFeatures
    });
  };

  const removeFeature = (index: number) => {
    if (newTask.features.length > 1) {
      const updatedFeatures = newTask.features.filter((_, i) => i !== index);
      setNewTask({
        ...newTask,
        features: updatedFeatures
      });
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
    XLSX.writeFile(workbook, 'tasks.xlsx');
  };

  const filteredTasks = tasks.filter(task => {
    return (
      (!filter.employee || task.assignedTo === filter.employee) &&
      (!filter.date || task.date === filter.date)
    );
  });

  return (
    <div className="space-y-8">
      {/* Add Task Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={newTask.date}
                onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assigned To</label>
              <select
                value={newTask.assignedTo}
                onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Employee</option>
                {EMPLOYEES.map(emp => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Previous</label>
            <textarea
              value={newTask.previous}
              onChange={e => setNewTask({ ...newTask, previous: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Features</h3>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Another Feature
              </button>
            </div>

            {newTask.features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-700">Feature {index + 1}</h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Feature Name</label>
                    <input
                      type="text"
                      value={feature.name}
                      onChange={e => updateFeature(index, 'name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={feature.description}
                      onChange={e => updateFeature(index, 'description', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={1}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                      type="datetime-local"
                      value={feature.startTime}
                      onChange={e => updateFeature(index, 'startTime', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                      type="datetime-local"
                      value={feature.endTime}
                      onChange={e => updateFeature(index, 'endTime', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={newTask.status}
                onChange={e => setNewTask({ ...newTask, status: e.target.value as Task['status'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Support Ticket</label>
              <input
                type="text"
                value={newTask.supportTicket}
                onChange={e => setNewTask({ ...newTask, supportTicket: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Remarks/Blocker</label>
            <textarea
              value={newTask.remarks}
              onChange={e => setNewTask({ ...newTask, remarks: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={2}
            />
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Task List */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={filter.employee}
                onChange={e => setFilter({ ...filter, employee: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Employees</option>
                {EMPLOYEES.map(emp => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
              <input
                type="date"
                value={filter.date}
                onChange={e => setFilter({ ...filter, date: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                onClick={exportToExcel}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export to Excel
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Support Ticket</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map(task => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.assignedTo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.previous}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-2">
                      {task.features?.map((feature, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded">
                          <p className="font-medium">{feature.name}</p>
                          <p className="text-gray-600">{feature.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(feature.startTime).toLocaleString()} - {new Date(feature.endTime).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${task.status === 'Done' ? 'bg-green-100 text-green-800' :
                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.remarks}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.supportTicket}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Task</h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEdit(editingTask);
            }}>
              <div className="space-y-4">
                {/* Features Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Features</h3>
                    <button
                      type="button"
                      onClick={() => setEditingTask({
                        ...editingTask,
                        features: [...(editingTask.features || []), { ...INITIAL_FEATURE }]
                      })}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Another Feature
                    </button>
                  </div>

                  {(editingTask.features || []).map((feature, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700">Feature {index + 1}</h4>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updatedFeatures = editingTask.features.filter((_, i) => i !== index);
                              setEditingTask({
                                ...editingTask,
                                features: updatedFeatures
                              });
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Feature Name</label>
                          <input
                            type="text"
                            value={feature.name}
                            onChange={e => {
                              const updatedFeatures = [...editingTask.features];
                              updatedFeatures[index] = {
                                ...updatedFeatures[index],
                                name: e.target.value
                              };
                              setEditingTask({
                                ...editingTask,
                                features: updatedFeatures
                              });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            value={feature.description}
                            onChange={e => {
                              const updatedFeatures = [...editingTask.features];
                              updatedFeatures[index] = {
                                ...updatedFeatures[index],
                                description: e.target.value
                              };
                              setEditingTask({
                                ...editingTask,
                                features: updatedFeatures
                              });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows={1}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Time</label>
                          <input
                            type="datetime-local"
                            value={feature.startTime}
                            onChange={e => {
                              const updatedFeatures = [...editingTask.features];
                              updatedFeatures[index] = {
                                ...updatedFeatures[index],
                                startTime: e.target.value
                              };
                              setEditingTask({
                                ...editingTask,
                                features: updatedFeatures
                              });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Time</label>
                          <input
                            type="datetime-local"
                            value={feature.endTime}
                            onChange={e => {
                              const updatedFeatures = [...editingTask.features];
                              updatedFeatures[index] = {
                                ...updatedFeatures[index],
                                endTime: e.target.value
                              };
                              setEditingTask({
                                ...editingTask,
                                features: updatedFeatures
                              });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editingTask.status}
                    onChange={e => setEditingTask({
                      ...editingTask,
                      status: e.target.value as Task['status']
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Remarks</label>
                  <textarea
                    value={editingTask.remarks}
                    onChange={e => setEditingTask({
                      ...editingTask,
                      remarks: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    <Save className="h-4 w-4 inline-block mr-1" />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}