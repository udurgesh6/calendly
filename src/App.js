import React, { useEffect, useState } from "react";
import "./App.css";
import Calendar from "color-calendar";
import "color-calendar/dist/css/theme-glass.css";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

function App() {
  const [datesBooked, setDatesBooked] = useState([
    {
      id: 1,
      name: "French class",
      start: "2022-09-17T06:00:00",
      end: "2022-09-18T20:30:00",
    },
    {
      id: 2,
      name: "Blockchain 101",
      start: "2022-09-20T10:00:00",
      end: "2022-09-20T11:30:00",
    },
  ]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  const [bookSchedule, setBookSchedule] = useState({
    id: "",
    name: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    new Calendar({
      id: "#myCal",
      theme: "glass",
      weekdayType: "long-upper",
      monthDisplayType: "long",
      calendarSize: "small",
      layoutModifiers: ["month-left-align"],
      eventsData: datesBooked,
      dateChanged: (currentDate, events) => {
        setSelectedDateEvents(events);
      },
      monthChanged: (currentDate, events) => {
        // console.log("month change", currentDate, events);
      },
    });
  }, [datesBooked]);

  const onScheduling = (e) => {
    e.preventDefault();
    if (
      bookSchedule.name.length < 1 ||
      bookSchedule.start_date.length !== 10 ||
      bookSchedule.end_date.length !== 10 ||
      bookSchedule.start_time.length !== 5 ||
      bookSchedule.end_time.length !== 5
    ) {
      alert("Please enter valid date and time for start and end date time");
    } else {
      let prob = datesBooked.filter(
        (db) =>
          (new Date(bookSchedule.start_date + "T" + bookSchedule.start_time) <=
            new Date(db.start) &&
            new Date(bookSchedule.end_date + "T" + bookSchedule.end_time) >=
              new Date(db.end)) ||
          (new Date(bookSchedule.start_date + "T" + bookSchedule.start_time) >=
            new Date(db.start) &&
            new Date(bookSchedule.end_date + "T" + bookSchedule.end_time) <=
              new Date(db.end)) ||
          (new Date(bookSchedule.start_date + "T" + bookSchedule.start_time) <=
            new Date(db.start) &&
            new Date(bookSchedule.end_date + "T" + bookSchedule.end_time) >=
              new Date(db.start)) ||
          (new Date(bookSchedule.start_date + "T" + bookSchedule.start_time) >=
            new Date(db.start) &&
            new Date(bookSchedule.start_date + "T" + bookSchedule.start_time) <=
              new Date(db.end))
      );
      console.log(prob);
      if (prob.length > 0) {
        alert("Sessions already booked for the selected date and time");
      } else {
        if (
          new Date(bookSchedule.start_date + "T" + bookSchedule.start_time) >=
          new Date(bookSchedule.end_date + "T" + bookSchedule.end_time)
        ) {
          alert("Start date and time should be less than end date and time");
        } else {
          setDatesBooked([
            ...datesBooked,
            {
              id: new Date().valueOf(),
              name: bookSchedule.name,
              start:
                bookSchedule.start_date + "T" + bookSchedule.start_time + ":00",
              end: bookSchedule.end_date + "T" + bookSchedule.end_time + ":00",
            },
          ]);
          alert("Event booked successfuly");
          setBookSchedule({
            id: "",
            name: "",
            start_date: "",
            end_date: "",
            start_time: "",
            end_time: "",
          });
          handleClose();
        }
      }
    }
  };

  const deleteSession = (id) => {
    let temp = datesBooked.filter((db) => db.id > id);
    setDatesBooked(temp);
  };

  // For Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="App">
      <div className="calendar__selectedDate__details">
        <div id="myCal"></div>
        <div className="selectedDate__detail">
          {selectedDateEvents.length < 1 && <p>No Events</p>}
          {selectedDateEvents.map((sde, sdeindex) => (
            <div className="event__detail" key={sdeindex}>
              <div className="event__detail__id__title">
                <p>{sde.name}</p>
              </div>
              <div className="event__detail__startEnd__date">
                <p>
                  <span>From - </span>
                  {sde.start}
                </p>
                <p>
                  <span>To - </span>
                  {sde.end}
                </p>
              </div>
              <Button variant="dark" onClick={() => deleteSession(sde.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Button variant="dark" onClick={handleShow} style={{ marginTop: "20px" }}>
        Book Session
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Book Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => onScheduling(e)} className="book__calendar">
            <h5>Enter event name</h5>
            <input
              type="text"
              value={bookSchedule.name}
              onChange={(e) =>
                setBookSchedule({ ...bookSchedule, name: e.target.value })
              }
              placeholder="Event name"
            />
            <h5>Select start date and time</h5>
            <input
              type="date"
              value={bookSchedule.start_date}
              onChange={(e) =>
                setBookSchedule({ ...bookSchedule, start_date: e.target.value })
              }
            />
            <input
              type="time"
              value={bookSchedule.start_time.substring(0, 6)}
              onChange={(e) =>
                setBookSchedule({
                  ...bookSchedule,
                  start_time: e.target.value,
                })
              }
            />
            <h5>Select end date and time</h5>
            <input
              type="date"
              value={bookSchedule.end_date}
              onChange={(e) =>
                setBookSchedule({
                  ...bookSchedule,
                  end_date: e.target.value,
                })
              }
            />
            <input
              type="time"
              value={bookSchedule.end_time.substring(0, 6)}
              onChange={(e) =>
                setBookSchedule({
                  ...bookSchedule,
                  end_time: e.target.value,
                })
              }
            />
            <Button type="submit" variant="dark" style={{ marginTop: "20px" }}>
              Book Schedule
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
