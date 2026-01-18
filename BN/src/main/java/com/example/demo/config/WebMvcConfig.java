package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry resourceHandlerRegistry) {

        // 브라우저에서 /uploads/ 로 시작하는 주소로 요청이 오면
        resourceHandlerRegistry.addResourceHandler("/uploads/**")
                // 실제 로콜 컴퓨터의 C:/chat_uploads/ 폴더에서 파일을 찾는다.
                .addResourceLocations("file:///C:/chat_uploads/");
    }

}
