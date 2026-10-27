import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatVolume } from '../../utils/format'

export default function WeeklyChart({ data = [], height = 230 }) {
  return (
    <div style={{ height }} className="w-full" aria-label="Water consumed over the last seven days">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 2, left: -28, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#edf3f7" strokeDasharray="4 4" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#7a93a3', fontSize: 12, fontWeight: 700 }} dy={9} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9aabb6', fontSize: 10 }} />
          <Tooltip cursor={{ fill: '#f2faff' }} formatter={(value) => [formatVolume(value), 'Consumed']} contentStyle={{ border: 0, borderRadius: 16, boxShadow: '0 12px 30px rgba(16,42,61,.12)', fontSize: 12 }} />
          <Bar dataKey="total_ml" fill="#36a9e1" radius={[8, 8, 8, 8]} maxBarSize={34} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
