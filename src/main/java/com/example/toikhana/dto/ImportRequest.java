package com.example.toikhana.dto;

import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

/**
 * Bulk-import payload sent by the 2GIS parser service.
 */
public class ImportRequest {

    @NotNull
    private Long cityId;

    /** Whether imported records become visible on the site right away. */
    private boolean active = true;

    private List<ImportItem> items = new ArrayList<ImportItem>();

    public Long getCityId() {
        return cityId;
    }

    public void setCityId(Long cityId) {
        this.cityId = cityId;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<ImportItem> getItems() {
        return items;
    }

    public void setItems(List<ImportItem> items) {
        this.items = items;
    }
}
