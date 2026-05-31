package com.codeReviewer.Service;

import com.codeReviewer.Entity.TestEntity;
import com.codeReviewer.Repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestService {

    private TestRepository testReposiotry;

    @Autowired
    TestService(TestRepository testRepository) {
        this.testReposiotry = testRepository;
    }

    public List<TestEntity> showAllCode() {
        return testReposiotry.findAll();
    }


    public TestEntity saveCode(TestEntity testEntity) {
        // It takes the entity with the ID and Code from the controller and saves it
        return testReposiotry.save(testEntity);
    }

}
