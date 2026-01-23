package iuh.fit.se.testperformace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class TestPerformaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TestPerformaceApplication.class, args);
    }

}
