import { useEffect, useState } from "react"
import { apiRequest } from "../api"
import { useNavigate } from "react-router-dom"

function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [tasks, setTasks] = useState([])
  const navigate = useNavigate()

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: ''
  })

  useEffect(() => {
    const checkAuthAndFetchTasks = async () => {
      try {
        const me = await apiRequest("/auth/me")

        if (me.role !== "admin") {
          alert("Admin access required")
          navigate("/")
          return
        }

        setIsAuthenticated(true)

        const tasksData = await apiRequest("/tasks")
        setTasks(tasksData)

      } catch (error) {
        // 🔥 THIS IS THE IMPORTANT PART
        if (error.message) {
          alert(error.message)
        } else {
          alert("Authentication failed. Please login again.")
        }

        navigate("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchTasks()
  }, [navigate])

  const handleCreateTask = async () => {
    try {
      // API call to create task - backend sets status to "todo" by default
      const createdTask = await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          assigned_to: newTask.assigned_to
        })
      })

      setTasks([...tasks, createdTask])
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: ''
      })
      setShowCreateModal(false)
    } catch (error) {
      console.error("Failed to create task:", error)
      alert("Failed to create task: " + (error.message || "Unknown error"))
    }
  }

  const handleEditTask = async () => {
    try {
      // API call to update task - using PATCH method
      const updateData = {
        title: selectedTask.title,
        description: selectedTask.description,
        priority: selectedTask.priority,
        status: selectedTask.status,
        assigned_to: selectedTask.assigned_to
      }

      // Remove undefined or null values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key]
        }
      })

      await apiRequest(`/tasks/${selectedTask.id}`, {
        method: "PATCH",
        body: JSON.stringify(updateData)
      })

      // Update local state
      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, ...updateData } : t))
      setShowEditModal(false)
      setSelectedTask(null)
    } catch (error) {
      console.error("Failed to update task:", error)
      alert("Failed to update task: " + (error.message || "Unknown error"))
    }
  }

  const handleDeleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await apiRequest(`/tasks/${id}`, {
        method: "DELETE"
      })

      setTasks(tasks.filter(t => t.id !== id))
    } catch (error) {
      console.error("Failed to delete task:", error)
      alert("Failed to delete task: " + (error.message || "Unknown error"))
    }
  }

  const openEditModal = (task) => {
    setSelectedTask({ ...task })
    setShowEditModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700'
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      case 'done': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'todo': return 'To Do'
      case 'in_progress': return 'In Progress'
      case 'done': return 'Done'
      default: return status
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityDisplay = (priority) => {
    switch (priority) {
      case 'high': return 'High'
      case 'medium': return 'Medium'
      case 'low': return 'Low'
      default: return priority
    }
  }

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST"
      })
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      navigate("/")
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // Calculate stats based on current tasks
  const calculateStats = () => {
    const total = tasks.length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const done = tasks.filter(t => t.status === 'done').length
    const todo = tasks.filter(t => t.status === 'todo').length

    return { total, inProgress, done, todo }
  }

  const stats = calculateStats()

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  // Only render dashboard if authenticated
  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-xl">🛠️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-xs text-gray-600">Full Access Control</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-black">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600">{stats.done}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-gray-600">{stats.todo}</div>
            <div className="text-sm text-gray-600">To Do</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Tasks</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
          >
            <span className="text-xl">+</span> Create Task
          </button>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No tasks found. Create your first task!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Task</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Assigned To</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Created By</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-600">{task.description || 'No description'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{task.assigned_to || 'Unassigned'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                          {getStatusDisplay(task.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                          {getPriorityDisplay(task.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{task.created_by || 'System'}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEditModal(task)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-2xl hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">Create New Task</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                  placeholder="Task title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                  rows="3"
                  placeholder="Task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Assign To Email *</label>
                  <input
                    type="email"
                    value={newTask.assigned_to}
                    onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleCreateTask}
                  disabled={!newTask.title || !newTask.assigned_to}
                  className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Task
                </button>
                <p className="text-xs text-gray-500 mt-2">Note: Status will be automatically set to "To Do"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-2xl hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">Edit Task</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={selectedTask.description || ''}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none bg-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Priority</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Assign To Email *</label>
                <input
                  type="email"
                  value={selectedTask.assigned_to}
                  onChange={(e) => setSelectedTask({ ...selectedTask, assigned_to: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleEditTask}
                  disabled={!selectedTask.title || !selectedTask.assigned_to}
                  className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard