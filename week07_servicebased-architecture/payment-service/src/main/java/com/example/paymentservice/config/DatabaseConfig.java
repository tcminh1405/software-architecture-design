package com.example.paymentservice.config;

import org.h2.tools.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.SQLException;

@Configuration
public class DatabaseConfig {

    /**
     * Khởi tạo H2 TCP Server để các service khác có thể kết nối dùng chung DB.
     * Port mặc định: 9092
     */
    @Bean(initMethod = "start", destroyMethod = "stop")
    public Server h2TcpServer() throws SQLException {
        return Server.createTcpServer("-tcp", "-tcpAllowOthers", "-tcpPort", "9092", "-baseDir", "./data");
    }
}
