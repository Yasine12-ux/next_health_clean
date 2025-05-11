package com.aziz.security.permission;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum StructureRelationType {
    PLANT_MANAGER,
    PRODUCT_SECTION_MANAGER,
    SEGMENT_MANAGER,
    LINE_MANAGER,
    WORKER, // ouvrière
    RH_SEGMENT,
    DOCTOR,
    NURSE // Infirmière
    ;
}
