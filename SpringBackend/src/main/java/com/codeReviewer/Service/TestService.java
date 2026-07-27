package com.codeReviewer.Service;

import com.codeReviewer.DTO.PayloadRequestDTO;
import com.codeReviewer.Entity.TestEntity;
import com.codeReviewer.Repository.TestRepository;
import org.jspecify.annotations.NonNull;
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

    public List<TestEntity> showAllCodeForUser(String userEmail) {
        return testRepository.findByUserEmail(userEmail);
    }


    //    2.
    public String processAndSave(PayloadRequestDTO dto, String userEmail) {
        // 1. Format the text for LangChain
        TestEntity entity = getTestEntity(dto);
        entity.setUserEmail(userEmail);

        // 3. Save to PostgreSQL
        TestEntity savedEntity = testRepository.save(entity);

        // 4. Send to LangChain (Python/FastAPI)
        try {
            RestTemplate restTemplate = new RestTemplate();
            String pythonApiUrl = "http://localhost:8000/api/ingest";

            // We send the 'savedEntity' because it now contains your processedText!
            String response = restTemplate.postForObject(pythonApiUrl, savedEntity, String.class);
            System.out.println("Successfully sent to LangChain: " + response);

            // Save the analysis results returned from Python back to the PostgreSQL database
            savedEntity.setAnalysisResult(response);
            testRepository.save(savedEntity);

            // 2. Return the Python response back to the Controller
            return response;

        } catch (Exception e) {
            System.out.println("Failed to send to LangChain: " + e.getMessage());
            // Create a fallback analysis result in case Python is down, so the frontend doesn't break
            String fallbackResponse = "{"
                    + "\"code\": \"" + dto.getCode().replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "") + "\","
                    + "\"highlights\": [],"
                    + "\"issues\": [{"
                    + "  \"id\": \"fallback-err\","
                    + "  \"agent\": \"System\","
                    + "  \"severity\": \"warning\","
                    + "  \"line\": 1,"
                    + "  \"title\": \"LangChain Offline\","
                    + "  \"description\": \"Could not reach LangChain Python backend. Review is generated as offline fallback. Error: " + e.getMessage().replace("\"", "\\\"") + "\","
                    + "  \"oldCode\": \"\","
                    + "  \"newCode\": \"\""
                    + "}],"
                    + "\"metrics\": {\"security\": 0, \"bugs\": 0, \"quality\": 0, \"improvements\": 1}"
                    + "}";
            savedEntity.setAnalysisResult(fallbackResponse);
            testRepository.save(savedEntity);
            return fallbackResponse;
        }
    }

    private static @NonNull TestEntity getTestEntity(PayloadRequestDTO dto) {
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
        return entity;
    }
}
