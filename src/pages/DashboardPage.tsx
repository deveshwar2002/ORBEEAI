import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  CheckCircle, Clock, ListTodo, TrendingUp, 
  AlertTriangle, Award, Calendar, MessageSquare 
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { differenceInDays, parseISO } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

interface Task {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  assignedTo: string;
  date: string;
  remarks: string;
  supportTicket: string;
}

interface EmployeeStats {
  completed: number;
  inProgress: number;
  total: number;
}

interface TaskAging {
  date: string;
  count: number;
}

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState({
    completionRate: 0,
    avgCompletionTime: 0,
    totalTasks: 0,
    totalTickets: 0,
  });
  const [employeeStats, setEmployeeStats] = useState<Record<string, EmployeeStats>>({});
  const [taskAging, setTaskAging] = useState<TaskAging[]>([]);

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
      calculateMetrics(tasksData);
      calculateEmployeeStats(tasksData);
      calculateTaskAging(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const calculateMetrics = (tasksData: Task[]) => {
    const completedTasks = tasksData.filter(task => task.status === 'Done');
    const completionRate = tasksData.length > 0 
      ? (completedTasks.length / tasksData.length) * 100 
      : 0;

    const ticketsCount = tasksData.filter(task => task.supportTicket).length;

    // Calculate average completion time (simplified version)
    const avgTime = completedTasks.length > 0
      ? completedTasks.reduce((acc, task) => {
          const days = differenceInDays(new Date(), parseISO(task.date));
          return acc + days;
        }, 0) / completedTasks.length
      : 0;

    setMetrics({
      completionRate: Math.round(completionRate),
      avgCompletionTime: Math.round(avgTime),
      totalTasks: tasksData.length,
      totalTickets: ticketsCount,
    });
  };

  const calculateEmployeeStats = (tasksData: Task[]) => {
    const stats: Record<string, EmployeeStats> = {};
    
    tasksData.forEach(task => {
      if (!stats[task.assignedTo]) {
        stats[task.assignedTo] = { completed: 0, inProgress: 0, total: 0 };
      }
      
      stats[task.assignedTo].total++;
      if (task.status === 'Done') {
        stats[task.assignedTo].completed++;
      } else if (task.status === 'In Progress') {
        stats[task.assignedTo].inProgress++;
      }
    });

    setEmployeeStats(stats);
  };

  const calculateTaskAging = (tasksData: Task[]) => {
    const aging = tasksData
      .filter(task => task.status !== 'Done')
      .map(task => ({
        date: task.date,
        count: differenceInDays(new Date(), parseISO(task.date))
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);

    setTaskAging(aging);
  };

  // Chart Data
  const completionRateData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [metrics.completionRate, 100 - metrics.completionRate],
      backgroundColor: ['#22c55e', '#e11d48'],
    }]
  };

  const employeeProductivityData = {
    labels: Object.keys(employeeStats),
    datasets: [{
      label: 'Completed Tasks',
      data: Object.values(employeeStats).map(stat => stat.completed),
      backgroundColor: '#3b82f6',
    }]
  };

  const taskAgingData = {
    labels: taskAging.map(t => `${t.count} days`),
    datasets: [{
      label: 'Tasks',
      data: taskAging.map(() => 1),
      backgroundColor: '#f59e0b',
      borderColor: '#f59e0b',
    }]
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <TrendingUp size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Clock size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Completion Time</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.avgCompletionTime} days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <ListTodo size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <MessageSquare size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Support Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalTickets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task Completion Rate</h3>
          <div className="h-64">
            <Pie data={completionRateData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Productivity</h3>
          <div className="h-64">
            <Bar 
              data={employeeProductivityData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task Aging</h3>
          <div className="h-64">
            <Line 
              data={taskAgingData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Employee Leaderboard */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Leaderboard</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(employeeStats)
                  .sort(([, a], [, b]) => b.completed - a.completed)
                  .map(([employee, stats]) => (
                    <tr key={employee}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={`https://ui-avatars.com/api/?name=${employee}&background=0D8ABC&color=fff`}
                              alt={employee}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{stats.completed}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{stats.inProgress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}