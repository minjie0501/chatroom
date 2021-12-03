const targetAll = document.getElementById("target-all");
const targetPrivate = document.getElementById("target-private");
const input = document.getElementById("input");
const sendAll = document.getElementById("send-to-all");
const sendToMe = document.getElementById("send-to-me");
const connectedUsers = document.getElementById("connected-users");
const clients = document.getElementById("clients");
const sendPrivate = document.getElementById("send-private");
const error = document.getElementById("error");
const myId = document.getElementById("my-id");
const btnLogin = document.getElementById("btn-login");
const login = document.getElementsByClassName("login")[0];
const userNameInput = document.getElementById("user-name");
const container = document.getElementById('container')
let userNames = {};

// TODO: clear inputs after message sent
// TODO: show private message to the client who sent the message ?
// TODO: make website responsible 

btnLogin.addEventListener("click", () => {
  const userName = userNameInput.value;
  login.style.display = "none";
  container.style.backgroundColor = 'rgb(' + 161 + ',' + 187 + ',' + 161 + ')';

  let socket = io.connect();

  socket.emit("userName", userName);

  sendAll.addEventListener("click", () => {
    const message = input.value;
    socket.emit("sendToAll", message, userName); //sends sendToAll event to server
  });

  sendToMe.addEventListener("click", () => {
    const message = input.value;
    socket.emit("sendToMe", message);
  });

  sendPrivate.addEventListener("click", () => {
    const sendTo = clients.value;
    const message = input.value;
    socket.emit("sendPrivate", message, userName, sendTo); //sends sendPrivate event to server
  });

  //////////////////////////////////////////////
  //////////// LISTEN FOR EVENTS ///////////////
  socket.on("displayMessage", (message, user) => {
    let opt = document.createElement("p");
    opt.innerText += `
    From: ${user}
    Message: ${message}
    `;
    targetAll.appendChild(opt);
  });

  socket.on("displayToMe", (message) => {
    let opt = document.createElement("p");
    opt.innerText += `
    From myself:
    ${message}`;
    opt.style.color= 'grey'
    targetAll.appendChild(opt);
    
  });

  socket.on("displayClientId", (id) => {
    let opt = document.createElement("p");
    opt.setAttribute("id", "select-user-id");
    opt.innerText += `Your id is: ${id}
    Your username is: ${userName}
    `;
    myId.appendChild(opt);
  });

  socket.on("displayPrivateMessage", (message, user) => {
    let opt = document.createElement("p");
    opt.innerText += `
    From: ${user}
    Message: ${message}
    `;
    targetPrivate.appendChild(opt);
  });

  socket.on("clients", (clients, userNames, currentUserId) => {
    connectedUsers.innerText = "";
    const select = document.getElementById("clients");
    select.innerText = "";

    let opt = document.createElement("option");
    opt.value = "";
    opt.innerText = "";
    select.appendChild(opt);

    let thisUserId = document.getElementById("select-user-id");
    thisUserId =thisUserId.innerText.split(" ")[3].split("\n")[0]
    clients.forEach((client, idx) => {
      if (thisUserId !== client) {
        let p = document.createElement("p");
        p.innerText += `
        ${userNames[client]} (${client})`;
        connectedUsers.appendChild(p);

        let opt = document.createElement("option");
        opt.value = client;
        opt.innerText = userNames[client];
        select.appendChild(opt);
      }else{
        let p = document.createElement("p");
        p.innerText += `
        ${userNames[client]} (${client})`;
        connectedUsers.appendChild(p);
      }
    });
  });

  socket.on("deleteFromSelect", (currentUserId) => {
    let x = document.getElementById("clients");
    for (let i = 0; i < x.options.length; i++) {
      // console.log(x.options[i].value)
      if (x.options[i].value === currentUserId) {
        // console.log("todelete: " + x.options[i].value)
      }
    }
  });
});
