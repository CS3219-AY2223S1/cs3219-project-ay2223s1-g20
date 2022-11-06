import {
  Box,
  Typography
} from '@mui/material'
import React, { useState, useEffect, useMemo } from 'react'
import { getUsername } from '../../api/cookieApi'
import { getHistoryFromUsername } from '../../api/historyApi'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS

function AttemptedQuestions () {
  const difficultyDictionary = {
    Easy: 0,
    Medium: 1,
    Hard: 2
  }

  const createData = ([question, difficulty]) => {
    return { question: question, difficulty: difficulty }
  }

  const convertVhToPx = (vw) => {
    const oneVwInPx = window.innerWidth / 100
    return oneVwInPx * vw
  }

  const [attemptedQns, setAttemptedQns] = useState([])
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const response = getHistoryFromUsername(getUsername())
    response
      .then(res => res.json())
      .then(res => {
        const parsedRes = res.map(item => createData(item))
        setAttemptedQns(parsedRes)
      })
  }, [])

  useEffect(() => {
    const newHeight = 51 + attemptedQns.length * 42
    setHeight(newHeight < 52 ? 150 : newHeight > 800 ? 800 : newHeight)
  }, [attemptedQns])

  const columnDefs = [
    { field: 'question', width: convertVhToPx(40), cellStyle: { fontFamily: "'Source Sans Pro', sans-serif" } },
    {
      field: 'difficulty',
      width: convertVhToPx(19.8),
      comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
        if (valueA === valueB) return 0
        return (difficultyDictionary[valueA] > difficultyDictionary[valueB]) ? 1 : -1
      },
      cellStyle: { fontFamily: "'Source Sans Pro', sans-serif" }
    }
  ]

  const defaultColDef = useMemo(() => ({
    sortable: true
  }))

  const QuestionTable = () => {
    return (
      <div className="ag-theme-alpine" style={{ height: height, width: '100%' }}>
        <AgGridReact
          rowData={attemptedQns}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </div>
    )
  }

  return (
    <Box display={'flex'} flexDirection={'row'} justifyContent="center" alignItems="flex-start" mt={8} mb={6}>
        <Box display={'flex'} flexDirection={'column'} justifyContent="center" alignItems="center" width="60vw">
            <Typography variant={'h2'} class={'poppins'}>Attempted Questions</Typography>
            {attemptedQns && <QuestionTable />}
        </Box>
    </Box>
  )
}

export default AttemptedQuestions
