package com.thymeleaf;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ThymeleafApplication {
    public static void main(String[] args) {
        SpringApplication.run(ThymeleafApplication.class, args);
    }
}

