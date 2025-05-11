package com.aziz.security.structures;

import com.aziz.security.structures.line.Line;
import com.aziz.security.structures.plant.Plant;
import com.aziz.security.structures.product_section.ProductSection;
import com.aziz.security.structures.segment.Segment;

/***
 * Simple representation Id and Name
 * @param id
 * @param name
 */
public record StructureMiniDto(Integer id, String name) {
    public static StructureMiniDto toStructureMiniDto(Line structure){
        return new StructureMiniDto(structure.getId(), structure.getName());
    }
    public static StructureMiniDto toStructureMiniDto(Segment structure){
        return new StructureMiniDto(structure.getId(), structure.getName());
    }
    public static StructureMiniDto toStructureMiniDto(ProductSection structure){
        return new StructureMiniDto(structure.getId(), structure.getName());
    }
    public static StructureMiniDto toStructureMiniDto(Plant plant){
        return new StructureMiniDto(plant.getId(), plant.getName());
    }
}
