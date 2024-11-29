"use client"
import { useState } from 'react';
import axios from 'axios';

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
  const [name, setName] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);

  const addTask = () => {
    if (name && difficulty && priority) {
      setTasks([
        ...tasks,
        { name, difficulty: parseInt(difficulty), priority: parseInt(priority) }
      ]);
      setName('');
      setDifficulty('');
      setPriority('');
    }
  };

  const generateSchedule = async () => {
    try {
      const response = await axios.post('http://localhost:8000/schedule', { tasks });
      setSchedule(response.data.schedule);
    } catch (error) {
      console.error('Error generating schedule:', error);
    }
  };

  return (
    <div>
      <h1>Task Scheduler</h1>
      <div>
        <input
          type="text"
          placeholder="Task Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Difficulty (1-10)"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        />
        <input
          type="number"
          placeholder="Priority (1-10)"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div>
        <h2>Tasks</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              {task.name} (Difficulty: {task.difficulty}, Priority: {task.priority})
            </li>
          ))}
        </ul>
        <button onClick={generateSchedule}>Generate Schedule</button>
      </div>
      {schedule && (
        <div>
          <h2>Schedule</h2>
          <ul>
            {schedule.map((item, index) => (
              <li key={index}>
                {item.time}: {item.task}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
