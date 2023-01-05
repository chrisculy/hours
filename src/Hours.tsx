import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Container, Paper, Typography } from '@mui/material';
import { TimeInput } from './TimeInput';
import { januaryFirst, TimeDatabase, TimeDatabaseEntry } from './TimeDatabase';

const timeDatabase = new TimeDatabase();

const millisecondsPerDay = 1000*60*60*24;

export const Hours: React.FC = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = new Date().getFullYear();

  const [entries, setEntries] = useState<TimeDatabaseEntry[]>();
  const [entryIndex] = useState(() => Math.floor((new Date().getTime() - januaryFirst.getTime()) / millisecondsPerDay));

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
  }

  const setMinutes = (index: number, minutes: number) => {
    if (entries) {
      const newEntries = [...entries];
      newEntries[index].minutes = minutes;

      setTime(entries[index].date, entries[index].hours, minutes);
      setEntries(newEntries);
    }
  }

  const setTime = (date: Date, hours: number, minutes: number) => {
    timeDatabase.setEntry(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
  }

  if (!entries) {
    return <Typography>Loading local data...</Typography>;
  }

  const renderIndex = entryIndex > 0 ?
    entryIndex === entries.length - 1 ? entryIndex - 2 :
    entryIndex - 1 : 0;
  const totalUnsimplifiedMinutes = entries.reduce((accumulator, currentEntry) => accumulator + currentEntry.minutes, 0);
  const totalMinutes = totalUnsimplifiedMinutes % 60;
  const totalHours = entries.reduce((accumulator, currentEntry) => accumulator + currentEntry.hours, 0) + Math.floor(totalUnsimplifiedMinutes / 60);

  return (
    <Container>
      <Typography variant='h3' display='flex' justifyContent='center' marginY={4}>{year}</Typography>
      <Grid container spacing={2}>
        <Grid xs={12} sm={4}>
          <TimeInput
            isFocused={renderIndex === entryIndex}
            header={entries[renderIndex].date.toDateString()}
            hours={entries[renderIndex].hours}
            minutes={entries[renderIndex].minutes}
            onSetHours={(hours) => setHours(renderIndex, hours)}
            onSetMinutes={(minutes) => setMinutes(renderIndex, minutes)} />
        </Grid>
        <Grid xs={12} sm={4}>
          <TimeInput
            isFocused={renderIndex + 1 === entryIndex}
            header={entries[renderIndex + 1].date.toDateString()}
            hours={entries[renderIndex + 1].hours}
            minutes={entries[renderIndex + 1].minutes}
            onSetHours={(hours) => setHours(renderIndex + 1, hours)}
            onSetMinutes={(minutes) => setMinutes(renderIndex + 1, minutes)} />
        </Grid>
        <Grid xs={12} sm={4}>
          <TimeInput
            isFocused={renderIndex + 2 === entryIndex}
            header={entries[renderIndex + 2].date.toDateString()}
            hours={entries[renderIndex + 2].hours}
            minutes={entries[renderIndex + 2].minutes}
            onSetHours={(hours) => setHours(renderIndex + 2, hours)}
            onSetMinutes={(minutes) => setMinutes(renderIndex + 2, minutes)} />
        </Grid>
      </Grid>
      <Typography variant='h4' display='flex' justifyContent='center' marginY={4}>{`Total: ${totalHours} hours, ${totalMinutes} minutes`}</Typography>
    </Container>
  )
}