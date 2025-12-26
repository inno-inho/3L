package com.example.demo.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@RestController
@RequestMapping("/api")
public class FrontTestController {

    @GetMapping("/hello")
    public String frontTest(){

        log.info("Front랑 BackEnd 연동 확인");

        return "Hello from Spring Boot, 부탁한다";
    }
}
