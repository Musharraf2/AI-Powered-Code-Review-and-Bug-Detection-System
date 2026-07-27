package com.codeReviewer.Controller;

import com.codeReviewer.DTO.PayloadRequestDTO;
import com.codeReviewer.Entity.TestEntity;
import com.codeReviewer.Service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TestController {

    private final TestService testService;

    @Autowired
    TestController(TestService testService) {
        this.testService = testService;
    }

    //  1.
    @GetMapping("/showcode")
    private List<TestEntity> putCode(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal != null ? principal.getAttribute("email") : "anonymous";
        return testService.showAllCodeForUser(email);
    }


    //    2.
    @PostMapping(value = "/save", produces = "application/json") // Replace with your actual Postman mapping path
    public ResponseEntity<String> saveAndIngest(@RequestBody PayloadRequestDTO dto, @AuthenticationPrincipal OAuth2User principal) {
        String email = principal != null ? principal.getAttribute("email") : "anonymous";
        // This captures the returned hardcoded string from the service layer
        String result = testService.processAndSave(dto, email);

        // Send it directly back to Postman over HTTP
        return ResponseEntity.ok(result);
    }

}
