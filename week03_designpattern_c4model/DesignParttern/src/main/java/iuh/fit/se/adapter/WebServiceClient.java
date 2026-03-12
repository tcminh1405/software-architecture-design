package iuh.fit.se.adapter;

/**
 * Client - Web service client chỉ biết JsonService interface.
 * Không biết gì về XmlSystem bên dưới.
 */
public class WebServiceClient {

    private final JsonService jsonService;

    public WebServiceClient(JsonService jsonService) {
        this.jsonService = jsonService;
    }

    public void sendData(String jsonData) {
        System.out.println("[WebServiceClient] Gửi JSON:\n    " + jsonData);
        String result = jsonService.processJson(jsonData);
        System.out.println("[WebServiceClient] Nhận kết quả:\n    " + result);
    }
}
