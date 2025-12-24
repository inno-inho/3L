package com.example.demo.controller;

import com.example.demo.Repository.TestRepository;
import com.example.demo.entity.TestEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MySqlTestController {

    private final TestRepository testRepository;

    @GetMapping("/mysql/save")
    public String save() {
        TestEntity user = new TestEntity();
        user.setName("inho");
        testRepository.save(user);
        return "saved";
    }

    @GetMapping("/mysql/list")
    public List<TestEntity> list() {
        return testRepository.findAll();
    }
}

