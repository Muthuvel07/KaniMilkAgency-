import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Select product and scroll to order form
window.selectProduct = function(name) {
  document.getElementById("product").value = name;
  document.querySelector(".order-section").scrollIntoView({ behavior: "smooth" });
};

// Send order to Firebase
window.sendOrder = async function() {
  const name     = document.getElementById("name").value.trim();
  const phone    = document.getElementById("phone").value.trim();
  const product  = document.getElementById("product").value.trim();
  const quantity = document.getElementById("quantity").value.trim();
  const address  = document.getElementById("address").value.trim();

  // Validation
  if (!name || !phone || !product || !quantity || !address) {
    showMessage("⚠️ Please fill in all fields before ordering.", "error");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    showMessage("⚠️ Please enter a valid 10-digit phone number.", "error");
    return;
  }

  const btn = document.getElementById("orderBtn");
  btn.disabled = true;
  btn.textContent = "Placing Order...";

  const order = {
    name,
    phone,
    product,
    quantity,
    address,
    status: "Pending",
    time: serverTimestamp()   // ✅ Server-side timestamp (more reliable)
  };

  try {
    await addDoc(collection(db, "orders"), order);

    showMessage("✅ Order placed successfully! Redirecting to WhatsApp...", "success");

    // Clear form
    ["name", "phone", "product", "quantity", "address"].forEach(id => {
      document.getElementById(id).value = "";
    });

    // WhatsApp message
    const msg =
      "🥛 *Kani Milk Agency Order*\n\n" +
      "👤 Name: " + name +
      "\n📞 Phone: " + phone +
      "\n🛒 Product: " + product +
      "\n📦 Quantity: " + quantity +
      "\n📍 Address: " + address +
      "\n⏳ Status: Pending";

    setTimeout(() => {
      window.open(
        "https://wa.me/918838416013?text=" + encodeURIComponent(msg),
        "_blank"
      );
    }, 1500);

  } catch (error) {
    console.error("Firebase Error:", error);
    showMessage("❌ Order failed: " + error.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Order Now";
  }
};

function showMessage(msg, type) {
  const el = document.getElementById("orderMsg");
  el.textContent = msg;
  el.className = "order-msg " + type;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 4000);
}
