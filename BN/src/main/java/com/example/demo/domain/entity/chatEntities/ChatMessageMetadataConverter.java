package com.example.demo.domain.entity.chatEntities;

import com.example.demo.domain.dto.chatDto.ChatMessageDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;


// DB의 TEXT 타입과 Java의 ChatMetadata 객체를 자동으로 상호 변환해주는 역할
@Converter
public class ChatMessageMetadataConverter implements AttributeConverter<ChatMessageDto.ChatMetadata, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(ChatMessageDto.ChatMetadata attribute) {
        if (attribute == null) return null;
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON writing error", e);
        }
    }

    @Override
    public ChatMessageDto.ChatMetadata convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return null;

        try {
            return objectMapper.readValue(dbData, ChatMessageDto.ChatMetadata.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON reading error", e);
        }
    }
}
