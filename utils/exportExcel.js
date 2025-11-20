// utils/exportExcel.js
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";

function timestampedName(filename) {
  const stamp = new Date().toISOString().split("T")[0];
  const [name, ext] = filename.split(".");
  return `${name}_${stamp}.${ext}`;
}

export async function exportToExcel(filename, columns, items) {
  if (!items?.length) {
    alert("No data to export");
    return;
  }

  const data = items.map((item) => {
    const row = {};
    columns.forEach((c) => {
      const val = typeof c.value === "function" ? c.value(item) : item[c.value];
      row[c.label] = val ?? "";
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const wbout = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
  const path = FileSystem.documentDirectory + timestampedName(filename);
  await FileSystem.writeAsStringAsync(path, wbout, { encoding: FileSystem.EncodingType.Base64 });
  await Sharing.shareAsync(path);
}