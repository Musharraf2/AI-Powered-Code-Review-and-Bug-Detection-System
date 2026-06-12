package com.codeReviewer.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PayloadRequestDTO {
    @JsonProperty("id")
    private String providedId; // Catch the frontend ID here

    private String code;

    @JsonProperty("AdditionalInformation")
    private String additionalInformation; // camelCase
}
