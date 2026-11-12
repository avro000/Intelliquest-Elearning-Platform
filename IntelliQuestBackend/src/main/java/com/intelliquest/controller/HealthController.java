package com.intelliquest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @RequestMapping(value = {"/", "/health", "/api/health"}, method = {RequestMethod.GET, RequestMethod.HEAD})
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }
}
