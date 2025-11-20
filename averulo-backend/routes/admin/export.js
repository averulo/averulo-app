import ExcelJS from "exceljs";
import express from "express";
import { Parser } from "json2csv";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";

const router = express.Router();
const adminOnly = auth(true, ["ADMIN"]);

function timestampedName(base, ext) {
  const date = new Date().toISOString().split("T")[0];
  return `${base}_${date}.${ext}`;
}

// 🔧 helper to send Excel
async function sendExcel(res, filename, headers, rows) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data");
  sheet.columns = headers.map((h) => ({ header: h.label, key: h.key, width: 20 }));
  rows.forEach((r) => sheet.addRow(r));
  const buffer = await workbook.xlsx.writeBuffer();

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(Buffer.from(buffer));
}

// 🔧 helper to send CSV
function sendCsv(res, filename, fields, data) {
  const parser = new Parser({ fields });
  const csv = parser.parse(data);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "text/csv");
  res.send(csv);
}

// ───────────────────────────────────────────────
// 🧾 USERS EXPORT
// ───────────────────────────────────────────────
router.get("/export/users", adminOnly, async (req, res) => {
  try {
    const { format = "csv", search } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    if (!users.length) return res.status(404).json({ ok: false, message: "No users found" });

    if (format === "excel") {
      await sendExcel(
        res,
        timestampedName("users", "xlsx"),
        [
          { label: "ID", key: "id" },
          { label: "Name", key: "name" },
          { label: "Email", key: "email" },
          { label: "Phone", key: "phone" },
          { label: "Role", key: "role" },
          { label: "Created At", key: "createdAt" },
        ],
        users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString().split("T")[0] }))
      );
    } else {
      sendCsv(res, timestampedName("users", "csv"), Object.keys(users[0]), users);
    }
  } catch (err) {
    console.error("User export failed:", err);
    res.status(500).json({ ok: false, message: "User export failed" });
  }
});

// ───────────────────────────────────────────────
// 🧾 PROPERTIES EXPORT
// ───────────────────────────────────────────────
router.get("/export/properties", adminOnly, async (req, res) => {
  try {
    const { format = "csv", search } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    const props = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { host: true },
    });

    if (!props.length) return res.status(404).json({ ok: false, message: "No properties found" });

    const data = props.map((p) => ({
      id: p.id,
      title: p.title,
      city: p.city,
      status: p.status,
      host: p.host?.email,
      createdAt: p.createdAt.toISOString().split("T")[0],
    }));

    if (format === "excel") {
      await sendExcel(
        res,
        timestampedName("properties", "xlsx"),
        [
          { label: "ID", key: "id" },
          { label: "Title", key: "title" },
          { label: "City", key: "city" },
          { label: "Status", key: "status" },
          { label: "Host", key: "host" },
          { label: "Created At", key: "createdAt" },
        ],
        data
      );
    } else {
      sendCsv(res, timestampedName("properties", "csv"), Object.keys(data[0]), data);
    }
  } catch (err) {
    console.error("Property export failed:", err);
    res.status(500).json({ ok: false, message: "Property export failed" });
  }
});

// ───────────────────────────────────────────────
// 🧾 BOOKINGS EXPORT
// ───────────────────────────────────────────────
router.get("/export/bookings", adminOnly, async (req, res) => {
  try {
    const { format = "csv", status, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { property: { title: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: { user: true, property: true },
      orderBy: { createdAt: "desc" },
    });

    if (!bookings.length) return res.status(404).json({ ok: false, message: "No bookings found" });

    const data = bookings.map((b) => ({
      id: b.id,
      property: b.property?.title,
      guest: b.user?.email,
      status: b.status,
      startDate: b.startDate?.toISOString().split("T")[0],
      endDate: b.endDate?.toISOString().split("T")[0],
      totalAmount: b.totalAmount,
    }));

    if (format === "excel") {
      await sendExcel(
        res,
        timestampedName("bookings", "xlsx"),
        [
          { label: "ID", key: "id" },
          { label: "Property", key: "property" },
          { label: "Guest", key: "guest" },
          { label: "Status", key: "status" },
          { label: "Start Date", key: "startDate" },
          { label: "End Date", key: "endDate" },
          { label: "Total Amount", key: "totalAmount" },
        ],
        data
      );
    } else {
      sendCsv(res, timestampedName("bookings", "csv"), Object.keys(data[0]), data);
    }
  } catch (err) {
    console.error("Booking export failed:", err);
    res.status(500).json({ ok: false, message: "Booking export failed" });
  }
});

// ───────────────────────────────────────────────
// 🧾 PAYMENTS EXPORT
// ───────────────────────────────────────────────
router.get("/export/payments", adminOnly, async (req, res) => {
  try {
    const { format = "csv", search, status } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { reference: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const payments = await prisma.payment.findMany({
      where,
      include: { user: true, booking: { include: { property: true } } },
      orderBy: { createdAt: "desc" },
    });

    if (!payments.length) return res.status(404).json({ ok: false, message: "No payments found" });

    const data = payments.map((p) => ({
      id: p.id,
      reference: p.reference,
      user: p.user?.email,
      property: p.booking?.property?.title,
      amount: p.amount,
      status: p.status,
      createdAt: p.createdAt.toISOString().split("T")[0],
    }));

    if (format === "excel") {
      await sendExcel(
        res,
        timestampedName("payments", "xlsx"),
        [
          { label: "ID", key: "id" },
          { label: "Reference", key: "reference" },
          { label: "User", key: "user" },
          { label: "Property", key: "property" },
          { label: "Amount", key: "amount" },
          { label: "Status", key: "status" },
          { label: "Created At", key: "createdAt" },
        ],
        data
      );
    } else {
      sendCsv(res, timestampedName("payments", "csv"), Object.keys(data[0]), data);
    }
  } catch (err) {
    console.error("Payment export failed:", err);
    res.status(500).json({ ok: false, message: "Payment export failed" });
  }
});

export default router;