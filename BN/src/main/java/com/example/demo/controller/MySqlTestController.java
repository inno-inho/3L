package com.example.demo.controller;


import com.example.demo.domain.Repository.TestRepository;
import com.example.demo.domain.entity.TestEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MySqlTestController {

    private final TestRepository testRepository;

    @GetMapping("/mysql/save")
    public String save() {
        TestEntity user = new TestEntity();
        user.setName("Inno is Helen's");
        testRepository.save(user);
        return "saved";
    }

    @GetMapping("/mysql/list")
    public List<TestEntity> list() {
        return testRepository.findAll();
    }
}

