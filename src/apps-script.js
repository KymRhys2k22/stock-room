// ===== GOOGLE APPS SCRIPT (FINAL VERSION) =====
// Web App: Execute as "Me", Access: Anyone

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "success",
      message: "GET request received. Use POST to interact with data.",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    // Wait for up to 10 seconds for other processes to finish.
    lock.tryLock(10000);

    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master");
    if (!sheet) throw new Error("Sheet 'Master' not found");

    const headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    const upcIndex = headers.indexOf("UPC");
    const fixtureIndex = headers.indexOf("FIXTURE");
    const qtyIndex = headers.indexOf("QTY");
    const boxIndex = headers.indexOf("BOX");

    if (upcIndex === -1) throw new Error("UPC column not found");

    // Parse data: Check parameters (form data) first, then JSON
    let data = e.parameter || {};

    // If no action in parameters, try parsing JSON body
    if (!data.action && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (ignore) {
        // Not JSON
      }
    }

    action = data.action;
    upc = String(data.upc || "").trim();

    if (!action || !upc) throw new Error("Missing action or UPC");

    // Find existing row by UPC + FIXTURE
    const lastRow = sheet.getLastRow();
    let rowIndex = -1;

    // Use original_fixture if provided (for updates), otherwise fixture
    // This allows us to find the row even if we're changing the fixture name
    const lookupFixture = data.original_fixture || data.fixture || "";
    const targetFixture = String(lookupFixture).trim().toLowerCase();
    const targetUpc = upc.toLowerCase();

    if (lastRow > 1) {
      // Get all data to search
      const allData = sheet
        .getRange(2, 1, lastRow - 1, sheet.getLastColumn())
        .getValues();

      for (let i = 0; i < allData.length; i++) {
        const rowUpc = String(allData[i][upcIndex]).trim().toLowerCase();
        const rowFixture = String(allData[i][fixtureIndex])
          .trim()
          .toLowerCase();

        if (rowUpc === targetUpc && rowFixture === targetFixture) {
          rowIndex = i + 2; // +2 because 1-based index and header row
          break;
        }
      }
    }

    // CREATE — inserts only UPC, FIXTURE, QTY, BOX
    if (action === "create") {
      if (rowIndex !== -1) throw new Error("UPC and Fixture already exists");

      const newRow = new Array(headers.length).fill("");
      newRow[upcIndex] = upc;
      if (fixtureIndex !== -1) newRow[fixtureIndex] = data.fixture || "";
      if (qtyIndex !== -1) newRow[qtyIndex] = data.qty || 0;
      if (boxIndex !== -1) newRow[boxIndex] = data.box || "";

      sheet.appendRow(newRow);
      return respond({ status: "success", message: "Created successfully" });
    }

    // UPDATE
    if (action === "update") {
      if (rowIndex === -1)
        throw new Error("UPC and Fixture combination not found");

      if (fixtureIndex !== -1)
        sheet.getRange(rowIndex, fixtureIndex + 1).setValue(data.fixture);
      if (qtyIndex !== -1)
        sheet.getRange(rowIndex, qtyIndex + 1).setValue(data.qty);
      if (boxIndex !== -1)
        sheet.getRange(rowIndex, boxIndex + 1).setValue(data.box);

      return respond({ status: "success", message: "Updated successfully" });
    }

    // DELETE
    if (action === "delete") {
      if (rowIndex === -1)
        throw new Error("UPC and Fixture combination not found");

      sheet.deleteRow(rowIndex);
      return respond({ status: "success", message: "Deleted successfully" });
    }

    throw new Error("Invalid action");
  } catch (err) {
    return respond({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
