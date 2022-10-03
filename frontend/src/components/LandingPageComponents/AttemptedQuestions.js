import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Typography
} from '@mui/material'
import React from 'react'

function AttemptedQuestions () {
  function createData (question, difficulty) {
    return { question, difficulty }
  }

  const rows = [
    createData('Two Sum', 'Easy'),
    createData('Add Two Numbers', 'Medium'),
    createData('Median of Two Sorted Arrays', 'Hard')
  ]

  const QuestionTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><Typography style={{ fontWeight: 550 }}>Question</Typography></TableCell>
              <TableCell align="right"><Typography style={{ fontWeight: 550 }}>Difficulty</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.question}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.question}
                </TableCell>
                <TableCell align="right">{row.difficulty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <Box display={'flex'} flexDirection={'row'} justifyContent="center" alignItems="flex-start" minHeight="100vh" mt={8}>
        <Box display={'flex'} flexDirection={'column'} justifyContent="center" alignItems="center" width="40vw">
            <Typography variant={'h2'} class={'poppins'}>Attempted Questions</Typography>
            <QuestionTable />
        </Box>
    </Box>
  )
}

export default AttemptedQuestions
