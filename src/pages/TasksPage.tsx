import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PlusCircle, FileDown, Trash2, Edit2, X, Save } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Task {
  id: string;
  date: string;
  assignedTo: string;
  previous: string;
  toDo: string;
  status: 'To Do' | 'In Progress' | 'Done';
  remarks: string;
  supportTicket: string;
}

const INITIAL_TASK = {
  date: new Date().toISOString().split('T')[0],
  assignedTo: '',
  previous: '',
  toDo: '',
  status: 'To Do' as const,
  remarks: '',
  supportTicket: ''
};

const EMPLOYEES = [
  'Parth', 'Nakshatra', 'Prem', 'Keshav', 'Pranshu', 'Rishi', 'Mohit'
];

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState(INITIAL_TASK);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState({ employee: '', date: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'tasks'), newTask);
      setNewTask(INITIAL_TASK);
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEdit = async (task: Task) => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, task);
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Previous</label>
            <textarea
              value={newTask.previous}
              onChange={e => setNewTask({ ...newTask, previous: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">To Do</label>
            <textarea
              value={newTask.toDo}
              onChange={e => setNewTask({ ...newTask, toDo: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Remarks/Blocker</label>
            <textarea
              value={newTask.remarks}
              onChange={e => setNewTask({ ...newTask, remarks: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Do</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Support Ticket</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map(task => (
                <tr key={task.id}>
                  {editingTask?.id === task.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={editingTask.date}
                          onChange={e => setEditingTask({ ...editingTask, date: e.target.value })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editingTask.assignedTo}
                          onChange={e => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          {EMPLOYEES.map(emp => (
                            <option key={emp} value={emp}>{emp}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={editingTask.previous}
                          onChange={e => setEditingTask({ ...editingTask, previous: e.target.value })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={2}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={editingTask.toDo}
                          onChange={e => setEditingTask({ ...editingTask, toDo: e.target.value })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={2}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editingTask.status}
                          onChange={e => setEditingTask({ ...editingTask, status: e.target.value as Task['status'] })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={editingTask.remarks}
                          onChange={e => setEditingTask({ ...editingTask, remarks: e.target.value })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={2}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editingTask.supportTicket}
                          onChange={e => setEditingTask({ ...editingTask, supportTicket: e.target.value })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(editingTask)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditingTask(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.assignedTo}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{task.previous}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{task.toDo}</td>
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
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}