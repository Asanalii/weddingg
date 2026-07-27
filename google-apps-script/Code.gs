// ============================================================
//  Той — приём ответов гостей и пожеланий, запись в таблицу
//  Ничего в этом коде менять НЕ нужно. Просто вставь целиком.
//  Ответы анкеты -> первый лист, пожелания -> лист «Тілектер».
// ============================================================

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    // ---------- Пожелание (блок «Тілектер») ----------
    if (data.type === "wish") {
      var wishSheet = ss.getSheetByName("Тілектер");
      if (!wishSheet) {
        wishSheet = ss.insertSheet("Тілектер");
        wishSheet.appendRow(["Дата", "Имя", "Пожелание", "Язык"]);
      }
      wishSheet.appendRow([
        new Date(),
        data.name || "",
        data.wish || "",
        data.lang || ""
      ]);

      return ContentService
        .createTextOutput(JSON.stringify({ result: "success" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ---------- Ответ анкеты гостя ----------
    var sheet = ss.getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Дата ответа", "Имя гостя", "Имя партнёра", "Придёт ли", "Язык"
      ]);
    }

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.partner || "",
      data.attendance || "",
      data.lang || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Проверка, что скрипт работает (открыть адрес в браузере).
function doGet(e) {
  return ContentService
    .createTextOutput("Скрипт работает. Готов принимать ответы гостей и пожелания.")
    .setMimeType(ContentService.MimeType.TEXT);
}
