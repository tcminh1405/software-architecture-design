package iuh.fit.se.adapter;

/**
 * Adaptee - Hệ thống cũ (legacy) chỉ hỗ trợ XML.
 * Không thể sửa đổi class này.
 */
public class XmlSystem {

    /** Xử lý dữ liệu XML và trả về kết quả XML */
    public String processXml(String xmlData) {
        System.out.println("  [XmlSystem] Xử lý XML:\n    " + xmlData);
        // Giả lập xử lý: đổi thẻ <data> thành <result>
        String result = xmlData.replace("<data>", "<result>")
                               .replace("</data>", "</result>");
        System.out.println("  [XmlSystem] Kết quả XML:\n    " + result);
        return result;
    }

    /** Chuyển đổi XML đơn giản → JSON (mô phỏng) */
    public String convertXmlToJson(String xml) {
        String key   = xml.replaceAll(".*<key>(.*?)</key>.*",   "$1").trim();
        String value = xml.replaceAll(".*<value>(.*?)</value>.*","$1").trim();
        return "{ \"key\": \"" + key + "\", \"value\": \"" + value + "\" }";
    }

    /** Chuyển đổi JSON đơn giản → XML (mô phỏng) */
    public String convertJsonToXml(String json) {
        String key   = json.replaceAll(".*\"key\"\\s*:\\s*\"([^\"]+)\".*",   "$1");
        String value = json.replaceAll(".*\"value\"\\s*:\\s*\"([^\"]+)\".*", "$1");
        return "<data><key>" + key + "</key><value>" + value + "</value></data>";
    }
}
