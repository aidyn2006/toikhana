package com.example.toikhana.dto;

import javax.validation.constraints.NotBlank;

public class AdminBookingStatusRequest {

    @NotBlank
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
