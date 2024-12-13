"use client";
import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface Task {
  name: string;
  difficulty: number;
  priority: number;
  time: number;
}

interface ScheduleItem {
  // start: Date | null;
  // end: Date | null;
  // title: string | ChildProcessWithoutNullStreams;
  title: string;
  start: Date;
  end: Date;
}

export default function TaskForm() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [timeRequired, setTime] = useState<string>("");
  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);

  const addTask = () => {
    if (name && difficulty && priority) {
      setTasks([
        ...tasks,
        {
          name,
          difficulty: parseInt(difficulty),
          priority: parseInt(priority),
          time: parseInt(timeRequired),
        },
      ]);
      setName("");
      setDifficulty("");
      setPriority("");
      setTime("");
    }
  };

  const generateSchedule = async () => {
    console.log("generating schedule....");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/mymodel/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      console.log("result:", result);
      // setSchedule(result);
      setSchedule(
        result?.map((item: ScheduleItem) => ({
          title: item.title,
          start: new Date(
            new Date().toISOString().split("T")[0] + "T" + item.start
          ),
          end: new Date(
            new Date().toISOString().split("T")[0] + "T" + item.end
          ),
        }))
      );
    } catch (error) {
      console.error("Error generating schedule:", error);
    }
  };
  console.log("schedule:", schedule);
  // const myEventsList = schedule;
  // const myEventsList = [
  //   {
  //     title: "Meeting with Team",
  //     start: new Date(2024, 11, 12, 10, 0), // Dec 12, 2024, 10:00 AM
  //     end: new Date(2024, 11, 12, 11, 0), // Dec 12, 2024, 11:00 AM
  //   },
  //   {
  //     title: "Project Deadline",
  //     start: new Date(2024, 11, 15, 9, 0), // Dec 15, 2024, 9:00 AM
  //     end: new Date(2024, 11, 15, 17, 0), // Dec 15, 2024, 5:00 PM
  //   },
  // ];

  const localizer = momentLocalizer(moment);

  return (
    <div className="w-[80vh] p-6 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold text-white mb-6">Task Scheduler</h1>
      <div className="bg-white/20 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-8 shadow-md rounded-lg p-6 w-full max-w-lg">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-white mb-1"
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
              className="block text-sm font-medium text-white mb-1"
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
              className="block text-sm font-medium text-white mb-1"
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
              htmlFor="time"
              className="block text-sm font-medium text-white mb-1"
            >
              Time (min)
            </label>
            <input
              id="time"
              type="number"
              // placeholder="Time (min)"
              min="1"
              // value={time}
              onChange={(e) => setTime(e.target.value)}
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
      <Calendar
        localizer={localizer}
        events={schedule ?? []}
        selectable={true} 
        startAccessor="start"
        endAccessor="end"
        view="day"
        style={{ height: 500 }}
        className="bg-white/20 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-8 shadow-md rounded-lg p-6 w-full max-w-lg text-white"
      />
      <div className="bg-white/20 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-8 shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Tasks</h2>
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li key={index} className="rounded-lg p-3 shadow-sm">
              <span className="font-medium">{task.name}</span> (Difficulty:{" "}
              {task.difficulty}, Priority: {task.priority}, Time: {task.time})
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
        <div className="bg-white/20 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-8 shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Schedule</h2>
          <ul className="space-y-2">
            {schedule?.map((item, index) => (
              <li key={index} className="rounded-lg p-3 shadow-sm ">
                {item.title} :{" "}
                {new Date().toISOString().split("T")[0] + "T" + item.start}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
