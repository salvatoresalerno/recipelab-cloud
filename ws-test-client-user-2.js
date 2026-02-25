const { io } = require("socket.io-client")

// ⚠️ Inserisci qui un JWT valido
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyZWYzMGFiNC00MTE3LTQwNzYtOTVhOC05ZTg3NzhkMDA3MzAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6ImVsZWN0cm9uX3VzZXIiLCJpc3MiOiJhcGkubXlzaXRlLmNvbSIsImF1ZCI6IlJlY2lwZUxhYi1jbGllbnQiLCJpYXQiOjE3NzIwMTgzMzQsImV4cCI6MTc3MjEwNDczNH0.ynpFl4h7hz2r4jg2sKuVwp7u84wPgftCkwcOvMOhe-I"

// utente: test@example.com


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