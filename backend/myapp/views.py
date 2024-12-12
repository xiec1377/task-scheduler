import json

# import datetime
from datetime import datetime, date, time, timedelta
from operator import itemgetter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MyModel
from .serializers import MyModelSerializer


class MyModelView(APIView):
    def get(self, request):
        items = MyModel.objects.all()
        serializer = MyModelSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("we in post....")
        print("body:", request.body)
        raw_data = request.body.decode("utf-8")

        print("Raw data received:", raw_data)

        print("Parsed data (request.data):", request.data)
        try:
            parsed_data = json.loads(raw_data)
            print("parsed data:", parsed_data)
            schedule = []
            # start = time(8, 0, 0)
            start_time = datetime.strptime("8:00am", "%I:%M%p")
            print("start_Time:", start_time)
            # for key, value in parsed_data.items():
            #     print("key:", key)
            #     print("value:", value)
            # for task in parsed_data:
            #     print("task:", task)
            # sorted_priority = json.dumps(
            #     {k: v for k, v in sorted(task.items(), key=lambda item: item[1]) where k }
            # )
            sorted_priority = json.dumps(
                sorted(parsed_data, key=itemgetter("priority"))
            )
            print("sorted_priority", sorted_priority)
            sorted_difficulty = sorted(
                parsed_data, key=lambda k: (k["priority"], (k["difficulty"]))
            )
            print("sorted difficulty:", sorted_difficulty)
            schedule.append((start_time.time(), sorted_difficulty[0]["name"]))
            for i in range(1, len(sorted_difficulty)):
                print("task name:", sorted_difficulty[i]["name"])
                print("task time:", sorted_difficulty[i]["time"])
                time_change = sorted_difficulty[i]["time"] or 1
                task_time = timedelta(minutes=time_change)
                updated_time = start_time + task_time
                schedule.append(
                    (
                        updated_time.time(),
                        sorted_difficulty[i]["name"],
                        # sorted_difficulty[i].get("priority", "N/A"),
                        # sorted_difficulty[i].get("difficulty", "N/A"),
                    )
                )
                start_time = updated_time
            # for task in schedule:
            #     print(f"{task[0]} : {task[1]} - {task[2]} - {task[3]}")
            response = [{"time": time, "task": task} for time, task in schedule]
        except json.JSONDecodeError as e:
            return Response(
                {"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(response, status=status.HTTP_201_CREATED)
        # serializer = MyModelSerializer(data=request.data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
