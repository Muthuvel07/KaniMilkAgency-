import { db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const box = document.getElementById("orders");
const countEl = document.getElementById("orderCount");

// Load orders in real-time, newest first
const q = query(collection(db, "orders"), orderBy("time", "desc"));

onSnapshot(q, (snapshot) => {
  box.innerHTML = "";
  countEl.textContent = snapshot.size;

  if (snapshot.empty) {
    box.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:#888;">No orders yet.</td></tr>`;
    return;
  }

  snapshot.forEach(item => {
    const data = item.data();
    const time = data.time?.toDate
      ? data.time.toDate().toLocaleString("en-IN")
      : "—";

    const statusColor = data.status === "Delivered" ? "#087f23" : "#e65100";

    box.innerHTML += `
      <tr>
        <td>${data.name || "—"}</td>
        <td>${data.phone || "—"}</td>
        <td>${data.product || "—"}</td>
        <td>${data.quantity || "—"}</td>
        <td>${data.address || "—"}</td>
        <td>${time}</td>
        <td>
          <button
            class="status-btn"
            style="background:${statusColor}"
            onclick="toggleStatus('${item.id}', '${data.status}')">
            ${data.status}
          </button>
        </td>
      </tr>
    `;
  });
}, (error) => {
  console.error("Firestore Error:", error);
  box.innerHTML = `<tr><td colspan="6" style="color:red;padding:20px;">Error loading orders: ${error.message}</td></tr>`;
});

// Toggle between Pending and Delivered
window.toggleStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === "Pending" ? "Delivered" : "Pending";
  try {
    await updateDoc(doc(db, "orders", id), { status: newStatus });
  } catch (error) {
    alert("Update failed: " + error.message);
  }
};
