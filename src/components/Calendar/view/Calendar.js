import { useState, useEffect } from 'react';
import './Calendar.css';


const months = [
  'Янв.',
  'Февр.',
  'Март',
  'Апр.',
  'Май',
  'Июнь',
  'Июль',
  'Авг.',
  'Сент.',
  'Окт.',
  'Нояб.',
  'Дек.',
];


const Calendar = () => {
  const [ calendarData, setCalendarData ] = useState({});

  const getData = async () => {
    const res = await fetch('https://dpg.gg/test/calendar.json');
    const data = await res.json();
    setCalendarData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const renderCalendar = () => {
    const calendar = [];
    const currentDate = new Date(startDate);

    const transposedData = Array.from({ length: 51 }, () => []);

    for (let row = 0; row <= 51; row++) {
      for (let col = 0; col < 7; col++) {
        const dateKey = currentDate.toISOString().split('T')[ 0 ];
        const contributions = calendarData[ dateKey ] || 0;

        transposedData[ col ].push({
          date: dateKey,
          contributions: contributions,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    for (let row = 0; row < 51; row++) {
      const colCells = transposedData[ row ].map((cellData) => {
        const { date, contributions } = cellData;

        let color = '';
        if (contributions >= 30) {
          color = 'dark';
        } else if (contributions >= 20) {
          color = 'darker';
        } else if (contributions >= 10) {
          color = 'slightly-darker';
        } else if (contributions > 0) {
          color = 'light';
        } else if (contributions === 0) {
          color = '#fff';
        }

        return (
          <td
            key={date}
            className={`calendar-cell ${color} ${contributions > 0 ? 'tooltip' : ''}`}
            data-tooltip={`Contributions: ${contributions}\n${date}`}
          >
          </td>
        );
      });
      calendar.push(<tr key={row}>{colCells}</tr>);
    }
    return calendar;
  };

  const rearrangedMonths = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const nextMonth = (currentMonth + 1) % 12;

    const rearranged = months.slice(nextMonth).concat(months.slice(0, nextMonth));
    return rearranged;
  };

  return (
    <div className="wrapper">
      <table className="calendar">
        <thead>

          <tr>
            {rearrangedMonths().map((month) => (
              <th colSpan="4" key={month}>{month}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderCalendar()}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
