const { io } = require("socket.io-client")

// ⚠️ Inserisci qui un JWT valido
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNTVkZTE0MC0wMGQwLTRlYjctOTg4YS02NjFhMjI5ZWU0ZTIiLCJlbWFpbCI6InNhbHZhZGpAMTIzLml0IiwidXNlcm5hbWUiOiJzYWx2YXRvcmUiLCJpc3MiOiJhcGkubXlzaXRlLmNvbSIsImF1ZCI6IlJlY2lwZUxhYi1jbGllbnQiLCJpYXQiOjE3NzIwMTg0ODUsImV4cCI6MTc3MjEwNDg4NX0.9xU8uoAnz1nKD6OD6MYpeQqd4vW2mXm5FF-m7zm4N1c"

// utente: salvadj@123.it


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