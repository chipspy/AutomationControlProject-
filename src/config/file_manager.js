/**
 * 웹 브라우저 기반 파일 입출력 모듈
 *
 * - JSON Export: 객체 데이터를 .json 파일로 다운로드
 * - JSON Import: 사용자가 선택한 .json 파일을 FileReader로 읽어 객체로 변환
 * - CSV Export: 배열 데이터를 .csv 파일로 변환하여 다운로드
 */
class FileManager {
  /**
   * Blob과 임시 <a> 태그를 이용해 브라우저 다운로드를 실행합니다.
   */
  static downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * 레시피 같은 JavaScript 객체를 JSON 파일로 저장합니다.
   *
   * @param {object} data 저장할 객체
   * @param {string} fileName 다운로드 파일명
   */
  static exportJson(data, fileName = "recipe.json") {
    const jsonText = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonText], {
      type: "application/json;charset=utf-8"
    });

    console.log("[FileManager] JSON 저장(Export):", fileName, data);
    FileManager.downloadBlob(blob, fileName);
  }

  /**
   * 사용자가 선택한 JSON 파일을 읽어서 JavaScript 객체로 변환합니다.
   *
   * 사용 예:
   * const input = document.querySelector("#jsonFileInput");
   * input.addEventListener("change", async (event) => {
   *   const data = await FileManager.importJson(event.target.files[0]);
   *   console.log(data);
   * });
   *
   * @param {File} file input[type=file]에서 선택된 File 객체
   * @returns {Promise<object>} JSON 파싱 결과 객체
   */
  static importJson(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("JSON 파일이 선택되지 않았습니다."));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          console.log("[FileManager] JSON 불러오기(Import):", file.name, data);
          resolve(data);
        } catch (error) {
          reject(new Error(`JSON 파싱 실패: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error(`파일 읽기 실패: ${reader.error?.message ?? "Unknown error"}`));
      };

      reader.readAsText(file, "utf-8");
    });
  }

  /**
   * 알람 이력 같은 배열 데이터를 CSV 파일로 저장합니다.
   *
   * @param {Array<object|Array>} rows CSV로 변환할 리스트 데이터
   * @param {string} fileName 다운로드 파일명
   * @param {Array<string>} headers CSV 헤더. 생략 시 객체 key를 자동 사용
   */
  static exportCsv(rows, fileName = "alarm_history.csv", headers = null) {
    if (!Array.isArray(rows)) {
      throw new Error("CSV 저장 데이터는 배열이어야 합니다.");
    }

    const csvText = FileManager.convertToCsv(rows, headers);

    // Excel에서 한글이 깨지지 않도록 UTF-8 BOM 추가
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvText], {
      type: "text/csv;charset=utf-8"
    });

    console.log("[FileManager] CSV 저장(Export):", fileName, rows);
    FileManager.downloadBlob(blob, fileName);
  }

  /**
   * 배열 데이터를 CSV 문자열로 변환합니다.
   */
  static convertToCsv(rows, headers = null) {
    if (rows.length === 0) {
      return headers ? FileManager.toCsvLine(headers) : "";
    }

    const isArrayRows = Array.isArray(rows[0]);
    const csvHeaders = headers ?? (isArrayRows ? null : Object.keys(rows[0]));
    const lines = [];

    if (csvHeaders) {
      lines.push(FileManager.toCsvLine(csvHeaders));
    }

    rows.forEach((row) => {
      const values = isArrayRows
        ? row
        : csvHeaders.map((header) => row[header] ?? "");

      lines.push(FileManager.toCsvLine(values));
    });

    return lines.join("\r\n");
  }

  /**
   * CSV 한 줄을 생성합니다.
   * 쉼표, 따옴표, 줄바꿈이 포함된 값은 Excel 호환을 위해 따옴표로 감쌉니다.
   */
  static toCsvLine(values) {
    return values
      .map((value) => {
        const text = String(value ?? "");
        const escapedText = text.replace(/"/g, '""');
        const shouldQuote = /[",\r\n]/.test(escapedText);

        return shouldQuote ? `"${escapedText}"` : escapedText;
      })
      .join(",");
  }
}

// 브라우저 전역 객체로 노출
if (typeof window !== "undefined") {
  window.FileManager = FileManager;
}

// Node.js 테스트 환경에서도 사용할 수 있도록 처리
if (typeof module !== "undefined" && module.exports) {
  module.exports = FileManager;
}
