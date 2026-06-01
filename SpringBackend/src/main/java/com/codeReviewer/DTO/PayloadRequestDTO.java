package com.codeReviewer.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PayloadRequestDTO {
    @JsonProperty("id")
    private String id;
    private String code;
    @JsonProperty("AdditionalInformation")
    private String AdditionalInformation;
}
