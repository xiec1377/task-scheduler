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
  start: string;
  end: string;
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

  const convertToDateInLocalTimeZone = (timeString: string) => {
    // Get today's date in local time zone
    const today = new Date();

    // Construct a new Date object with today's date and the time from item.start
    const [hours, minutes] = timeString.split(":").map(Number);

    // Create a new Date object using today's date and the provided time
    const localTimeDate = new Date(today.setHours(hours, minutes, 0, 0));

    return localTimeDate;
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
          start: convertToDateInLocalTimeZone(item.start),
          end: convertToDateInLocalTimeZone(item.end),
        }))
      );
    } catch (error) {
      console.error("Error generating schedule:", error);
    }
  };
  console.log("schedule:", schedule);

  if (schedule && schedule.length > 0) {
    console.log("Type of first schedule item start:", typeof schedule[0].start);
  } else {
    console.log("No schedule items available");
  }

  const testschedule = [
    {
      title: "Meeting with Team",
      start: new Date(2025, 1, 19, 9, 0), // February 19, 2025 at 9:00 AM
      end: new Date(2025, 1, 19, 10, 0), // February 19, 2025 at 10:00 AM
      allDay: false,
    },
    {
      title: "Project Deadline",
      start: new Date(2025, 1, 19, 12, 0), // February 19, 2025 at 12:00 PM
      end: new Date(2025, 1, 19, 13, 0), // February 19, 2025 at 1:00 PM
      allDay: false,
    },
    {
      title: "Lunch Break",
      start: new Date(2025, 1, 19, 13, 0), // February 19, 2025 at 1:00 PM
      end: new Date(2025, 1, 19, 14, 0), // February 19, 2025 at 2:00 PM
      allDay: false,
    },
    {
      title: "Client Call",
      start: new Date(2025, 1, 19, 15, 0), // February 19, 2025 at 3:00 PM
      end: new Date(2025, 1, 19, 16, 0), // February 19, 2025 at 4:00 PM
      allDay: false,
    },
    {
      title: "End of Day Wrap-Up",
      start: new Date(2025, 1, 19, 17, 0), // February 19, 2025 at 5:00 PM
      end: new Date(2025, 1, 19, 18, 0), // February 19, 2025 at 6:00 PM
      allDay: false,
    },
  ];

  console.log("Testschedule", testschedule, typeof testschedule[0].start);

  const localizer = momentLocalizer(moment);

  return (
    <div className="w-[90vw] p-6 flex flex-col items-center gap-4">
      <h1 className="w-full text-3xl font-bold text-center text-white mb-6">
        Task Scheduler
      </h1>
      <div className="w-full flex flex-row items-start justify-center gap-4">
        <div className="w-1/3 flex flex-col items-start gap-4">
          <div className="bg-white/20 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-8 shadow-md rounded-lg p-6 w-full">
            <h2 className="text-xl font-semibold text-white mb-4">
              Create a new task
            </h2>
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
          <div className="bg-white/20 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-8 shadow-md rounded-lg p-6 w-full">
            <h2 className="text-xl font-semibold text-white mb-4">Todos</h2>
            <ul className="space-y-2">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className="bg-white/20 rounded-lg p-3 shadow-sm"
                >
                  <label>
                    <input type="checkbox" />
                    <span className="font-medium">{task.name} </span>
                  </label>
                  <p>
                    Difficulty: {task.difficulty} | Priority: {task.priority} |
                    Time: {task.time}
                  </p>
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
        </div>
        <Calendar
          localizer={localizer}
          events={schedule ?? []}
          selectable={true}
          startAccessor="start"
          endAccessor="end"
          view="day"
          className="bg-white/20 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-8 shadow-md rounded-lg p-6 w-2/3 h-[100vh] text-white"
        />
      </div>

      {/* {schedule && (
        <div className="bg-white/20 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-8 shadow-md rounded-lg p-6 w-full">
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
      )} */}
    </div>
  );
}
