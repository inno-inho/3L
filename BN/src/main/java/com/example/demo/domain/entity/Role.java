package com.example.demo.domain.entity;

/**
 * 사용자 권한 Enum
 *
 * - EnumType.STRING → DB에 "USER", "ADMIN" 문자열로 저장
 * - 숫자(EnumType.ORDINAL)는 권장 ❌
 */
public enum Role {
    USER,
    ADMIN
}