// utils/exportCsv.js
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

function timestampedName(filename) {
  const stamp = new Date().toISOString().split("T")[0];
  const [name, ext] = filename.split(".");
  return `${name}_${stamp}.${ext}`;
}

export async function exportToCsv(filename, columns, items) {
  if (!items?.length) {
    alert("No data to export");
    return;
  }

  const header = columns.map((c) => c.label).join(",");
  const rows = items.map((item) =>
    columns
      .map((c) => {
        const value =
          typeof c.value === "function" ? c.value(item) : item[c.value];
        return `"${String(value ?? "").replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  const csv = [header, ...rows].join("\n");

  const path = FileSystem.documentDirectory + timestampedName(filename);
  await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(path);
}