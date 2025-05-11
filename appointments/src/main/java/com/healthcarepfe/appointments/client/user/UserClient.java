package com.healthcarepfe.appointments.client.user;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "user-line-service",url = "${application.config.users-url}")
public interface UserClient {
    @GetMapping("/line-workers/{line}")
    List<User> findAllLineWorkersByLine(@PathVariable Integer line);

    @GetMapping("/line-manager/{line}")
    User findLineManagerByLineId(@PathVariable Integer line);

    @GetMapping("/plant-manager/{plant}")
    User findPlantManagerByPlantId(@PathVariable Integer plant);

    @GetMapping("/product-section-manager/{productSection}")
    User findProductSectionManagerByProductSectionId(@PathVariable Integer productSection);

    @GetMapping("/segment-manager/{segment}")
    User findSegmentManagerBySegmentId(@PathVariable Integer segment);
}
