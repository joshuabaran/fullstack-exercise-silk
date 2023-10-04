import { useMemo } from 'react'
import { Box, Paper, Typography, Container } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { Tooltip, TooltipProps, Legend, PieChart, Pie, Cell } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

import { IFinding } from '@silk-libs/finding-types'

interface IFindingsSummaryProps {
  findings: IFinding[] | null
}

interface IChartSlice {
  severity: 'critical' | 'high' | 'medium' | 'low'
  count: number
  fill: string
}

const pieDefaultData: IChartSlice[] = [
  { severity: 'critical', count: 0, fill: '#ff0000' },
  { severity: 'high', count: 0, fill: '#ff9900' },
  { severity: 'medium', count: 0, fill: '#ffff00' },
  { severity: 'low', count: 0, fill: '#00ff00' }
]

const MaterialTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active) {
    return (
      <Paper sx={{ p:2 }}>
        <Typography variant="body2">{`${payload?.[0].value}`}</Typography>
      </Paper>
    )
  }

  return null
}

export const FindingsSummary = (props: IFindingsSummaryProps) => {
  const { findings } = props

  const chartData = useMemo(() => findings?.reduce((severities, finding) => {
    finding.raw.forEach((raw) => {
      const { severity } = raw
      if (severity) {
        const idx = severities.findIndex((s) => s.severity === severity)
        if (idx >= 0) {
          severities[idx].count++
        }
      }
    })

    return severities
  }, pieDefaultData) || pieDefaultData, [findings])

  const totalRawFindings = useMemo(() => findings?.reduce((count, finding) => count + finding.raw.length, 0), [findings])

  return (
    <Box sx={{ height: { xs: 700, md: 500 } }}>
      <Container sx={{ p: 2 }} maxWidth="xl">
        <Grid container direction="row" spacing={2}>
          <Grid xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'start', md: 'end' } }}>
                <Typography variant="h6">Findings Summary</Typography>
                <Typography variant="body2">Total groups: {findings?.length}</Typography>
                <Typography variant="body2">Total raw findings: {totalRawFindings}</Typography>
                <Typography variant="body2">Critical: {chartData[0].count}</Typography>
                <Typography variant="body2">High: {chartData[1].count}</Typography>
                <Typography variant="body2">Medium: {chartData[2].count}</Typography>
                <Typography variant="body2">Low: {chartData[3].count}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PieChart width={400} height={400}>
                  <Pie data={chartData} dataKey="count" nameKey="severity" cx="50%" cy="50%" outerRadius={180} legendType="triangle" >
                    {chartData.map((entry, index) => (
                      <Cell style={{outline: 'none'}} key={`cell-${index}`} fill={entry.fill} stroke="#000" />
                    ))}
                  </Pie>
                  <Tooltip content={<MaterialTooltip />} animationEasing="ease-in-out" animationDuration={360} />
                  <Legend />
                </PieChart>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
