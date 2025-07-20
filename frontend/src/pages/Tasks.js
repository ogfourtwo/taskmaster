import { useEffect, useState } from "react";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "Medium",
    assignees: "",
    manager: "",
    meeting_minutes: "",
    parent_task: "",
  });

  const [minutesOptions, setMinutesOptions] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/tasks/")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Fetch dropdown data when modal opens
  useEffect(() => {
    if (showModal) {
      axios
        .get("http://localhost:8000/api/meeting-minutes/")
        .then((res) => setMinutesOptions(res.data))
        .catch((err) => console.error("Error fetching meeting minutes:", err));

      axios
        .get("http://localhost:8000/api/tasks/")
        .then((res) => setTaskOptions(res.data))
        .catch((err) => console.error("Error fetching task options:", err));
    }
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      assignees: formData.assignees
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id)),
      manager: parseInt(formData.manager),
      meeting_minutes: formData.meeting_minutes || null,
      parent_task: formData.parent_task || null,
    };

    try {
      await axios.post("http://localhost:8000/api/tasks/", dataToSend);
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      console.error("Error creating task:", err.response?.data || err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">✅ Tasks</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + New Task
      </button>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-2 rounded">
            <strong>{task.title}</strong> — {task.priority}
          </li>
        ))}
      </ul>

      {/* Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-lg w-[400px] space-y-4"
          >
            <h2 className="text-lg font-semibold">Create New Task</h2>

            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="border w-full p-2 rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
            <input
              type="datetime-local"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              name="assignees"
              placeholder="Assignee IDs (comma-separated)"
              value={formData.assignees}
              onChange={handleChange}
              className="border w-full p-2 rounded"
              required
            />
            <input
              name="manager"
              placeholder="Manager ID"
              value={formData.manager}
              onChange={handleChange}
              className="border w-full p-2 rounded"
              required
            />

            <select
              name="meeting_minutes"
              value={formData.meeting_minutes}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            >
              <option value="">— Link to Meeting Minutes (optional) —</option>
              {minutesOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title || `Meeting ${m.id}`}
                </option>
              ))}
            </select>

            <select
              name="parent_task"
              value={formData.parent_task}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            >
              <option value="">— Parent Task (optional) —</option>
              {taskOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Tasks;
