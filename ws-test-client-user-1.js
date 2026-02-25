const { io } = require("socket.io-client")

// ⚠️ Inserisci qui un JWT valido
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzYTFiZDgzMi03NDA0LTRiMDAtYmI5Yy03MGI3NjE2ZTEyOTAiLCJlbWFpbCI6InNhc2FAMTIzLml0IiwidXNlcm5hbWUiOiJzYXNhIiwiaXNzIjoiYXBpLm15c2l0ZS5jb20iLCJhdWQiOiJSZWNpcGVMYWItY2xpZW50IiwiaWF0IjoxNzcyMDE4MjQwLCJleHAiOjE3NzIxMDQ2NDB9.aMCRQ2TKoyn4sj3PFCrRwRu7KlveKGtvLd-GsP2bMy4"


// utente: sasa@123.it


const socket = io("http://localhost:5000", {
  auth: {
    token: TOKEN
  },
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000
})

socket.on("connect", () => {
  console.log("✅ Connesso al WebSocket")
})

socket.on("disconnect", () => {
  console.log("❌ Disconnesso")
})

socket.on("connect_error", (err) => {
  console.log("Errore connessione:", err.message)
})

// 🔔 EVENTI CHE ABBIAMO DEFINITO
socket.on("test_item_created", (data) => {
  console.log("🔥 Evento test_item_created ricevuto:", data)
})

socket.on("test_item_updated", (data) => {
  console.log("🔥 Evento test_item_updated ricevuto:", data)
})

socket.onAny((event, ...args) => {
  console.log("⚡ Evento generico ricevuto:", event, args)
})