# Task Scheduler
**Status:** In progress...

### Background
I often have trouble planning my day given the myriad of tasks I have to do everyday. I often struggle to figure out which task I should be doing first to optimize my productivity and time.

### Description
Given a list of tasks each with a difficulty 1-10, priority 1-10 and estimated time to complete it, the app will use an algorithm to generate a schedule for you to complete all your tasks.

The algorithm will consider:
- Tasks with higher priorities are to be completed earlier
- More difficult tasks are done earlier in the day
- Tasks are split into intervals where each interval will be capped at 50 minutes, with a 10 minute break between each interval (this follows Pomodoro timer method)

### Frontend
Built in Next.js, Tailwind.CSS

### Backend
Built in Python (Django framework)

### Future features
- Gamify it so the user can earn points/rewards for following the schedule
- User can refresh the schedule to get another outcome
- Store data in database to keep user's history