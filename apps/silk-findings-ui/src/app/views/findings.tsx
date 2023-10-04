import { Typography, Container } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

import useFindings from '../hooks/useFindings'
import { FindingsTable, FindingsSummary } from '../components'

export const Findings = () => {
  const { data } = useFindings()

  return (
    <Container maxWidth={false} sx={{ maxHeight: '100vh'}}>
      <Grid container direction="row" spacing={2}>
        <Grid xs={12}>
          <Typography variant='h1'>Findings</Typography>
          <FindingsSummary findings={data} />
        </Grid>
        <Grid xs={12}>
          <FindingsTable findings={data} />
        </Grid>
      </Grid>
    </Container>
  )
}
