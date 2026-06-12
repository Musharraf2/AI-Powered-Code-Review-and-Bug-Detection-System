package com.codeReviewer.Service;

import com.codeReviewer.DTO.PayloadRequestDTO;
import com.codeReviewer.Entity.TestEntity;
import com.codeReviewer.Repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class TestService {

    private final TestRepository testRepository;

    @Autowired
    TestService(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

//    This function automatically show all the document present in the DB

    public List<TestEntity> showAllCode() {
        return testRepository.findAll();
    }


    //    2.
    public void processAndSave(PayloadRequestDTO dto) {
        // 1. Format the text for LangChain
        String plainTextForAI = "[Code Review Document]\n" +
                "ID: " + dto.getProvidedId() + "\n" +
                "Code Snippet: " + dto.getCode() + "\n" +
                "Context: " + dto.getAdditionalInformation();

        // 2. Map to your Database Entity
        TestEntity entity = new TestEntity();
        entity.setProvidedId(dto.getProvidedId());
        entity.setCode(dto.getCode());
        entity.setAdditionalInformation(dto.getAdditionalInformation());
        entity.setProcessedText(plainTextForAI);

        // 3. Save to PostgreSQL
        TestEntity savedEntity = testRepository.save(entity);

        // 4. Send to LangChain (Python/FastAPI)
        try {
            RestTemplate restTemplate = new RestTemplate();
            String pythonApiUrl = "http://localhost:8000/api/ingest";

            // We send the 'savedEntity' because it now contains your processedText!
            String response = restTemplate.postForObject(pythonApiUrl, savedEntity, String.class);
            System.out.println("Successfully sent to LangChain: " + response);

        } catch (Exception e) {
            System.out.println("Failed to send to LangChain: " + e.getMessage());
        }
    }
}
