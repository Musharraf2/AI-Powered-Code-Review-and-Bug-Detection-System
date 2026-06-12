package com.codeReviewer.Controller;

import com.codeReviewer.DTO.PayloadRequestDTO;
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

//  1.
    @GetMapping("/showcode")
    private List<TestEntity> putCode() {
        return testService.showAllCode();
    }


//    2.
    @PostMapping("/save") // Changed from PutMapping to PostMapping (standard for creation)
    public String saveCode(@RequestBody PayloadRequestDTO requestDTO) {
        // Pass the DTO to the service to handle the conversion and saving
        testService.processAndSave(requestDTO);
        return "Data successfully converted and saved!";
    }

}
