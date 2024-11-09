import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [clockTime, setClockTime] = useState(0);
  const [clockRunning, setClockRunning] = useState(false);
  const [valves, setValves] = useState(Array(8).fill(false));
  const [bedStatus1, setBedStatus1] = useState(1); // Initialize with 1
  const [bedStatus2, setBedStatus2] = useState(21); // Initialize with 21
  const [phase, setPhase] = useState("-");
  const [balance, setBalance] = useState(52);
  const [timeInput, setTimeInput] = useState("");
  const clockIntervalRef = useRef(null);

  const schedule = [
    {
      valves: [true, true, true, false, false, false, false, false],
      phase: "Filtration",
      balance: 62
    },
    {
      valves: [true, true, true, false, false, false, false, false],
      phase: "Filtration",
      balance: 114
    },
    {
      valves: [true, true, true, false, false, false, false, false],
      phase: "Filtration",
      balance: 166
    },
    {
      valves: [true, true, true, false, false, false, false, false],
      phase: "Filtration",
      balance: 218
    },
    {
      valves: [false, true, true, false, false, false, false, false],
      phase: "Emptying Filter Beds",
      balance: 270
    },
    {
      valves: [false, true, true, false, false, false, false, false],
      phase: "Emptying Filter Beds",
      balance: 322
    },
    {
      valves: [false, true, true, false, false, false, false, false],
      phase: "Emptying Filter Beds",
      balance: 374
    },
    {
      valves: [false, true, true, false, false, false, false, false],
      phase: "Emptying Filter Beds",
      balance: 426
    },
    {
      valves: [false, true, true, false, false, false, false, false],
      phase: "Emptying Filter Beds",
      balance: 478
    },
    {
      valves: [false, true, true, false, false, false, false, false],
      phase: "Emptying Filter Beds",
      balance: 530
    },
    {
      valves: [false, true, true, false, false, false, false, false],
      phase: "Emptying Filter Beds",
      balance: 582
    },
    {
      valves: [false, true, true, false, false, false, false, false],
      phase: "Emptying Filter Beds",
      balance: 634
    },
    {
      valves: [false, true, true, false, false, false, false, false],
      phase: "Emptying Filter Beds",
      balance: 686
    },
    {
      valves: [false, true, true, false, false, false, false, false],
      phase: "Emptying Filter Beds",
      balance: 738
    },
    {
      valves: [false, true, true, false, false, false, false, false],
      phase: "Emptying Filter Beds",
      balance: 790
    },
    {
      valves: [false, true, true, false, false, false, false, false],
      phase: "Emptying Filter Beds",
      balance: 842
    },
    {
      valves: [false, false, false, false, false, false, false, true],
      phase: "Opening Drain Valve",
      balance: 894
    },
    {
      valves: [false, false, false, false, false, true, false, true],
      phase: "Air Scoring Section 1",
      balance: 946
    },
    {
      valves: [false, false, false, false, false, true, false, true],
      phase: "Air Scoring Section 1",
      balance: 998
    },
    {
      valves: [false, false, false, false, false, false, true, true],
      phase: "Air Scoring Section 2",
      balance: 1050
    },
    {
      valves: [false, false, false, false, false, false, true, true],
      phase: "Washing Filter Bed",
      balance: 790
    },
    {
      valves: [false, false, false, true, true, false, false, true],
      phase: "Washing Filter Bed",
      balance: 530
    },
    {
      valves: [false, false, false, true, true, false, false, true],
      phase: "Washing Filter Bed",
      balance: 270
    },
    {
      valves: [false, false, false, true, true, false, false, true],
      phase: "Washing Filter Bed",
      balance: 10
    }
  ];

  const valvesName = [
    "Filter I / L 1 400 mm", "Pure Water O / L 1 300 mm", "Pure Water O / L 2 300 mm",
    "Wash Water I / L 1 450 mm", "Wash Water I / L 2 450 mm", "Air Scour I / L 1 200 mm",
    "Air Scour I / L 2 200 mm", "Filter Wash out drain 450 mm"
  ];

  // Clock logic
  useEffect(() => {
    if (clockRunning) {
      clockIntervalRef.current = setInterval(() => {
        setClockTime((prevTime) => {
          const newTime = prevTime + 1;
          // Reset clock after 24 hours (86400 seconds)
          if (newTime >= 86400) {
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(clockIntervalRef.current);
    }
    return () => clearInterval(clockIntervalRef.current);
  }, [clockRunning]);

  useEffect(() => {
    const timeInMinutes = Math.floor(clockTime / 60);

    // Each schedule entry lasts 3 minutes
    const scheduleIndex = Math.floor(timeInMinutes / 3) % schedule.length;
    const currentSchedule = schedule[scheduleIndex];

    setValves(currentSchedule.valves);
    setPhase(currentSchedule.phase);
    setBalance(currentSchedule.balance);

    // Update bed number every 12 minutes, looping from 1 to 20 and 21 to 40 for two buildings
    const time = Math.floor(timeInMinutes / 72) + 1;
    setBedStatus1(time);
    setBedStatus2(20 + time);
  }, [clockTime]);

  const startClock = () => setClockRunning(true);
  const stopClock = () => setClockRunning(false);
  const resetClock = () => {
    setClockTime(0);
    setValves(Array(8).fill(false));
    setPhase("-");
    setBalance(0);
    setBedStatus1(1);
    setBedStatus2(21);
  };

  const fastForwardTime = () => setClockTime((prevTime) => prevTime + 180);
  const rewindTime = () => setClockTime((prevTime) => Math.max(prevTime - 180, 0));

  // Handle time input as HH:MM:SS format
  const goToTime = () => {
    const [hours, minutes, seconds] = timeInput.split(":").map((part) => parseInt(part, 10) || 0);
    setClockTime(hours * 3600 + minutes * 60 + seconds);
    setTimeInput("");
  };

  const handleTimeInputChange = (e) => setTimeInput(e.target.value);

  return (
    <div className="app-container">
      <h1 className="heading">WTP Backwash Simulation</h1>
      <div className="main-content">
        <div className="simulation-content">
          <div className="clock-controls">
            <button onClick={rewindTime} className="control-button rewind">Rewind</button>
            <div className="time-display">{new Date(clockTime * 1000).toISOString().substr(11, 8)}</div>
            <button onClick={fastForwardTime} className="control-button fast-forward">Fast Forward</button>
          </div>

          <div className="valves">
            {valves.map((status, index) => (
              <div key={index} className={`valve ${status ? "active" : "inactive"}`}>
                {valvesName[index]}
              </div>
            ))}
          </div>

          <div className="status-boxes">
            <div className="status-box">
              <div className="bed">Building 1 - Bed: {bedStatus1}</div>
            </div>
            <div className="phase-box">
              <div className="phase-text">{phase}</div>
            </div>
            <div className="status-box">
              <div className="bed">Building 2 - Bed: {bedStatus2}</div>
            </div>
          </div>

          <div className="control-buttons">
            <button onClick={startClock} disabled={clockRunning} className="control-button start">Start</button>
            <button onClick={stopClock} disabled={!clockRunning} className="control-button stop">Stop</button>
            <button onClick={resetClock} disabled={clockTime === 0 || clockRunning} className="control-button reset">Reset</button>
          </div>

          <div className="time-input-container">
            <input
              type="text"
              value={timeInput}
              onChange={handleTimeInputChange}
              placeholder="e.g., 01:30:00"
              className="time-input"
            />
            <button onClick={goToTime} className="btn-go">Go to Time</button>
          </div>
        </div>

        <div className="water-tank-container">
          <div className="water-tank">
            <div className="water-level" style={{ height: `${(balance / 2480) * 100}%` }}></div>
            <div className="water-balance">Water: {balance} m³</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
