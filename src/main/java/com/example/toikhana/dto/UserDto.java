package com.example.toikhana.dto;

import com.example.toikhana.model.AppUser;

public class UserDto {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;

    public static UserDto from(AppUser user) {
        UserDto dto = new UserDto();
        dto.id = user.getId();
        dto.name = user.getName();
        dto.email = user.getEmail();
        dto.phone = user.getPhone();
        dto.role = user.getRole();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getRole() {
        return role;
    }
}
