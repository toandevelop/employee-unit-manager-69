
import { useAppStore } from "@/store";
import { Card, CardContent } from "../ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { WorkShift } from "@/types";

interface WorkShiftBarProps {
  shifts: WorkShift[];
}

export function WorkShiftBar({ shifts }: WorkShiftBarProps) {
  // Transform data for chart
  const chartData = shifts.map(shift => {
    const startHour = parseInt(shift.startTime.split(':')[0]);
    const endHour = parseInt(shift.endTime.split(':')[0]);
    const duration = endHour - startHour;
    
    return {
      name: shift.name,
      duration: duration > 0 ? duration : 24 + duration, // Handle overnight shifts
      startTime: shift.startTime,
      endTime: shift.endTime,
    };
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis 
              dataKey="name" 
              stroke="#888888" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Giờ', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background p-2 border rounded shadow">
                      <div className="font-bold">{payload[0].payload.name}</div>
                      <div>Thời gian: {payload[0].payload.startTime} - {payload[0].payload.endTime}</div>
                      <div>Số giờ: {payload[0].value} giờ</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="duration" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
