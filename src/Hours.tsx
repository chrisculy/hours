import React, { useEffect, useState } from "react";
import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { Container, IconButton, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TimeInput } from "./TimeInput";
import { januaryFirst, TimeDatabase, TimeDatabaseEntry } from "./TimeDatabase";

const timeDatabase = new TimeDatabase();

const millisecondsPerDay = 1000 * 60 * 60 * 24;

export const Hours: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const year = new Date().getFullYear();

  const [entries, setEntries] = useState<TimeDatabaseEntry[]>();
  const [entryIndex, setEntryIndex] = useState(() =>
    Math.floor(
      (new Date().getTime() - januaryFirst.getTime()) / millisecondsPerDay
    )
  );

  useEffect(() => {
    async function getTimeEntries() {
      await timeDatabase.open();
      const timeDatabaseEntries = await timeDatabase.getEntries();
      setEntries(timeDatabaseEntries);
    }

    getTimeEntries();
  }, []);

  const setHours = (index: number, hours: number) => {
    if (entries) {
      const newEntries = [...entries];
      newEntries[index].hours = hours;

      setTime(entries[index].date, hours, entries[index].minutes);
      setEntries(newEntries);
    }
  };

  const setMinutes = (index: number, minutes: number) => {
    if (entries) {
      const newEntries = [...entries];
      newEntries[index].minutes = minutes;

      setTime(entries[index].date, entries[index].hours, minutes);
      setEntries(newEntries);
    }
  };

  const setTime = (date: Date, hours: number, minutes: number) => {
    timeDatabase.setEntry(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes
    );
  };

  const previousEntry = () => {
    if (entries && entryIndex > 0) {
      setEntryIndex(entryIndex - 1);
    }
  };

  const nextEntry = () => {
    if (entries && entryIndex < entries.length) {
      setEntryIndex(entryIndex + 1);
    }
  };

  if (!entries) {
    return <Typography>Loading local data...</Typography>;
  }

  const renderIndex =
    entryIndex > 0
      ? entryIndex === entries.length - 1
        ? entryIndex - 2
        : entryIndex - 1
      : 0;
  const totalUnsimplifiedMinutes = entries.reduce(
    (accumulator, currentEntry) => accumulator + currentEntry.minutes,
    0
  );
  const totalMinutes = totalUnsimplifiedMinutes % 60;
  const totalHours =
    entries.reduce(
      (accumulator, currentEntry) => accumulator + currentEntry.hours,
      0
    ) + Math.floor(totalUnsimplifiedMinutes / 60);

  const previousIcon = isSmallScreen ? (
    <KeyboardArrowLeft />
  ) : (
    <KeyboardArrowUp />
  );
  const nextIcon = isSmallScreen ? (
    <KeyboardArrowRight />
  ) : (
    <KeyboardArrowDown />
  );
  return (
    <Container>
      <Typography
        variant="h3"
        display="flex"
        justifyContent="center"
        marginY={4}
      >
        {year}
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={12} sm={1} display="flex" justifyContent="center" alignItems="center">
          <IconButton size="large" onClick={() => previousEntry()}>
            {previousIcon}
          </IconButton>
        </Grid>
        <Grid xs={12} sm={3}>
          <TimeInput
            isFocused={renderIndex === entryIndex}
            header={entries[renderIndex].date.toDateString()}
            hours={entries[renderIndex].hours}
            minutes={entries[renderIndex].minutes}
            onSetHours={(hours) => setHours(renderIndex, hours)}
            onSetMinutes={(minutes) => setMinutes(renderIndex, minutes)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <TimeInput
            isFocused={renderIndex + 1 === entryIndex}
            header={entries[renderIndex + 1].date.toDateString()}
            hours={entries[renderIndex + 1].hours}
            minutes={entries[renderIndex + 1].minutes}
            onSetHours={(hours) => setHours(renderIndex + 1, hours)}
            onSetMinutes={(minutes) => setMinutes(renderIndex + 1, minutes)}
          />
        </Grid>
        <Grid xs={12} sm={3}>
          <TimeInput
            isFocused={renderIndex + 2 === entryIndex}
            header={entries[renderIndex + 2].date.toDateString()}
            hours={entries[renderIndex + 2].hours}
            minutes={entries[renderIndex + 2].minutes}
            onSetHours={(hours) => setHours(renderIndex + 2, hours)}
            onSetMinutes={(minutes) => setMinutes(renderIndex + 2, minutes)}
          />
        </Grid>
        <Grid xs={12} sm={1} display="flex" justifyContent="center" alignItems="center">
          <IconButton size="large" onClick={() => nextEntry()}>
            {nextIcon}
          </IconButton>
        </Grid>
      </Grid>
      <Typography
        variant="h4"
        display="flex"
        justifyContent="center"
        marginY={4}
      >{`Total: ${totalHours} hours, ${totalMinutes} minutes`}</Typography>
    </Container>
  );
};
