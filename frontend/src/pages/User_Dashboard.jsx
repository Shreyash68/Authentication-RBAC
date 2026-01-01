import { useEffect, useState } from "react"
import { apiRequest } from "../api"
import { useNavigate } from "react-router-dom"

function UserDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserAndTasks = async () => {
      try {
        const user = await apiRequest("/auth/me")

        // 🔐 Role check
        if (user.role !== "user") {
          alert("User access only | Please login to continue")
          navigate("/")
          return
        }

        setCurrentUser(user)

        const tasksData = await apiRequest("/tasks/")
        setTasks(tasksData)

      } catch (error) {
        // 🔥 Show backend error message if available
        alert(error.message || "Please login to continue")
        navigate("/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndTasks()
  }, [navigate])


  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      // Update task status via PATCH
      await apiRequest(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      })

      // Update local state
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ))
    } catch (error) {
      console.error("Failed to update task status:", error)
      alert("Failed to update status: " + (error.message || "Unknown error"))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'done': return 'bg-green-100 text-green-700 border-green-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
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
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
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

  // Calculate stats
  const calculateStats = () => {
    const todo = tasks.filter(t => t.status === 'todo').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const done = tasks.filter(t => t.status === 'done').length

    return { todo, inProgress, done }
  }

  const stats = calculateStats()

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">My Tasks</h1>
              <p className="text-xs text-gray-600">{currentUser?.email || 'User'}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-gray-600">{stats.todo}</div>
            <div className="text-sm text-gray-600">To Do</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600">{stats.done}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">User Access</h3>
            <p className="text-sm text-blue-800">You can view your assigned tasks and update their status. Contact your admin for task modifications.</p>
          </div>
        </div>

        {/* Tasks Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">My Assigned Tasks</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your task status and track progress</p>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left: Task Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{getPriorityIcon(task.priority)}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{task.description || 'No description provided'}</p>

                      <div className="flex flex-wrap gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-gray-500">Priority:</span>
                          <span className={`font-semibold ${getPriorityColor(task.priority)}`}>
                            {getPriorityDisplay(task.priority)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-gray-500">Assigned To:</span>
                          <span className="text-gray-700">{task.assigned_to}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-gray-500">Created By:</span>
                          <span className="text-gray-700">{task.created_by || 'Admin'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Status Update */}
                <div className="md:w-48">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Update Status</label>
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg font-semibold text-sm border-2 focus:outline-none transition-colors ${getStatusColor(task.status)}`}
                  >
                    <option value="todo">📋 To Do</option>
                    <option value="in_progress">⚡ In Progress</option>
                    <option value="done">✅ Done</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Tasks Assigned</h3>
            <p className="text-gray-600">You don't have any tasks assigned yet. Check back later!</p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-3">Need Help?</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span>•</span>
              <span>Update your task status as you progress through your work</span>
            </div>
            <div className="flex items-start gap-2">
              <span>•</span>
              <span>You can only view and update tasks assigned to you</span>
            </div>
            <div className="flex items-start gap-2">
              <span>•</span>
              <span>Contact your admin if you need to modify task details or assignments</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserDashboard