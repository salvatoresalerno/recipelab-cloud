const { io } = require("socket.io-client")

// ⚠️ Inserisci qui un JWT valido
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNTVkZTE0MC0wMGQwLTRlYjctOTg4YS02NjFhMjI5ZWU0ZTIiLCJlbWFpbCI6InNhbHZhZGpAMTIzLml0IiwidXNlcm5hbWUiOiJzYWx2YXRvcmUiLCJpc3MiOiJhcGkubXlzaXRlLmNvbSIsImF1ZCI6IlJlY2lwZUxhYi1jbGllbnQiLCJpYXQiOjE3NzIxMDY4NDgsImV4cCI6MTc3MjE5MzI0OH0.egtt7QLL6R_sQw5EjjsUdPQbS8U_LDrXFQa6Y57w8tg"

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