package com.example.toikhana.dto;

public class CityDto {
    private Long id;
    private String nameKk;
    private String nameRu;
    private String slug;
    private Integer toikhanaCount;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameKk() {
        return nameKk;
    }

    public void setNameKk(String nameKk) {
        this.nameKk = nameKk;
    }

    public String getNameRu() {
        return nameRu;
    }

    public void setNameRu(String nameRu) {
        this.nameRu = nameRu;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public Integer getToikhanaCount() {
        return toikhanaCount;
    }

    public void setToikhanaCount(Integer toikhanaCount) {
        this.toikhanaCount = toikhanaCount;
    }
}
