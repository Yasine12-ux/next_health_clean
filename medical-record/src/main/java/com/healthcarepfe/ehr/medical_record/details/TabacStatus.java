package com.healthcarepfe.ehr.medical_record.details;

public enum TabacStatus {
    FUMEUR("Fumeur"),
    EX_FUMEUR("Ex-fumeur"),
    NON_FUMEUR("Non fumeur");
    private final String displayValue;
    TabacStatus(String displayValue) {
        this.displayValue = displayValue;
    }
    public String getDisplayValue() {
        return displayValue;
    }
}
