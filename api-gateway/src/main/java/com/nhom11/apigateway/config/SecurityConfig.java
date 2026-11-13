package com.nhom11.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .csrf(csrf -> csrf.disable())                              // tắt CSRF (không cần cho API)
                .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())  // mọi request đều phải đăng nhập
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults())); // kiểm tra bằng token JWT
        return http.build();
    }
}
