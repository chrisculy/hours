import { IDBPDatabase, openDB, DBSchema } from 'idb';

const timeDatabaseName = "hours_TimeDatabase";
const timeDatabaseVersion = 1;
const dbTableName = "hours";

export const januaryFirst = (() => {
  return new Date(new Date().getFullYear(), 0, 1);
})();

export const dateToString = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const dateValuesToString = (year: number, month: number, date: number) => `${year}-${month}-${date}`;
// const stringToDate = (dateString: string) => {
//   const components = dateString.split('-');
//   return new Date(parseInt(components[0]), parseInt(components[1]), parseInt(components[2]));
// }

export interface TimeDatabaseEntry {
  date: Date,
  hours: number,
  minutes: number,
};

interface TimeDatabaseSchema extends DBSchema {
  hours: {
    key: string,
    value: TimeDatabaseEntry,
  };
}

export class TimeDatabase {
  _db?: IDBPDatabase<TimeDatabaseSchema>;

  async open() {
    this._db = await openDB<TimeDatabaseSchema>(timeDatabaseName, timeDatabaseVersion, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        console.log(`Upgrading hours indexed DB from version ${event.oldVersion} to version ${event.newVersion}...`);
        if (oldVersion === 0 && newVersion === 1) {
          const store = db.createObjectStore(dbTableName, { keyPath: "date" });
          console.log("Inserting base data...");
          const year = new Date().getFullYear();
          const isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
          const days = Array.from({ length: isLeapYear ? 366 : 365}, ( _, i) => i + 1);

          days.forEach(day => {
            const date = januaryFirst;
            date.setDate(day);
            store.add({
              date,
              hours: 0,
              minutes: 0
            });
          })
          console.log("Inserting base data: DONE");
        }
      }
    });
  }

  async getEntries() {
    if (this._db === undefined) {
      throw new Error("Database is not yet open!");
    }

    const entries: TimeDatabaseEntry[] = [];
    let cursor = await this._db.transaction(dbTableName).store.openCursor();
    while (cursor) {
      entries.push(cursor.value);
      cursor = await cursor.continue();
    }

    return entries;
  }

  async setEntry(year: number, month: number, date: number, hours: number, minutes: number) {
    if (this._db === undefined) {
      throw new Error("Database is not yet open!");
    }

    return await this._db.put(dbTableName, { date: new Date(year, month, date), hours, minutes });
  }
}