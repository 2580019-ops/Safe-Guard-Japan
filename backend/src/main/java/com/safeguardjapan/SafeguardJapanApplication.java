package com.safeguardjapan;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
@MapperScan("com.safeguardjapan.mapper")
public class SafeguardJapanApplication {

    public static void main(String[] args) {
        SpringApplication.run(SafeguardJapanApplication.class, args);
    }
}
