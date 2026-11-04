package com.intelliquest.controller;

import com.intelliquest.dto.SupportRequestDTO;
import com.intelliquest.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    @PostMapping("/support")
    public ResponseEntity<?> sendSupportRequest(@RequestBody SupportRequestDTO request) {
        supportService.sendSupportRequest(request);
        return ResponseEntity.ok("Support request sent successfully.");
    }
}
