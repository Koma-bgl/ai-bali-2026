"use client"

import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'

export interface TrendLineChartProps {
  data: {
    date: string
    cumulativePnL: number
    betCount: number
  }[]
  height?: number
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded shadow-md p-2">
        <p className="font-semibold">{formatDate(label)}</p>
        <p>Cumulative P&L: ${payload[0].value.toFixed(2)}</p>
        <p>Bets Settled: {payload[0].payload.betCount}</p>
      </div>
    )
  }

  return null
}

const TrendLineChart = ({ data, height = 300 }: TrendLineChartProps) => {
  const isPositive = data.length > 0 && data[data.length.length - 1].cumulativePnL >= 0

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <XAxis dataKey="date" tickFormatter={formatDate} />
        <YAxis tickFormatter={(value: number) => `$${value.toFixed(0)}`} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
        <Line
          type="monotone"
          dataKey="cumulativePnL"
          stroke={isPositive ? 'green' : 'red'}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default TrendLineChart