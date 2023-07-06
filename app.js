const express = require("express");
require("dotenv").config();
const app = express();

const connectDB = require("./config/db/db");
const cors = require("cors");
// app.use(express.urlencoded({ extended: false }));
app.use(cors());
connectDB();

const Bus = require("./Models/Bus");
const Car = require("./Models/Car");
const User = require("./Models/User");

app.use(express.json());

app.post("/post", async (req, res) => {
  const bus = new Bus({
    operatorId: req.query.operatorId,
    busName: req.query.busName,
    busRno: req.query.busRno,
    password: req.query.password,
    route: req.query.route,
    startPoint: req.query.startPoint,

    lastPoint: req.query.lastPoint,
    stop1: req.query.stop1,
    stop2: req.query.stop2,

    stop3: req.query.stop3,
    stop4: req.query.stop4,
    stop5: req.query.stop5,
    stop6: req.query.stop6,
    stop1time: req.query.stop1time,

    stop2time: req.query.stop2time,
    stop3time: req.query.stop3time,
    stop4time: req.query.stop4time,
    stop5time: req.query.stop5time,
    stop6time: req.query.stop6time,

    status: req.query.status,
  });
  const result = await bus.save();
  if (!result)
    return res.status(400).send({ success: false, message: "cannot add" });
  res.status(200).send({ Success: true, message: "successfully added." });
});

app.get("/allcars", async (req, res) => {
  const cars = await Car.find();
  if (!cars)
    return res.status(404).send({ success: false, message: "No cars found" });
  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    data: cars,
  });
});
app.get("/allbuses", async (req, res) => {
  console.log(req.params.id);
  const buses = await Bus.find({ operatorId: req.params.id });
  if (!buses)
    return res.status(404).send({ success: false, message: "No buses found" });
  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    data: buses,
  });
});
app.get("/allbuses/id", async (req, res) => {
  console.log(req.params.id);
  const buses = await Bus.find({ operatorId: req.params.id });
  if (!buses)
    return res.status(404).send({ success: false, message: "No buses found" });
  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    data: buses,
  });
});
app.get("/driver/:id", async (req, res) => {
  // console.log(req.params.id);
  const buses = await Bus.find({ busRno: req.params.id });
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

app.post("/location/:id/path", async (req, res) => {
  const { id } = req.params;
  const { lat, long, place } = req.body;
  // console.log(req.body);
  try {
    const bus = await Bus.findOneAndUpdate(
      { busRno: id },
      {
        $set: {
          latitude: lat,
          longitude: long,
          place: place,
        },
      },
      { new: true, upsert: true }
    );

    if (!bus) {
      return res.status(404).send({ success: false, message: "Not found" });
    }

    await bus.save();
    console.log(bus);
    res.status(200).send({ success: true, message: "saves succesfluy" });
  } catch (error) {
    console.error("Error updating location path:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while updating location path",
    });
  }
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
    stoptime: req.body.time,
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

app.post("/user/register", async (req, res) => {
  const { Email, name, password, roles } = req.query;
  console.log(Email, name, password, roles, req.query);
  // const check = User.find({ email: Email });

  const responce = new User({ name, email: Email, password, roles });
  responce.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        success: false,
        message: "Email already exists",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "success",
      });
    }
  });
});

app.get("/user/login", async (req, res) => {
  try {
    if (req.query.email === "" || req.query.password === "") {
      return res.send({
        success: false,
        message: "Fill Both email and password",
      });
    }

    const email = req.query.email;
    const [user, bus] = await Promise.all([
      User.findOne({ email }),
      Bus.findOne({ busRno: email }),
    ]);

    console.log("user is", user);
    console.log("bus is", bus);
    let yes = "";
    if (bus) {
      yes = true;
    }
    console.log(yes);
    if (!user && !bus) {
      res.send({
        success: false,
        message: "Email not found",
      });
    } else {
      const target = user || bus;
      const passwordMatch = target.password === req.query.password;

      if (!passwordMatch) {
        res.send({
          success: false,
          message: "Invalid password",
        });
      } else {
        let responseMessage = "";
        if (user) {
          responseMessage = user._id;
        } else if (bus) {
          responseMessage = bus.busRno;
        }

        return res.status(200).send({
          success: true,
          message: responseMessage,
          roles: target.roles,
          driver: yes,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while processing the request",
    });
  }
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
  console.log(from, destination);
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  // console.log(formattedTime, from, destination);
  if (from == destination) {
    return res.status(404).send({
      success: false,
      message: "From and Destination cannot be",
    });
  }
  function stringToTime(timeString) {
    const timeComponents = timeString.split(":");
    const hours = parseInt(timeComponents[0]);
    const minutes = parseInt(timeComponents[1]);
    const time = new Date(0, 0, 0, hours, minutes).getTime();
    return time * -1;
  }

  const buses = await Bus.find({
    $or: [
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
