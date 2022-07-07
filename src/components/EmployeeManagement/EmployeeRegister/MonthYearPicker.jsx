import * as React from 'react';
import moment from 'moment';
import { TextField, Box } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

export default function MonthYearPicker(props) {
    const { label, onChange, value } = props
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box m={2} style={{  }}>
        <DatePicker
          inputFormat="yyyy-MM"
          views={['year', 'month']}
          label={label}
          minDate={new Date('1950-01-01')}
          maxDate={new Date(moment.utc(new Date()).format("YYYY-MM-DD"),)}
          value={value}
          onChange={onChange}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
      </Box>
    </LocalizationProvider>
  );
}
