package com.codeReviewer.Controller;

import com.codeReviewer.Entity.TestEntity;
import com.codeReviewer.Service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private TestService testService;

    @Autowired
    TestController(TestService testService) {
        this.testService = testService;
    }


    @GetMapping("/showcode")
    private List<TestEntity> putCode() {
        return testService.showAllCode();
    }

    @PutMapping("/save")
    private TestEntity saveCode(@RequestBody TestEntity testEntity) {
        // Now you are passing a TestEntity object to your service, matching what it wants!
        return testService.saveCode(testEntity);
    }

}
