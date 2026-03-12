package iuh.fit.se.adapter;

/**
 * Target Interface - Giao diện mà Web service client mong đợi.
 *
 * UML (Adapter Pattern):
 *
 *  +-----------------+        +------------------+        +------------+
 *  | WebServiceClient|------->|  JsonService     |<|------|XmlToJson   |
 *  |                 |        | <<interface>>    |        |Adapter     |
 *  |  -jsonService   |        |------------------|        |------------|
 *  |  +sendData()    |        |+processJson(str) |        |-xmlSystem  |
 *  +-----------------+        +------------------+        |+processJson|
 *                                                         +-----+------+
 *                                                               |
 *                                                         +-----v------+
 *                                                         | XmlSystem  |
 *                                                         | (Adaptee)  |
 *                                                         |------------|
 *                                                         |+processXml |
 *                                                         +------------+
 */
public interface JsonService {
    String processJson(String jsonData);
}
