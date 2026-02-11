import { z } from 'zod'

export const TodoButtonSpec = {
  id: 'TodoButton',
  Component: 'TodoButton',
}

export const StatsOverviewSpec = {
    id: 'StatsOverview',
    Component: 'StatsOverview',
    schema: z.object({
        totalBets: z.number(),
        winRate: z.number(),
        netPnL: z.number(),
        roi: z.number(),
        currentStreak: z.object({
            type: z.enum(["win", "loss"]),      
            count: z.number(),
        }).required(),
        averageOdds: z.number(),
    }).required()
}