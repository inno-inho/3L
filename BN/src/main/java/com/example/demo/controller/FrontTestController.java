package com.example.demo.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class FrontTestController {

    @GetMapping("/hello")
    public String frontTest(){

        log.info("Front랑 BackEnd 연동 확인");

        return "Hello from Spring Boot";
    }
}
