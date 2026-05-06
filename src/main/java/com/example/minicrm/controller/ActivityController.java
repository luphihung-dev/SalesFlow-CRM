package com.example.minicrm.controller;

import com.example.minicrm.dto.ActivityRequest;
import com.example.minicrm.dto.ActivityResponse;
import com.example.minicrm.service.ActivityService;
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
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> findAll() {
        return ResponseEntity.ok(activityService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ActivityResponse> create(@Valid @RequestBody ActivityRequest request) {
        ActivityResponse response = activityService.create(request);
        return ResponseEntity.created(URI.create("/api/activities/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityResponse> update(@PathVariable Long id, @Valid @RequestBody ActivityRequest request) {
        return ResponseEntity.ok(activityService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        activityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
