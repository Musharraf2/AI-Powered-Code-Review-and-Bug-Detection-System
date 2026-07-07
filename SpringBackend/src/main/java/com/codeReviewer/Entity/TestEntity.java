package com.codeReviewer.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class TestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String providedId; // The ID from the frontend JSON
    private String codeLanguage;
    private String code;

    @Column(columnDefinition = "TEXT")
    private String additionalInformation;

    // NEW: Store the formatted text for LangChain/Spring AI
    @Column(columnDefinition = "TEXT")
    private String processedText;

    // NEW: Store the generated analysis results JSON
    @Column(columnDefinition = "TEXT")
    private String analysisResult;

}