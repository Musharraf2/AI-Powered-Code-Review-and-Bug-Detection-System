package com.codeReviewer.Repository;

import com.codeReviewer.Entity.TestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<TestEntity,Integer> {
    List<TestEntity> findByUserEmail(String userEmail);
}
