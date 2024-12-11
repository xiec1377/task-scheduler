"use client";
import { useState } from "react";
import axios from "axios";

interface Task {
  name: string;
  difficulty: number;
  priority: number;
}

interface ScheduleItem {
  time: string;
  task: string;
}

export default function TaskForm() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);

  const addTask = () => {
    if (name && difficulty && priority) {
      setTasks([
        ...tasks,
        {
          name,
          difficulty: parseInt(difficulty),
          priority: parseInt(priority),
        },
      ]);
      setName("");
      setDifficulty("");
      setPriority("");
    }
  };

  const generateSchedule = async () => {
    try {
      const response = await axios.post("http://localhost:8000/schedule", {
        tasks,
      });
      setSchedule(response.data.schedule);
    } catch (error) {
      console.error("Error generating schedule:", error);
    }
  };

  return (
    <div className="w-[80vh] p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Scheduler</h1>
      <div className="shadow-md rounded-lg p-6 w-full max-w-lg mb-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Name
            </label>
            <input
              type="text"
              // placeholder="Task Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border bg-transparent border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority (1-10)
            </label>
            <input
              type="number"
              // placeholder="Difficulty (1-10)"
              min="1"
              max="10"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border bg-transparent border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Difficulty (1-10)
            </label>
            <input
              type="number"
              // placeholder="Priority (1-10)"
              min="1"
              max="10"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border bg-transparent border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Time (min)
            </label>
            <input
              type="number"
              // placeholder="Time (min)"
              min="1"
              // value={priority}
              // onChange={(e) => setPriority(e.target.value)}
              className="w-full border bg-transparent  border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addTask}
            className="w-full bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="shadow-md rounded-lg p-6 w-full max-w-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks</h2>
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li key={index} className="rounded-lg p-3 shadow-sm">
              <span className="font-medium">{task.name}</span> (Difficulty:{" "}
              {task.difficulty}, Priority: {task.priority})
            </li>
          ))}
        </ul>
        <button
          onClick={generateSchedule}
          className="mt-4 w-full bg-green-500 text-white rounded-lg p-2 hover:bg-green-600 transition"
        >
          Generate Schedule
        </button>
      </div>

      {schedule && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule</h2>
          <ul className="space-y-2">
            {schedule.map((item, index) => (
              <li key={index} className="bg-gray-100 rounded-lg p-3 shadow-sm">
                {item.time}: {item.task}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
