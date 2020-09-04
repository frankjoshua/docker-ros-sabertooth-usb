const rosnodejs = require('rosnodejs');
const DiagnosticStatus = rosnodejs.require('diagnostic_msgs').msg
  .DiagnosticStatus;
const DiagnosticArray = rosnodejs.require('diagnostic_msgs').msg
  .DiagnosticArray;

const SerialPort = require('serialport');
const MockBinding = require('@serialport/binding-mock');
SerialPort.Binding = MockBinding;
MockBinding.createPort('/dev/ttyACM0');
const serialPort = new SerialPort('/dev/ttyACM0', {
  autoOpen: false,
  baudRate: 256000,
});

const nodeName = '/sabertooth_2x32_usb';
const cmd_vel_topic = '/cmd_vel';

var keepAlive = new Date();
var alive = false;

function initSerial() {
  return new Promise((resolve, reject) => {
    serialPort.open((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function createDiagnosticsTopic(rosNode) {
  return rosNode.advertise('/diagnostics', 'diagnostic_msgs/DiagnosticArray', {
    queueSize: 1,
    latching: true,
    throttleMs: 9,
  });
}

function createNode(diagnostics, rosNode) {
  let sub = rosNode.subscribe(cmd_vel_topic, 'geometry_msgs/Twist', (msg) => {
    drive(diagnostics, msg.linear.x, msg.angular.z);
  });
  console.log(`Created node ${nodeName}`);
  sub.on('connection', () => {
    console.log(sub.getTopic(), sub.getNumPublishers());
  });
  sub.on('disconnect', () => {
    console.log(sub.getTopic(), sub.getNumPublishers());
  });
  sendDiagnostics(diagnostics, 0, 'Motor driver started');
}

function drive(diagnostics, speed, direction) {
  if (Math.abs(speed) > 1 || Math.abs(direction) > 1) {
    sendDiagnostics(
      diagnostics,
      1,
      `Motor driver control message out of range, linear: ${speed} angular: ${direction}`
    );
  } else if (speed == 0 && direction == 0) {
    sendDiagnostics(diagnostics, 0, 'Motors stopped');
  }
  console.log('linear.x', speed, 'angular.z', direction);

  // Sabertooth plain text serial send numbers -1023 to 1023 (?not sure of range?)
  // TODO: THIS IS NOT A GOOD FORMULA and LEFT AND RIGHT MAY BE REVERSED
  leftSpeed = Math.round((speed + direction * 0.25) * 1023);
  rightSpeed = Math.round((speed - direction * 0.25) * 1023);
  leftMotor = 'M1';
  rightMotor = 'M2';
  leftMotorCommand = `${leftMotor}: ${leftSpeed}`;
  rightMotorCommand = `${rightMotor}: ${rightSpeed}`;
  serialPort.write(leftMotorCommand);
  console.log(leftMotorCommand);
  serialPort.write(rightMotorCommand);
  console.log(rightMotorCommand);

  // Update keep alive
  keepAlive = new Date();
}

function sendDiagnostics(publisher, level, message) {
  let diagnosticStatus = new DiagnosticStatus({
    level: level,
    name: nodeName,
    message: message,
    hardware_id: nodeName,
    values: [],
  });
  let diagnosticArray = new DiagnosticArray();
  diagnosticArray.status = [diagnosticStatus];
  console.log(diagnosticArray.status[0].message);
  publisher.publish(diagnosticArray);
}

rosnodejs
  .initNode(nodeName, { onTheFly: true })
  .then((rosNode) => {
    // get list of existing publishers, subscribers, and services
    rosNode._node._masterApi.getSystemState(nodeName).then((data) => {
      //console.log('getSystemState, result', data, data.publishers[0]);
      let diagnostics = createDiagnosticsTopic(rosNode);
      sendDiagnostics(diagnostics, 1, 'Starting motor driver');
      // now that ros is connected connect the serial port
      initSerial()
        .then(() => {
          createNode(diagnostics, rosNode);
          // Create keep alive
          setInterval(() => {
            let timeSinceAlive = new Date() - keepAlive;
            if (alive && timeSinceAlive > 500) {
              drive(diagnostics, 0, 0);
              sendDiagnostics(
                diagnostics,
                1,
                `Stopping motor: no messages received (keep alive)`
              );
              alive = false;
            } else if (!alive && timeSinceAlive <= 500) {
              alive = true;
              sendDiagnostics(diagnostics, 0, 'Motors running');
            }
          }, 1000);
        })
        .catch((err) => {
          sendDiagnostics(diagnostics, 2, `Motor driver: ${err.message}`);
        });
    });
  })
  .catch((error) => console.log(error));
