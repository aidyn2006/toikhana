package com.example.toikhana.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "cities")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name_kk", nullable = false, length = 100)
    private String nameKk;

    @Column(name = "name_ru", nullable = false, length = 100)
    private String nameRu;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(name = "toikhana_count", nullable = false)
    private Integer toikhanaCount = 0;

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
