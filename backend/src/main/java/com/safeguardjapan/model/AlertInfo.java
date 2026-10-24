package com.safeguardjapan.model;

import java.time.Instant;

public class AlertInfo {
    private String alertType;
    private String title;
    private String affectedArea;
    private String announcementTime;
    private String intensity;
    private String magnitude;
    private String severity; // critical, warning, advisory, info
    private String instructions;
    private String source;
    private String cachedAt;
    private boolean isCached;

    public AlertInfo() {
        this.cachedAt = Instant.now().toString();
    }

    public String getAlertType() { return alertType; }
    public void setAlertType(String alertType) { this.alertType = alertType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAffectedArea() { return affectedArea; }
    public void setAffectedArea(String affectedArea) { this.affectedArea = affectedArea; }

    public String getAnnouncementTime() { return announcementTime; }
    public void setAnnouncementTime(String announcementTime) { this.announcementTime = announcementTime; }

    public String getIntensity() { return intensity; }
    public void setIntensity(String intensity) { this.intensity = intensity; }

    public String getMagnitude() { return magnitude; }
    public void setMagnitude(String magnitude) { this.magnitude = magnitude; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getCachedAt() { return cachedAt; }
    public void setCachedAt(String cachedAt) { this.cachedAt = cachedAt; }

    public boolean isCached() { return isCached; }
    public void setCached(boolean cached) { isCached = cached; }
}
