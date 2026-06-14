package com.example.toikhana.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * A single organization parsed from 2GIS, ready to be imported as a Toikhana.
 */
public class ImportItem {

    private String name;
    private String address;
    private String phone;
    private String whatsapp;
    private String website;
    private String source2gisId;
    private Double lat;
    private Double lon;
    private List<String> rubrics = new ArrayList<String>();
    private List<String> photoUrls = new ArrayList<String>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getSource2gisId() {
        return source2gisId;
    }

    public void setSource2gisId(String source2gisId) {
        this.source2gisId = source2gisId;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }

    public List<String> getRubrics() {
        return rubrics;
    }

    public void setRubrics(List<String> rubrics) {
        this.rubrics = rubrics;
    }

    public List<String> getPhotoUrls() {
        return photoUrls;
    }

    public void setPhotoUrls(List<String> photoUrls) {
        this.photoUrls = photoUrls;
    }
}
