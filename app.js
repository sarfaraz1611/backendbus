const express = require("express");
const app = express();
const connectDB = require("./config/db/db");
const cors = require("cors");
require("dotenv").config();
connectDB();
const Bus = require("./Models/Bus");
const User = require("./Models/User");

app.use(express.json());
app.use(cors());
app.post("/post", async (req, res) => {
  const bus = new Bus({
    operatorId: req.body.operatorId,
    busName: req.body.busName,
    busRno: req.body.busRno,
    route: req.body.route,
    startPoint: req.body.startPoint,
    lastPoint: req.body.lastPoint,
    startTime: req.body.startTime,
    lastTime: req.body.lastTime,
    status: req.body.status,
    stop1: req.body.stop1,
    stop2: req.body.stop2,
    stop3: req.body.stop3,
    stop4: req.body.stop4,
    stop5: req.body.stop5,
    stop6: req.body.stop6,
    stop1time: req.body.stop1time,
    stop2time: req.body.stop2time,
    stop3time: req.body.stop3time,
    stop4time: req.body.stop4time,
    stop5time: req.body.stop5time,
    stop6time: req.body.stop6time,
  });
  const result = await bus.save();
  if (!result)
    return res.status(400).send({ success: false, message: "cannot add" });
  res.status(200).send({ Success: true, message: "successfully added." });
});

app.get("/allbuses", async (req, res) => {
  const buses = await Bus.find();
  if (!buses)
    return res.status(404).send({ success: false, message: "No buses found" });
  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    data: buses,
  });
});

// for all the busses which has same destination
app.get("/getDestinationBuses", async (req, res) => {
  const date = req.query.date;
  const place = req.query.place;
  const buses = await Bus.find({
    $or: [
      { startPoint: place },
      { lastPoint: place },
      { stop1: place },
      { stop2: place },
      { stop3: place },
      { stop4: place },
      { stop5: place },
      { stop6: place },
    ],
  });

  if (!buses)
    return res
      .status(404)
      .send({ success: false, message: "No buses found for the given place" });

  const filteredBuses = buses.filter((bus) => {
    return (
      (bus.stop1time && bus.stop1time.toString() === date) ||
      (bus.stop2time && bus.stop2time.toString() === date) ||
      (bus.stop3time && bus.stop3time.toString() === date) ||
      (bus.stop4time && bus.stop4time.toString() === date) ||
      (bus.stop5time && bus.stop5time.toString() === date) ||
      (bus.stop6time && bus.stop6time.toString() === date)
    );
  });

  if (!filteredBuses.length)
    return res
      .status(404)
      .send({ success: false, message: "No buses found for the given date" });

  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    data: filteredBuses,
  });
});

app.post("/bus/:id", async (req, res) => {
  const bus = await Bus.findByIdAndUpdate(req.params.id, {
    operatorId: req.body.operatorId,
    busName: req.body.busName,
    busRno: req.body.busRno,
    route: req.body.route,
    startPoint: req.body.startPoint,
    lastPoint: req.body.lastPoint,
    startTime: req.body.startTime,
    lastTime: req.body.lastTime,
    status: req.body.status,
    stop1: req.body.stop1,
    stop2: req.body.stop2,
    stop3: req.body.stop3,
    stop4: req.body.stop4,
    stop5: req.body.stop5,
    stop6: req.body.stop6,
    stop1time: req.body.stop1time,
    stop2time: req.body.stop2time,
    stop3time: req.body.stop3time,
    stop4time: req.body.stop4time,
    stop5time: req.body.stop5time,
    stop6time: req.body.stop6time,
  });
  if (!bus)
    return res.status(404).send({ success: true, message: "Not found" });
  res.status(200).send({ success: true, message: "successfully updated data" });
});

app.post("/delete/:id", async (req, res) => {
  const result = await Bus.findByIdAndDelete(req.params.id);
  if (!result)
    return res.status(404).send({ success: false, message: "Data not found!" });
  res.status(200).send({ success: true, message: "Deleted successfully" });
});

app.post("/user/login", async (req, res) => {
  const user = await User.find({ email: req.body.email });
  if (!user)
    return res
      .status(404)
      .send({ success: false, message: "Email or password is incorrect" });
  if (user.password === req.body.password)
    return res.status(200).send({
      success: true,
      message: "successfully loggedin",
      data: user.email,
    });
  res
    .status(400)
    .send({ success: false, message: "Email or password is incorrect" });
});

app.get("/getDestination", async (req, res) => {
  const destination = req.query.destination;
  const buses = await Bus.find({
    $or: [
      { startPoint: destination },
      { lastPoint: destination },
      { stop1: destination },
      { stop2: destination },
      { stop3: destination },
      { stop4: destination },
      { stop5: destination },
      { stop6: destination },
    ],
  });

  if (!buses)
    return res.status(404).send({
      success: false,
      message: "No buses found for the given destination",
    });

  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    data: buses,
  });
});

app.get("/getBus", async (req, res) => {
  const from = req.query.from;
  const destination = req.query.destination;
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  console.log(formattedTime, from, destination);
  if (from == destination) {
    return res.status(404).send({
      success: false,
      message: "From and Destination cannot be",
    });
  }
  function stringToTime(timeString) {
    const timeComponents = timeString.split(":");
    const hours = parseInt(timeComponents[0]);stop6time;
    const minutes = parseInt(timeComponents[1]);
    const time = new Date(0, 0, 0, hours, minutes).getTime();
    return time * -1;
  }

  const buses = await Bus.find({
    $or: [
      { startPoint: destination },
      { lastPoint: destination },
      { stop1: destination },
      { stop2: destination },
      { stop3: destination },
      { stop4: destination },
      { stop5: destination },
      { stop6: destination },
    ],
  });
  let finalData = [];
  const currentTimeNow = stringToTime(formattedTime);
  for (i = 0; i < buses.length; i++) {
    if (buses[i].startPoint == from) {
      if (stringToTime(buses[i].startTime) < currentTimeNow) {
        if (
          buses[i].stop1 == destination ||
          buses[i].stop2 == destination ||
          buses[i].stop3 == destination ||
          buses[i].stop4 == destination ||
          buses[i].stop5 == destination ||
          buses[i].stop6 == destination ||
          buses[i].lastTime == destination
        ) {
          finalData.push(buses[i]);
        }
      }
    } else if (buses[i].stop1 == from) {
      if (stringToTime(buses[i].stop1time) < currentTimeNow) {
        if (
          buses[i].stop2 == destination ||
          buses[i].stop3 == destination ||
          buses[i].stop4 == destination ||
          buses[i].stop5 == destination ||
          buses[i].stop6 == destination ||
          buses[i].lastTime == destination
        ) {
          finalData.push(buses[i]);
        }
      }
    } else if (buses[i].stop2 == from) {
      if (stringToTime(buses[i].stop2time) < currentTimeNow) {
        if (
          buses[i].stop3 == destination ||
          buses[i].stop4 == destination ||
          buses[i].stop5 == destination ||
          buses[i].stop6 == destination ||
          buses[i].lastTime == destination
        ) {
          finalData.push(buses[i]);
        }
      }
    } else if (buses[i].stop3 == from) {
      if (stringToTime(buses[i].stop3time) < currentTimeNow) {
        if (
          buses[i].stop4 == destination ||
          buses[i].stop5 == destination ||
          buses[i].stop6 == destination ||
          buses[i].lastTime == destination
        ) {
          finalData.push(buses[i]);
        }
      }
    } else if (buses[i].stop4 == from) {
      if (stringToTime(buses[i].stop4time) < currentTimeNow) {
        if (
          buses[i].stop5 == destination ||
          buses[i].stop6 == destination ||
          buses[i].lastTime == destination
        ) {
          finalData.push(buses[i]);
        }
      }
    } else if (buses[i].stop5 == from) {
      if (stringToTime(buses[i].stop5time) < currentTimeNow) {
        if (buses[i].stop6 == destination || buses[i].lastTime == destination) {
          finalData.push(buses[i]);
        }
      }
    } else if (buses[i].stop6 == from) {
      if (stringToTime(buses[i].stop6time) < currentTimeNow) {
        if (buses[i].lastTime == destination) {
          finalData.push(buses[i]);
        }
      }
    }
  }
  if (finalData.length == 0)
    return res.status(404).send({
      success: false,
      message: "No buses found",
    });

  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    data: finalData,
  });
});

const port = process.env.PORT || 3100;
app.listen(port, () => console.log(`listening on port ${port}`));
