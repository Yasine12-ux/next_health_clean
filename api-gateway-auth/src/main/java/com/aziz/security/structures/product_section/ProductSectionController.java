package com.aziz.security.structures.product_section;

import com.aziz.security.config.JwtService;
import com.aziz.security.structures.StructureMiniDto;
import com.aziz.security.structures.product_section.Dto.CreateProductSectionDto;
import com.aziz.security.structures.product_section.Dto.ProductSectionDto;
import com.aziz.security.structures.segment.dto.FullSegDto;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/structures/product-sections")
@RequiredArgsConstructor
public class ProductSectionController {
    private final ProductSectionService productSectionService;
    private final JwtService jwtService;

    @Operation(summary = "✅ : create productSection section ")
    @PostMapping("/product-section")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    ResponseEntity<?> createProductSection(
            @RequestBody CreateProductSectionDto createProductSectionDto){
        return productSectionService.createProductSection(createProductSectionDto);
    }

    @Operation(summary = "✅ : create many productSection sections(for excel) ")
    @PostMapping("/product-section-many")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    public ResponseEntity<?> createManyProductSections( @RequestBody List<CreateProductSectionDto> createProductSectionDtoList){
        return productSectionService.createManyProductSections(createProductSectionDtoList);
    }

    @Operation(summary = "✅ : get all productSection sections ")
    @GetMapping("/product-sections")
    ResponseEntity<?> findAllProductSections(){
        return ResponseEntity.ok(productSectionService.findAllProductSections());
    }

    @Operation(summary = "✅ : modify productSection section ")
    @PutMapping("/product-section")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    ResponseEntity<?> editProductSection(@RequestBody ProductSectionDto productSectionDto){
        return productSectionService.editProductSection(productSectionDto);
    }
    @Operation(summary = "✅ : delete productSection section ")
    @DeleteMapping("/product-section/{productSectionId}")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    ResponseEntity<?> deleteProductSection(@PathVariable Integer productSectionId){
        return productSectionService.deleteProductSection(productSectionId);
    }
    @Operation(summary = "✅ : find all segments by product section")
    @GetMapping("/product-section-segments/{productSectionId}")
    List<FullSegDto> productSectionSegments(@PathVariable Integer productSectionId){
        return productSectionService.productSectionSegments(productSectionId);
    }

    @Operation(summary = "✅ : get all product sections by plant in mini representation(name & id) ")
    @GetMapping("/plant-product-sections-mini/{plantId}")
    List<StructureMiniDto> plantProductSectionsMini(@PathVariable Integer plantId){
        return productSectionService.plantProductSectionsMiniRep(plantId);
    }

    @Operation()
    @GetMapping("/plant-product-plant-id/{productSectionId}")
    public ResponseEntity<?> getPsPlantIdById(@PathVariable Integer productSectionId){
        return productSectionService.getPsPlantIdById(productSectionId);
    }

    @Operation()
    @GetMapping("/all-nurse")
    public ResponseEntity<?> getMiniProductSectionsByNurse(
    HttpServletRequest request) {
        var email = jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return productSectionService.getMiniProductSectionsByNurse(email);
    }
}
