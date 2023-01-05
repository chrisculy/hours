import React from "react";
import { Box, Paper, Stack, TextField, Typography } from "@mui/material";

export interface TimeInputProps {
  isFocused?: boolean;
  header: string;
  hours: number;
  minutes: number;
  onSetHours: (hours: number) => void;
  onSetMinutes: (minutes: number) => void;
}

const focusedBackgroundColor = "#D5D5D5";

export const TimeInput: React.FC<TimeInputProps> = (props) => {
  const onSetHours = (hours: number) => props.onSetHours(hours);
  const onSetMinutes = (minutes: number) => props.onSetMinutes(minutes);

  return (
    <Paper elevation={props.isFocused ? 6 : 1}>
      <Box
        padding={2}
        bgcolor={props.isFocused ? focusedBackgroundColor : undefined}
      >
        <Typography variant="h6" marginY={2}>
          {props.header}
        </Typography>
        <Stack spacing={1}>
          <TextField
            label="Hours"
            type="number"
            margin="normal"
            onChange={(event) => onSetHours(parseInt(event.target.value))}
            value={props.hours}
          />
          <TextField
            label="Minutes"
            type="number"
            margin="normal"
            onChange={(event) => onSetMinutes(parseInt(event.target.value))}
            value={props.minutes}
          />
        </Stack>
      </Box>
    </Paper>
  );
};
