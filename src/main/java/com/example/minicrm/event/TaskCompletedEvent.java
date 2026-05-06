package com.example.minicrm.event;

public record TaskCompletedEvent(Long taskId, Long customerId) {
}
