package com.example.minicrm.controller;

import com.example.minicrm.dto.DealRequest;
import com.example.minicrm.dto.DealResponse;
import com.example.minicrm.service.DealService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    @GetMapping
    public ResponseEntity<List<DealResponse>> findAll() {
        return ResponseEntity.ok(dealService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DealResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(dealService.findById(id));
    }

    @PostMapping
    public ResponseEntity<DealResponse> create(@Valid @RequestBody DealRequest request) {
        DealResponse response = dealService.create(request);
        return ResponseEntity.created(URI.create("/api/deals/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DealResponse> update(@PathVariable Long id, @Valid @RequestBody DealRequest request) {
        return ResponseEntity.ok(dealService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dealService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
