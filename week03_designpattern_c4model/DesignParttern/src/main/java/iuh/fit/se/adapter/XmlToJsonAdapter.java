package iuh.fit.se.adapter;

/**
 * Adapter - Cầu nối giữa JsonService và XmlSystem.
 *
 * Luồng xử lý:
 *   Client → processJson(json)
 *            → convertJsonToXml(json)   → xml
 *            → xmlSystem.processXml(xml) → xmlResult
 *            → convertXmlToJson(xmlResult) → jsonResult
 *   Client ← jsonResult
 */
public class XmlToJsonAdapter implements JsonService {

    private final XmlSystem xmlSystem;

    public XmlToJsonAdapter(XmlSystem xmlSystem) {
        this.xmlSystem = xmlSystem;
    }

    @Override
    public String processJson(String jsonData) {
        System.out.println("  [Adapter] Nhận JSON từ client:\n    " + jsonData);

        // Bước 1: JSON → XML
        String xmlData = xmlSystem.convertJsonToXml(jsonData);
        System.out.println("  [Adapter] Chuyển thành XML:\n    " + xmlData);

        // Bước 2: XmlSystem xử lý XML
        String xmlResult = xmlSystem.processXml(xmlData);

        // Bước 3: XML → JSON
        String jsonResult = xmlSystem.convertXmlToJson(xmlResult);
        System.out.println("  [Adapter] Chuyển kết quả về JSON:\n    " + jsonResult);

        return jsonResult;
    }
}
