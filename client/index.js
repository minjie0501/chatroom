const targetAll = document.getElementById("target-all");
const targetMe = document.getElementById("target-me");
const targetPrivate = document.getElementById("target-private");
const input = document.getElementById("input");
const sendAll = document.getElementById("send-to-all");
const sendToMe = document.getElementById("send-to-me");
const connectedUsers = document.getElementById("connected-users");

const error = document.getElementById("error");

let socket = io.connect();

sendAll.addEventListener("click", () => {
  const user = document.getElementById("select-users").value;
  console.log(user);
  if (user != null && user != "") {
    const message = input.value;
    socket.emit("sendToAll", message, user);
  } else {
    error.style.display = "inline-block";
  }
});

sendToMe.addEventListener("click", () => {
  const message = input.value;
  socket.emit("sendToMe", message);
});

socket.on("displayMessage", (message, user) => {
  targetAll.innerHTML += `
        From: ${user}<br>
        Message: ${message}<br><br>
    `;
});

socket.on("sendToMe", (message) => {
  targetMe.innerHTML += "<br>" + message;
});

socket.on("users", (users) => {
    console.log(users)
    users.forEach(user => {
        connectedUsers.innerHTML = "<br>User ID:" + user.id;
    });
    // connectedUsers.innerHTML += "<br>User ID:" + counter;
  });
