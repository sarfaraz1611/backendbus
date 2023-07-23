const express = require("express");
require("dotenv").config();
const app = express();

const connectDB = require("./config/db/db");
const cors = require("cors");
var bcrypt = require("bcrypt");

// app.use(express.urlencoded({ extended: false }));
app.use(cors());
connectDB();

const Bus = require("./Models/Bus");
const Car = require("./Models/Car");
const User = require("./Models/User");
const CarUser = require("./Models/CarUser");

app.use(express.json());

app.post("/carpost", async (req, res) => {
  console.log(req.body);
  const bus = new Car({
    userId: req.body.userId,
    name: req.body.name,
    gender: req.body.gender,
    carName: req.body.carName,
    carNo: req.body.carNo,
    startPoint: req.body.startPoint,
    lastPoint: req.body.lastPoint,
    date: req.body.date,
    phoneNO: req.body.phoneNO,
    seats: req.body.seats,
  });
  console.log(bus);
  const result = await bus.save();
  if (!result)
    return res.status(400).send({ success: false, message: "cannot add" });
  res.status(200).send({ Success: true, message: "successfully added." });
});

app.post("/post", async (req, res) => {
  const {
    operatorId,
    busName,
    busRno,
    password,
    route,
    startPoint,
    lastPoint,
    stop1,
    stop2,
    stop3,
    stop4,
    stop5,
    stop6,
    stop1time,
    stop2time,
    stop3time,
    stop4time,
    stop5time,
    stop6time,
    status,
  } = req.query;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const bus = new Bus({
      operatorId,
      busName,
      busRno,
      password: hashedPassword,
      route,
      startPoint,
      lastPoint,
      stop1,
      stop2,
      stop3,
      stop4,
      stop5,
      stop6,
      stop1time,
      stop2time,
      stop3time,
      stop4time,
      stop5time,
      stop6time,
      status,
    });

    const result = await bus.save();
    if (!result) {
      return res
        .status(400)
        .send({ success: false, message: "Cannot add bus." });
    }
    res.status(200).send({ success: true, message: "Bus added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal server error." });
  }
});

app.get("/allcars", async (req, res) => {
  const cars = await Car.find();
  console.log(cars);
  if (!cars)
    return res.status(404).send({ success: false, message: "No cars found" });
  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    data: cars,
  });
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
app.get("/allads/:id", async (req, res) => {
  // console.log(req.params.id);
  const buses = await Car.find({ userId: req.params.id });
  if (!buses)
    return res.status(404).send({ success: false, message: "No buses found" });
  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    data: buses,
  });
});
app.get("/allbuses/:id", async (req, res) => {
  // console.log(req.params.id);
  const buses = await Bus.find({ operatorId: req.params.id });
  if (!buses)
    return res.status(404).send({ success: false, message: "No buses found" });
  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    data: buses,
  });
});
app.get("/getcar", async (req, res) => {
  const from = req.query.from;
  const destination = req.query.destination;
  console.log(from, destination);

  try {
    const cars = await Car.find({
      $or: [{ startPoint: from }, { lastPoint: destination }],
    });
    console.log("====================================");
    console.log(cars);

    res.status(200).json({
      success: true,
      data: cars,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});
app.get("/busid/:id", async (req, res) => {
  console.log(req.params.id);
  const buses = await Bus.find({ _id: req.params.id });
  console.log("====================================");
  console.log(buses);
  console.log("====================================");
  if (!buses)
    return res.status(404).send({ success: false, message: "No buses found" });
  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    data: buses,
  });
});
app.post("/carbook/:carid/:id", async (req, res) => {
  console.log(req.params.id);
  const carid = req.params.carid;
  const nid = req.params.id;

  try {
    const car = await Car.findById(req.params.carid);

    if (!car) {
      return res.status(404).send({ success: false, message: "No car found" });
    }

    const previousBooking = [...car.booking];

    car.booking = [...previousBooking, nid];

    await car.save();

    console.log(car);

    res.status(200).send({
      success: true,
      message: "Successfully booking",
      data: car,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

app.get("/userid/:id", async (req, res) => {
  // console.log(req.params.id);
  try {
    const car = await Car.findById(req.params.id);
    const bookings = car.booking;
    console.log("====================================");
    console.log(bookings);
    console.log("====================================");
    const usersInfo = [];
    for (const userId of bookings) {
      console.log(userId);
      const user = await CarUser.findById(userId);
      if (user) {
        usersInfo.push(user);
      }
    }

    res.status(200).send({
      success: true,
      message: "Successfully fetched user information",
      data: usersInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});
app.get("/carid/:id", async (req, res) => {
  console.log(req.params.id);
  const buses = await Car.find({ _id: req.params.id });
  console.log("====================================");
  console.log(buses);
  console.log("====================================");
  if (!buses)
    return res.status(404).send({ success: false, message: "No buses found" });
  res.status(200).send({
    success: true,
    message: "Successfully fetched the data",
    data: buses,
  });
});
app.get("/getBookedcars/:id", async (req, res) => {
  console.log(req.params.id);

  const buses = await Car.find({
    booking: { $elemMatch: { $eq: req.params.id } },
  });
  console.log("====================================");
  console.log("bussesarea", buses);
  console.log("====================================");
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
  console.log("====================================");
  const { id } = req.params;
  console.log("====================================");
  const { lat, long, place } = req.body;
  console.log(id, lat, long, place);
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

async function updateStopTime(id, stopTimeField) {
  try {
    const currentTime = new Date().toLocaleTimeString();

    const bus = await Bus.findOneAndUpdate(
      { busRno: id },
      {
        $set: {
          [stopTimeField]: currentTime,
        },
      },
      { new: true, upsert: true }
    );

    if (!bus) {
      return false;
    }

    await bus.save();
    return true;
  } catch (error) {
    console.error("Error updating location path:", error);
    return false;
  }
}
app.post("/location/:id/stop1", async (req, res) => {
  const { id } = req.params;
  const success = await updateStopTime(id, "stop1time");

  if (success) {
    res
      .status(200)
      .send({ success: true, message: "Stop 1 time saved successfully" });
  } else {
    res.status(500).send({
      success: false,
      message: "An error occurred while updating stop 1 time",
    });
  }
});
app.post("/location/:id/stop2", async (req, res) => {
  const { id } = req.params;
  const success = await updateStopTime(id, "stop2time");

  if (success) {
    res
      .status(200)
      .send({ success: true, message: "Stop 1 time saved successfully" });
  } else {
    res.status(500).send({
      success: false,
      message: "An error occurred while updating stop 1 time",
    });
  }
});
app.post("/location/:id/stop3", async (req, res) => {
  const { id } = req.params;
  const success = await updateStopTime(id, "stop3time");

  if (success) {
    res
      .status(200)
      .send({ success: true, message: "Stop 1 time saved successfully" });
  } else {
    res.status(500).send({
      success: false,
      message: "An error occurred while updating stop 1 time",
    });
  }
});
app.post("/location/:id/stop4", async (req, res) => {
  const { id } = req.params;
  const success = await updateStopTime(id, "stop4time");

  if (success) {
    res
      .status(200)
      .send({ success: true, message: "Stop 1 time saved successfully" });
  } else {
    res.status(500).send({
      success: false,
      message: "An error occurred while updating stop 1 time",
    });
  }
});
app.post("/location/:id/stop5", async (req, res) => {
  const { id } = req.params;
  const success = await updateStopTime(id, "stop5time");

  if (success) {
    res
      .status(200)
      .send({ success: true, message: "Stop 1 time saved successfully" });
  } else {
    res.status(500).send({
      success: false,
      message: "An error occurred while updating stop 1 time",
    });
  }
});
app.post("/location/:id/stop6", async (req, res) => {
  const { id } = req.params;
  const success = await updateStopTime(id, "stop6time");

  if (success) {
    res
      .status(200)
      .send({ success: true, message: "Stop 1 time saved successfully" });
  } else {
    res.status(500).send({
      success: false,
      message: "An error occurred while updating stop 1 time",
    });
  }
});
app.post("/location/:id/stop7", async (req, res) => {
  const { id } = req.params;
  const success = await updateStopTime(id, "stop7time");

  if (success) {
    res
      .status(200)
      .send({ success: true, message: "Stop 1 time saved successfully" });
  } else {
    res.status(500).send({
      success: false,
      message: "An error occurred while updating stop 1 time",
    });
  }
});
app.post("/location/:id/stop8", async (req, res) => {
  const { id } = req.params;
  const success = await updateStopTime(id, "stop8time");

  if (success) {
    res
      .status(200)
      .send({ success: true, message: "Stop 1 time saved successfully" });
  } else {
    res.status(500).send({
      success: false,
      message: "An error occurred while updating stop 1 time",
    });
  }
});

app.post("/bus/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      {
        busName: req.body.busName,
        busRno: req.body.busRno,
        password: hashedPassword,
        route: req.body.route,
        startPoint: req.body.startPoint,
        lastPoint: req.body.lastPoint,
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
        status: req.body.status,
      }
      // { new: true } // Return the updated document
    );

    if (!bus) {
      return res.status(404).send({ success: false, message: "Bus not found" });
    }

    res
      .status(200)
      .send({ success: true, message: "Successfully updated data", bus });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});
app.post("/carsss/:id", async (req, res) => {
  try {
    console.log("is id" + req.params.id);
    console.log("body is", req.body);
    const bus = await Car.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        gender: req.body.gender,
        carName: req.body.carName,
        carNo: req.body.carNo,
        startPoint: req.body.startPoint,
        lastPoint: req.body.lastPoint,
        date: req.body.date,
        phoneNO: req.body.phoneNO,
        seats: req.body.seats,
      }
      // { new: true } // Return the updated document
    );

    if (!bus) {
      return res.status(404).send({ success: false, message: "Bus not found" });
    }

    res
      .status(200)
      .send({ success: true, message: "Successfully updated data", bus });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

app.post("/delete/:id", async (req, res) => {
  const result = await Bus.findByIdAndDelete(req.params.id);
  if (!result)
    return res.status(404).send({ success: false, message: "Data not found!" });
  res.status(200).send({ success: true, message: "Deleted successfully" });
});
app.post("/deleteadds/:id", async (req, res) => {
  console.log("parasm", req.params.id);
  const result = await Car.findByIdAndDelete(req.params.id);
  console.log(result);
  if (!result)
    return res.status(404).send({ success: false, message: "Data not found!" });
  res.status(200).send({ success: true, message: "Deleted successfully" });
});

app.post("/user/register", async (req, res) => {
  const { Email, name, password, roles } = req.query;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: Email });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user object with the hashed password
    const newUser = new User({
      name,
      email: Email,
      password: hashedPassword,
      roles,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(200).send({
      success: true,
      message: "User registration successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

app.post("/caruser/register", async (req, res) => {
  const { Email, name, password, phone } = req.query;
  try {
    const existingUser = await CarUser.findOne({ email: Email });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newCarUser = new CarUser({
      name,
      email: Email,
      password: hashedPassword,
      phone,
    });

    await newCarUser.save();

    res.status(200).send({
      success: true,
      message: "Car user registration successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

app.get("/user/login", async (req, res) => {
  try {
    if (req.query.email === "" || req.query.password === "") {
      return res.send({
        success: false,
        message: "Fill Both email and password",
      });
    } else if (req.query.email === "Admin" && req.query.password === "admin") {
      return res.send({
        success: true,

        roles: "admin",
      });
    } else {
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
        const passwordMatch = await bcrypt.compare(
          req.query.password,
          target.password
        );

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
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while processing the request",
    });
  }
});
app.get("/caruser/login", async (req, res) => {
  try {
    const { email, password } = req.query;
    console.log(req.query);
    if (email === "" || password === "") {
      return res.status(400).json({
        success: false,
        message: "Fill both email and password",
      });
    }

    const user = await CarUser.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // console.log(user._id);
    return res.status(200).json({
      success: true,
      message: "Success",
      id: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
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
    const hours = parseInt(timeComponents[0]);
    // console.log(hours);
    const minutes = parseInt(timeComponents[1]);
    // console.log(minutes);
    const time = new Date(0, 0, 0, hours, minutes).getTime();
    console.log(time);
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
  console.log(buses);
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
